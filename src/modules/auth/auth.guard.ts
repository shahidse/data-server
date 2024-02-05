import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
      const isAdmin = this.reflector.getAllAndOverride<boolean>('isAdmin', [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        // 💡 See this condition
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('UNAUTHORIZED', {
          cause: 'user is unauthorized',
          description: 'user is unauthorized',
        });
      }
      const isTokenValid = await this.authService.findToken(token);
      if (isTokenValid) {
        throw new UnauthorizedException('UNAUTHORIZED', {
          cause: 'user is unauthorized',
          description: 'user is unauthorized',
        });
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
      // if (payload.roleName == 'admin') {
      //   request['admin'] = payload;
      // }
      return true;
    } catch (error) {
      throw new UnauthorizedException('UNAUTHORIZED', {
        cause: 'user is unauthorized',
        description: 'user is unauthorized',
      });
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
