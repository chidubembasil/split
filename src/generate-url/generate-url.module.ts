import { Module } from '@nestjs/common';
import { GenerateUrlService } from './generate-url.service.js';
import { GenerateUrlController } from './generate-url.controller.js';

@Module({
  controllers: [GenerateUrlController],
  providers: [GenerateUrlService],
})
export class GenerateUrlModule {}
