import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { DashboardGateway } from './dashboard.gateway.js';
import { OrderModule } from '../order/order.module.js';

@Module({
  imports: [OrderModule],
  providers: [DashboardService, DashboardGateway],
})
export class DashboardModule {}
