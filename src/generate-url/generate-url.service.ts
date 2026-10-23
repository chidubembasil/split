import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { DatabaseService } from '../database/database.service.js';


@Injectable()
export class GenerateUrlService {
   constructor(private readonly prisma: DatabaseService) {}

  async generateUrl(userId: string) {
    const baseUrl = process.env.STOREFRONT_BASE_URL;

    if (!baseUrl) {
      throw new InternalServerErrorException(
        'STOREFRONT_BASE_URL is not configured',
      );
    }

    // Find the store belonging to this user.
    const store = await this.prisma.store.findUnique({
      where: { userId },
    });

    if (!store) {
      throw new NotFoundException(
        'Create your store before generating its URL',
      );
    }

    // Reuse the existing public URL.
    if (store.publicId) {
      return {
        storeId: store.id,
        publicId: store.publicId,
        url: `${baseUrl.replace(/\/+$/, '')}/${store.publicId}`,
      };
    }

    // Generate a unique public identifier.
    const publicId = randomBytes(12).toString('hex');

    // Save the identifier in the existing Store record.
    const updatedStore = await this.prisma.store.update({
      where: { id: store.id },
      data: { publicId },
    });

    return {
      storeId: updatedStore.id,
      publicId: updatedStore.publicId,
      url: `${baseUrl.replace(/\/+$/, '')}/${updatedStore.publicId}`,
    };
  }
}
