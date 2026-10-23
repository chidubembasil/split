import { Module } from '@nestjs/common';
import { HomeService } from './home.service.js';
import { HomeGateway } from './home.gateway.js';
import { UploadModule } from '../upload/upload.module.js';
import { StoreModule } from '../store/store.module.js';

@Module({
  imports: [UploadModule, StoreModule],
  providers: [HomeService, HomeGateway],
})
export class HomeModule {}
