import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreContextService } from './store-context.service.js';

@ApiTags('StoreContext')
@Controller('store-context')
export class StoreContextController {
  constructor(private readonly storeContextService: StoreContextService) {}
}
