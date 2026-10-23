import {
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { GenerateUrlService } from './generate-url.service.js';


type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};
@Controller('generate-url')
export class GenerateUrlController {
  constructor(private readonly generateUrlService: GenerateUrlService) {}

 @Post('generate-url')
  async generateUrl(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Please log in first');
    }

    return this.generateUrlService.generateUrl(userId);
  }
}
