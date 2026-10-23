import { Test, TestingModule } from '@nestjs/testing';
import { GenerateUrlService } from './generate-url.service.js';

describe('GenerateUrlService', () => {
  let service: GenerateUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateUrlService],
    }).compile();

    service = module.get<GenerateUrlService>(GenerateUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
