import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { HomeModule } from './home/home.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { UploadModule } from './upload/upload.module.js';
import { DatabaseModule } from './database/database.module.js';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';
import { RedisModule } from './redis/redis.module.js';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module.js';
import { StoreContextModule } from './store-context/store-context.module.js';
import { StoreModule } from './store/store.module.js';
import { GenerateUrlModule } from './generate-url/generate-url.module.js';

@Module({
  imports: [
    AuthModule, HomeModule, 
    ConfigModule.forRoot({ isGlobal: true }), DashboardModule, UploadModule, 
    DatabaseModule, CloudinaryModule, RedisModule, OrderModule, 
    StoreContextModule, StoreModule, GenerateUrlModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}