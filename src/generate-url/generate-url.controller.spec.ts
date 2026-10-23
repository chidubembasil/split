import { Test, TestingModule } from '@nestjs/testing';
import { GenerateUrlController } from './generate-url.controller.js';
import { GenerateUrlService } from './generate-url.service.js';

describe('GenerateUrlController', () => {
  let controller: GenerateUrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateUrlController],
      providers: [GenerateUrlService],
    }).compile();

    controller = module.get<GenerateUrlController>(GenerateUrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
