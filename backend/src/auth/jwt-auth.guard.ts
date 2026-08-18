import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiErrorCode } from '../common/api-error-code';
import { AUTH_COOKIE_NAME } from './auth.constants';
import { AuthRequest } from './auth.types';

type SessionPayload = {
  sub?: string;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = request.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      throw this.invalidSession();
    }

    try {
      const payload = await this.jwtService.verifyAsync<SessionPayload>(token);

      if (!payload.sub) {
        throw this.invalidSession();
      }

      request.user = { id: payload.sub };
      return true;
    } catch {
      throw this.invalidSession();
    }
  }

  private invalidSession() {
    return new UnauthorizedException({
      code: ApiErrorCode.invalidSession,
      message: '登录状态已失效，请重新登录',
    });
  }
}
