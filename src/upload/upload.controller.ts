import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, Put, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service.js';
import { CreateUploadDto } from './dto/create-upload.dto.js';
import { UpdateUploadDto } from './dto/update-upload.dto.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth/auth.guard.js';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  create(
      @UploadedFiles() files: Express.Multer.File[],
      @Body() createUploadDto: CreateUploadDto,
      userId: string, profileId: string
    ) {
    return this.uploadService.create(createUploadDto, files, userId, profileId);
  }

  // @Get()
  // findAll() {
  //   return this.uploadService.findAll();
  // }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  update(
    @Param('id') id: string, 
    @Body() updateUploadDto: UpdateUploadDto,
    @UploadedFiles() files: Express.Multer.File[],
    userId: string, profileId: string
  ) {
    return this.uploadService.update(id, updateUploadDto, files, userId, profileId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.uploadService.remove(id);
  }
}
