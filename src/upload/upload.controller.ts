import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, Put, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service.js';
import { CreateUploadDto } from './dto/create-upload.dto.js';
import { UpdateUploadDto } from './dto/update-upload.dto.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth/auth.guard.js';

@ApiTags('Upload')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Create upload' })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  create(
      @UploadedFiles() files: Express.Multer.File[],
      @Body() createUploadDto: CreateUploadDto,
      @Req() req: any
    ) {
      const userId = req.user?.id || req.user?.sub || (req.user as any)?.userId;
      const profileId = req.user?.profileId || (req.user as any)?.profile?.id;
    return this.uploadService.create(createUploadDto, files, userId, profileId);
  }

  // @Get()
  // findAll() {
  //   return this.uploadService.findAll();
  // }

  @ApiOperation({ summary: 'Get upload by id' })
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(id);
  }

  @ApiOperation({ summary: 'Update upload' })
  @ApiConsumes('multipart/form-data')
  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  update(
    @Param('id') id: string, 
    @Body() updateUploadDto: UpdateUploadDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any
  ) {
    const userId = req.user?.id || req.user?.sub || (req.user as any)?.userId;
    const profileId = req.user?.profileId || (req.user as any)?.profile?.id;
    return this.uploadService.update(id, updateUploadDto, files, userId, profileId);
  }

  @ApiOperation({ summary: 'Delete upload' })
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.uploadService.remove(id);
  }
}
