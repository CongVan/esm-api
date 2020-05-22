import { Module } from '@nestjs/common';
import { ViettelPostController } from './viettel-post.controller';
import { ViettelPostService } from './viettel-post.service';

@Module({
  controllers: [ViettelPostController],
  providers: [ViettelPostService]
})
export class ViettelPostModule {}
