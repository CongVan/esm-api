import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Post } from './post.interface'
import { PostDTO } from './post.dto'

@Injectable()
export class PostService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async addPosts(postsDTO: PostDTO[]): Promise<PostDTO[]> {
    if (postsDTO.length === 0) {
      return []
    }

    const options = {
      new: true,
      upsert: true,
      useFindAndModify: false
    }

    const posts = await Promise.all(
      postsDTO.map(async post => {
        const { page_id, post_id } = post

        return await this.postModel.findOneAndUpdate(
          { page_id, post_id },
          post,
          options
        )
      })
    )

    return posts
  }
}
