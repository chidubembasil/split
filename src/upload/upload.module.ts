import { Module } from '@nestjs/common';
import { UploadService } from './upload.service.js';
import { UploadController } from './upload.controller.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
  imports : [CloudinaryModule]
})
export class UploadModule {}
