import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { auth } from '../lib/auth.js';

@Injectable()
export class StoreContextService {
  constructor(
    private readonly prisma: DatabaseService,
  ) {}

  async getStoreId(headers: Headers): Promise<string> {
    const session = await auth.api.getSession({ headers });

    if (!session) {
      throw new UnauthorizedException('Not logged in');
    }

    const userId = session.user.id;

    const store = await this.prisma.store.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store.id;
  }
}