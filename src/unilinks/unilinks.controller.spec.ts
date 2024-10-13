import { Test, TestingModule } from '@nestjs/testing';
import { UnilinksController } from './unilinks.controller';

describe('UnilinksController', () => {
  let controller: UnilinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnilinksController],
    }).compile();

    controller = module.get<UnilinksController>(UnilinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
