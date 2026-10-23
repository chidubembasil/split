import { Module } from '@nestjs/common';
import { StoreContextService } from './store-context.service.js';
import { StoreContextController } from './store-context.controller.js';

@Module({
  controllers: [StoreContextController],
  providers: [StoreContextService],
})
export class StoreContextModule {}
