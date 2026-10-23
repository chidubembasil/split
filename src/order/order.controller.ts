import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './order.service.js';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrdersService) {}
}
