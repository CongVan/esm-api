import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentSchema } from './comment.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }])],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
