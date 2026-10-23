import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../../lib/auth.js';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    request.user = session.user;
    request.session = session.session;

    return true;
  }
}