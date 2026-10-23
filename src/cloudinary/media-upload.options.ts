import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { tmpdir } from 'os';

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export const mediaUploadOptions: MulterOptions = {
  // Disk storage so videos don't sit in RAM
  storage: diskStorage({ destination: tmpdir() }),
  limits: { fileSize: MAX_VIDEO_SIZE },
  fileFilter: (_req, file, cb) => {
    if ([...IMAGE_TYPES, ...VIDEO_TYPES].includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new BadRequestException('Only images and videos are allowed'), false);
  },
};