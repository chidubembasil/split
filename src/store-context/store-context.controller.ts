import { Controller } from '@nestjs/common';
import { StoreContextService } from './store-context.service.js';

@Controller('store-context')
export class StoreContextController {
  constructor(private readonly storeContextService: StoreContextService) {}
}
