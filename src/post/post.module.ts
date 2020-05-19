import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { MongooseModule } from '@nestjs/mongoose'
import { PostSchema } from './post.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }])],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
