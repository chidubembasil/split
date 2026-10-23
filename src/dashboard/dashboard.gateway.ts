import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Socket } from 'socket.io';
import { DashboardService } from './dashboard.service.js';
import { CreateDashboardDto } from './dto/create-dashboard.dto.js';
import { auth } from '../lib/auth.js';
import { AuthGuard } from '../auth/guards/auth/auth.guard.js';

@WebSocketGateway()
export class DashboardGateway {
  constructor(private readonly dashboardService: DashboardService) {}

  @SubscribeMessage('createDashboard')
  @UseGuards(AuthGuard)
  async create(
    @MessageBody() prompt: CreateDashboardDto,
    @ConnectedSocket() client: Socket,
  ) {
    const headers = new Headers();

    for (const [key, value] of Object.entries(client.handshake.headers)) {
      if (value !== undefined) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    }

    const session = await auth.api.getSession({ headers });

    if (!session) {
      throw new UnauthorizedException(
        'You must be logged in to use this service.',
      );
    }

    return this.dashboardService.create(prompt, session.user.id);
  }





}
