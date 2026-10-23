import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { fileTypeFromFile } from 'file-type';
import { unlink } from 'fs/promises';
import { IMAGE_TYPES, MAX_IMAGE_SIZE, VIDEO_TYPES } from './media-upload.options.js';

export type MediaType = 'image' | 'video';

export interface UploadedMedia {
  url: string;
  publicId: string;
  resourceType: MediaType;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
}

@Injectable()
export class CloudinaryService {
  async uploadMedia(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<UploadedMedia> {
    const resourceType: MediaType = file.mimetype.startsWith('video/')
      ? 'video'
      : 'image';

    try {
      // Check the file's real type from its bytes, not the client-supplied mimetype
      const detected = await fileTypeFromFile(file.path);
      if (!detected || ![...IMAGE_TYPES, ...VIDEO_TYPES].includes(detected.mime)) {
        throw new BadRequestException('Invalid file type');
      }

      if (resourceType === 'image' && file.size > MAX_IMAGE_SIZE) {
        throw new BadRequestException('Image must be 10MB or smaller');
      }

      const result: UploadApiResponse =
        resourceType === 'video'
          ? await this.uploadLargeVideo(file.path, folder)
          : await cloudinary.uploader.upload(file.path, {
              folder,
              resource_type: 'image',
            });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        duration: result.duration,
        thumbnailUrl:
          resourceType === 'video'
            ? cloudinary.url(result.public_id, {
                resource_type: 'video',
                format: 'jpg',
                secure: true,
              })
            : undefined,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(error?.message ?? 'Upload failed');
    } finally {
      // Always clean up the temp file
      await unlink(file.path).catch(() => undefined);
    }
  }

  private uploadLargeVideo(path: string, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        path,
        { folder, resource_type: 'video', chunk_size: 6_000_000 },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Upload failed'));
          resolve(result);
        },
      );
    });
  }

  async deleteMedia(publicId: string, resourceType: MediaType) {
    return cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  }
}