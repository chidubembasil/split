import { Module } from '@nestjs/common';
import { StoreService } from './store.service.js';
import { StoreController } from './store.controller.js';

@Module({
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
