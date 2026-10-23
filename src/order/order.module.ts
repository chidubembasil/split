import { Module } from '@nestjs/common';
import { OrdersService } from './order.service.js';
import { OrderController } from './order.controller.js';

@Module({
  controllers: [OrderController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrderModule {}
