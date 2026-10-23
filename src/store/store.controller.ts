import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoreService } from './store.service.js';
import { CreateStoreDto } from './dto/create.dto.js';
import { UpdateStoreDto } from './dto/update.dto.js';
import { AuthGuard } from '../auth/guards/auth/auth.guard.js';

type AuthenticatedRequest = Request & { user: { id: string } };

@ApiTags('Store')
@ApiBearerAuth()
@Controller('store')
@UseGuards(AuthGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiOperation({ summary: 'Create store' })
  @Post()
  create(
    @Body() data: CreateStoreDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.storeService.createStore(data, req.user.id);
  }

  @ApiOperation({ summary: 'Get all stores' })
  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.storeService.findAll(req.user.id);
  }

  @ApiOperation({ summary: 'Get store by id' })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.storeService.findOne(id, req.user.id);
  }

  @ApiOperation({ summary: 'Update store' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateStoreDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.storeService.updateStore(id, req.user.id, data);
  }

  @ApiOperation({ summary: 'Delete store' })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.storeService.remove(id, req.user.id);
  }
}
