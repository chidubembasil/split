import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service.js';
import { CloudinaryController } from './cloudinary.controller.js';
// import { Cloudinary } from './cloudinary.js';
import { CloudinaryProvider } from './cloudinary.provider.js';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryProvider, ConfigService],
  exports: [CloudinaryProvider, CloudinaryService]
})
export class CloudinaryModule {}
