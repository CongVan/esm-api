import { Test, TestingModule } from '@nestjs/testing';
import { ViettelPostService } from './viettel-post.service';

describe('ViettelPostService', () => {
  let service: ViettelPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViettelPostService],
    }).compile();

    service = module.get<ViettelPostService>(ViettelPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
