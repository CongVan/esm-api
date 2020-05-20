import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Comment } from './comment.interface'
import { CommentDTO } from './comment.dto'

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly postModel: Model<Comment>
  ) {}

  async addComments(commentDTO: CommentDTO[]): Promise<CommentDTO[]> | null {
    if (commentDTO.length === 0) {
      return []
    }

    const options = {
      new: true,
      upsert: true,
      useFindAndModify: false
    }

    const comment = await Promise.all(
      commentDTO.map(async comment => {
        const { comment_id, post_id } = comment

        return await this.postModel.findOneAndUpdate(
          { comment_id, post_id },
          comment,
          options
        )
      })
    )

    return comment
  }
}
