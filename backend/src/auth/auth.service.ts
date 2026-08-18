import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { ApiErrorCode } from '../common/api-error-code';
import { PublicUser } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

const PASSWORD_HASH_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(credentials: AuthCredentialsDto) {
    if (await this.usersService.existsByEmail(credentials.email)) {
      throw new ConflictException({
        code: ApiErrorCode.emailExists,
        message: '该电子邮箱已注册',
      });
    }

    const passwordHash = await hash(credentials.password, PASSWORD_HASH_ROUNDS);
    const user = await this.usersService.create(
      credentials.email,
      passwordHash,
    );

    return {
      message: '注册成功，请使用新账户登录',
      user,
    };
  }

  async login(credentials: AuthCredentialsDto) {
    const user = await this.usersService.findByEmailWithPassword(
      credentials.email,
    );

    if (!user) {
      throw new UnauthorizedException({
        code: ApiErrorCode.userNotFound,
        message: '该电子邮箱尚未注册',
      });
    }

    if (!(await compare(credentials.password, user.passwordHash))) {
      throw new UnauthorizedException({
        code: ApiErrorCode.invalidPassword,
        message: '密码错误，请重新输入',
      });
    }

    const token = await this.jwtService.signAsync({ sub: user.id });

    return {
      message: '登录成功',
      token,
      user: this.toPublicUser(user),
    };
  }

  async getCurrentUser(id: string) {
    const user = await this.usersService.findPublicById(id);

    if (!user) {
      throw new UnauthorizedException({
        code: ApiErrorCode.invalidSession,
        message: '登录用户不存在，请重新登录',
      });
    }

    return user;
  }

  private toPublicUser(user: PublicUser): PublicUser {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
