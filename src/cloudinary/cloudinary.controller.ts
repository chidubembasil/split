import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService, MediaType } from './cloudinary.service.js';
import { mediaUploadOptions } from './media-upload.options.js';
@Controller('media')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', mediaUploadOptions))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    return this.cloudinaryService.uploadMedia(file, 'media');
  }

  @Post('upload-many')
  @UseInterceptors(FilesInterceptor('files', 10, mediaUploadOptions))
  async uploadMany(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) throw new BadRequestException('No files provided');
    return Promise.all(
      files.map((file) => this.cloudinaryService.uploadMedia(file, 'media')),
    );
  }

  @Delete()
  async remove(
    @Body() body: { publicId: string; resourceType: MediaType },
  ) {
    return this.cloudinaryService.deleteMedia(body.publicId, body.resourceType);
  }
}