import { Controller } from '@nestjs/common';
import { OrdersService } from './order.service.js';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrdersService) {}
}
