import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

describe('Authentication API (e2e)', () => {
  let app: INestApplication<App>;
  let sessionCookie: string;

  const credentials = {
    email: 'person@example.com',
    password: 'Strong1!',
  };

  beforeAll(async () => {
    process.env.DATABASE_PATH = ':memory:';
    process.env.DB_SYNCHRONIZE = 'true';
    process.env.JWT_SECRET = 'test-only-jwt-secret';
    process.env.FRONTEND_ORIGIN = 'http://localhost:3000';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('reports service health', async () => {
    await request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok', service: 'api' });
  });

  it('rejects invalid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({ email: 'invalid email', password: '' })
      .expect(400);

    expect(response.body).toMatchObject({ code: 'VALIDATION_ERROR' });
  });

  it('creates a user without exposing the password hash', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send(credentials)
      .expect(201);

    expect(response.body).toMatchObject({
      success: true,
      message: '注册成功，请使用新账户登录',
      user: { email: credentials.email },
    });
    expect((response.body as { user?: unknown }).user).not.toHaveProperty(
      'passwordHash',
    );
  });

  it('rejects a duplicate email', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send(credentials)
      .expect(409);

    expect(response.body).toMatchObject({ code: 'AUTH_EMAIL_EXISTS' });
  });

  it('returns a distinct error for an unknown email', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ ...credentials, email: 'missing@example.com' })
      .expect(401);

    expect(response.body).toMatchObject({ code: 'AUTH_USER_NOT_FOUND' });
  });

  it('returns a distinct error for an incorrect password', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ ...credentials, password: 'Incorrect1!' })
      .expect(401);

    expect(response.body).toMatchObject({ code: 'AUTH_INVALID_PASSWORD' });
  });

  it('creates an HttpOnly session after login', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);

    const cookies = response.headers['set-cookie'] as unknown as string[];
    expect(cookies[0]).toContain('HttpOnly');
    sessionCookie = cookies[0].split(';')[0];
  });

  it('returns the current user for a valid session', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Cookie', sessionCookie)
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      user: { email: credentials.email },
    });
  });

  it('clears the session on logout', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Cookie', sessionCookie)
      .expect(200);

    const cookies = response.headers['set-cookie'] as unknown as string[];
    expect(cookies[0]).toContain('session=;');
  });

  afterAll(async () => {
    await app.close();
  });
});
