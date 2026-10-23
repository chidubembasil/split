import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
} from '@nestjs/websockets';
import {
  UnauthorizedException,
} from '@nestjs/common';
import type { Socket } from 'socket.io';

import { HomeService } from './home.service.js';
import { CreateDto } from './dto/create_dto.js';
import { auth } from '../lib/auth.js';

@WebSocketGateway()
export class HomeGateway {
  constructor(
    private readonly homeService: HomeService,
  ) {}

  @SubscribeMessage('displays_prompt')
  async userInput(
    @MessageBody() prompt: CreateDto,
    @ConnectedSocket() client: Socket,
  ) {
    // Convert Socket.IO handshake headers to Web Headers.
    const headers = new Headers();

    for (const [key, value] of Object.entries(
      client.handshake.headers,
    )) {
      if (value !== undefined) {
        headers.set(
          key,
          Array.isArray(value) ? value.join(', ') : value,
        );
      }
    }

    // Get the currently authenticated user.
    const session = await auth.api.getSession({
      headers,
    });

    if (!session) {
      throw new UnauthorizedException(
        'You must be logged in to use this service.',
      );
    }

    // This is the persistent Better Auth user ID.
    const userId = session.user.id;

    // Pass the authenticated user ID to the service.
    return this.homeService.UserInput(prompt, userId);
  }
}
