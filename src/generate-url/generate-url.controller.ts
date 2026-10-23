import {
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenerateUrlService } from './generate-url.service.js';
import { AuthGuard } from '../auth/guards/auth/auth.guard.js';


type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};
@ApiTags('GenerateUrl')
@Controller('generate-url')
export class GenerateUrlController {
  constructor(private readonly generateUrlService: GenerateUrlService) {}

  @ApiOperation({ summary: 'Generate share URL' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('generate-url')
  async generateUrl(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Please log in first');
    }

    return this.generateUrlService.generateUrl(userId);
  }
}
