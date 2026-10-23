import { Test, TestingModule } from '@nestjs/testing';
import { StoreContextService } from './store-context.service.js';

describe('StoreContextService', () => {
  let service: StoreContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreContextService],
    }).compile();

    service = module.get<StoreContextService>(StoreContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
