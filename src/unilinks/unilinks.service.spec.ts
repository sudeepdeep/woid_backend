import { Test, TestingModule } from '@nestjs/testing';
import { UnilinksService } from './unilinks.service';

describe('UnilinksService', () => {
  let service: UnilinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnilinksService],
    }).compile();

    service = module.get<UnilinksService>(UnilinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
