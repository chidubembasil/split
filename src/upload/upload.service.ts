import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto.js';
import { UpdateUploadDto } from './dto/update-upload.dto.js';
import { DatabaseService } from '../database/database.service.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { REDIS } from '../redis/redis.module.js';
import { Redis } from 'ioredis';


@Injectable()
export class UploadService {
  constructor(
    private readonly db: DatabaseService,
    private readonly  cloud : CloudinaryService,
    @Inject(REDIS) private readonly redis: Redis
  ){}


  async create(dto: CreateUploadDto, files: Express.Multer.File[], userId: string, profileId: string,) {
    //upload to cloudinary
    const media = await Promise.all(
      files.map((file)=> this.cloud.uploadMedia(file, 'media'))
    )

    try{
      const owner = await this.db.user.findUnique({
        where: { id: userId },
        select: {
          currency: true,
          store: { select: { id: true }, take: 1 },
        },
      });

      if (!owner?.currency) {
        throw new BadRequestException('Set a currency on your account before uploading');
      }

      const storeId = owner.store[0]?.id;

      if (!storeId) {
        throw new BadRequestException('Create a store before uploading');
      }

      return await this.db.upload.create({
        data:{
          name: dto.name,
          description: dto.description,
          price: dto.price,
          quantity: dto.quantity,
          currency: owner.currency,
          filename: files.map((f) => f.originalname),
          fileType: files.map((f) => f.mimetype),
          fileSize: media.map((m) => String(m.bytes)),
          fileurl:  media.map((m) => m.url),
          publicIds: media.map((m) => m.publicId),
          resourceTypes: media.map((m) => m.resourceType),
          userId,
          profileId,
          storeId,
        }
      })
      
    }catch(error){
      // Don't leave orphaned files on Cloudinary if the DB save fails
      await Promise.all(
        media.map((m) =>
          this.cloud.deleteMedia(m.publicId, m.resourceType),
        ),
      );
      throw error;
    }
  }

  // findAll() {
  //   return `This action returns all upload`;
  // }

  async findOne(id: string) {
    try {
      const cached = await this.redis.get(id)
      if(cached) return JSON.parse(cached)

      const findId = await this.db.upload.findUnique({
        where:{id},
        select:{
          id: true,
          name: true,
          description: true,
          price: true,
          currency: true,
          fileurl: true,
          createdAt: true,
          updatedAt: true
        }
      })  

      if(!findId){
        throw new HttpException("Item is not found", HttpStatus.NOT_FOUND)
      }

      await this.redis.set(id, JSON.stringify(findId), 'EX', 60);

      return findId;
    }catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
          throw error;
      }

      throw new InternalServerErrorException('Failed to filed to find item');
    }
  }

  //search for an upload
  async search(item_name: string) {
    try {
      const cached = await this.redis.get(item_name)
      if(cached) return JSON.parse(cached)

      const findId = await this.db.upload.findFirst({
        where:{
          name : { has: item_name }
        },
        select:{
          id: true,
          name: true,
          description: true,
          price: true,
          currency: true,
          fileurl: true,
          createdAt: true,
          updatedAt: true
        }
      })  

      if(!findId){
        throw new HttpException("Item is not found", HttpStatus.NOT_FOUND)
      }

      await this.redis.set(item_name, JSON.stringify(findId), 'EX', 60);

      return findId;
    }catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
          throw error;
      }

      throw new InternalServerErrorException('Failed to filed to find item');
    }
  }

  

  async update(id: string, dto: UpdateUploadDto, files: Express.Multer.File[], userId: string, profileId: string,) {
     
    //upload to cloudinary
    const media = await Promise.all(
      files.map((file)=> this.cloud.uploadMedia(file, 'media'))
    )

    try{
      const owner = await this.db.user.findUnique({
        where: { id: userId },
        select: { currency: true },
      });

      if (!owner?.currency) {
        throw new BadRequestException('Set a currency on your account before uploading');
      }

      return await this.db.upload.update({
        where:{id},
        data:{
          name: dto.name,
          description: dto.description,
          price: dto.price,
          quantity: dto.quantity,
          currency: owner.currency,
          filename: files.map((f) => f.originalname),
          fileType: files.map((f) => f.mimetype),
          fileSize: media.map((m) => String(m.bytes)),
          fileurl:  media.map((m) => m.url),
          publicIds: media.map((m) => m.publicId),
          resourceTypes: media.map((m) => m.resourceType),
          userId,
          profileId,
        }
      })
    }catch(error){
      // Don't leave orphaned files on Cloudinary if the DB save fails
      await Promise.all(
        media.map((m) =>
          this.cloud.deleteMedia(m.publicId, m.resourceType),
        ),
      );
      throw error;
    }
  }

  async remove(id: string) {
    try{
      const findId = await this.db.upload.findUnique({
        where:{id}
      })
      if(!findId){
        throw new HttpException("Item is not found", HttpStatus.NOT_FOUND)
      }
      const deleteId = await this.db.upload.delete({
        where: {id}
      }) 

      return new HttpException(`Item with id: ${deleteId}`, HttpStatus.NO_CONTENT)
    }catch(error){
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update profile');
    }
  }
}
