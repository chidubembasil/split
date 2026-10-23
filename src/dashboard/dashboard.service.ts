import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto.js';
import { createCustomerCareAgent } from '../agent/mastra/agents/customers-agent.js';
import { OrdersService } from '../order/order.service.js';
import { DatabaseService } from '../database/database.service.js';


@Injectable()
export class DashboardService {
  constructor(
    private readonly order: OrdersService,
    private readonly db: DatabaseService
  ){}

  async create(dto: CreateDashboardDto, userId: string) {
    const store = await this.db.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const agent = createCustomerCareAgent(this.order, store.id);

    return agent.generate(dto.prompt);
  }
}
