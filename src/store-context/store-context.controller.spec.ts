import { Test, TestingModule } from '@nestjs/testing';
import { StoreContextController } from './store-context.controller.js';
import { StoreContextService } from './store-context.service.js';

describe('StoreContextController', () => {
  let controller: StoreContextController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreContextController],
      providers: [StoreContextService],
    }).compile();

    controller = module.get<StoreContextController>(StoreContextController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
