import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ApiErrorCode } from '../common/api-error-code';
import { PublicUser, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async existsByEmail(email: string) {
    return this.usersRepository.existsBy({ email });
  }

  async create(email: string, passwordHash: string): Promise<PublicUser> {
    try {
      const user = this.usersRepository.create({ email, passwordHash });
      const savedUser = await this.usersRepository.save(user);
      return this.toPublicUser(savedUser);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.toLowerCase().includes('unique')
      ) {
        throw new ConflictException({
          code: ApiErrorCode.emailExists,
          message: '该电子邮箱已注册',
        });
      }

      throw error;
    }
  }

  async findByEmailWithPassword(email: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findPublicById(id: string): Promise<PublicUser | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user ? this.toPublicUser(user) : null;
  }

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
