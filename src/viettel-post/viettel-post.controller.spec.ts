import { Test, TestingModule } from '@nestjs/testing';
import { ViettelPostController } from './viettel-post.controller';

describe('ViettelPost Controller', () => {
  let controller: ViettelPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViettelPostController],
    }).compile();

    controller = module.get<ViettelPostController>(ViettelPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
