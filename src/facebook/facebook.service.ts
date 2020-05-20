import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common'
import FbPromise from './fbpromise'
import { FacebookDTO } from './facebook.dto'
import { PageDTO } from 'src/page/page.dto'
import { Queue, Job } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { UserDTO } from 'src/user/user.dto'
import { PostDTO } from 'src/post/post.dto'
import { Logger } from 'winston'
import { CommentDTO } from 'src/comment/comment.dto'

@Injectable()
export class FacebookService {
  constructor(
    @InjectQueue('FacebookQueue') private fbQueue: Queue,
    @Inject('winston')
    private logger: Logger
  ) {}
  async getUserInfo(access_token): Promise<FacebookDTO> {
    const fbPromise = new FbPromise({ access_token })
    const fbUser: FacebookDTO | any = await fbPromise
      .get('me', { fields: 'id,name,email' })
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
      })
    return fbUser
  }

  async syncPages(user: UserDTO): Promise<PageDTO[]> {
    const fbPromise = new FbPromise({ access_token: user.fb_access_token })
    const response: any = await fbPromise
      .get('me/accounts', { fields: 'access_token,name,id', limit: 100 })
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
      })

    const { data } = response

    return data.map(page => ({
      page_id: page.id,
      name: page.name,
      access_token: page.access_token,
      user_id: user._id
    }))
  }

  async syncPosts(pages: PageDTO[], access_token): Promise<PostDTO[]> {
    const fbPromise = new FbPromise({ access_token })
    const posts: PostDTO[] | any = await Promise.all(
      pages.map(async page => {
        let canNext = true
        let postsDTO: PostDTO[] = new Array<PostDTO>()
        let after = ''
        do {
          const response: any = await fbPromise
            .get(`${page.page_id}/posts`, {
              fields: 'id,message,created_time',
              ...(after && { after })
            })
            .catch(err => {
              this.logger.error(
                `Syncs Post: Page: ${page.page_id}: ${err.toString()}`
              )
            })

          const { data: posts, paging } = response
          canNext = !!paging.next
          if (canNext) {
            after = paging.cursors.after
          }

          postsDTO = [
            ...postsDTO,
            ...posts.map(post => {
              const postDTO: PostDTO = {
                page_id: page.page_id,
                post_id: post.id,
                content: post.message || '',
                publish_time: post.created_time
              }

              return postDTO
            })
          ]
        } while (canNext)

        return postsDTO
      })
    )
    return posts.flat(1)
  }

  async syncComments(
    objectComment: PostDTO[] | CommentDTO[] | any,
    pages: PageDTO[],
    access_token
  ): Promise<CommentDTO[]> {
    const comments: CommentDTO[] | any = await Promise.all(
      objectComment.map(async object => {
        let canNext = true
        let commentsDTO: CommentDTO[] = new Array<CommentDTO>()
        let after = ''
        let token = access_token
        const page = pages.find(page => page.page_id === object.page_id)
        if (page) {
          token = page.access_token
        }
        const fbPromise = new FbPromise({ access_token: token })

        do {
          const response: any = await fbPromise
            .get(`${object.post_id}/comments`, {
              fields: 'id,message,created_time,from,attachment',
              ...(after && { after })
            })
            .catch(err => {
              this.logger.error(
                `Sync Comments: Post: ${object.post_id}: ${err.toString()}`
              )
            })

          const { data: comments, paging } = response

          canNext = !!(paging && paging.next)

          after = canNext ? paging.cursors.after : ''

          commentsDTO = [
            ...commentsDTO,
            ...comments.map(comment => {
              const { message, id, created_time, from, attachment } = comment
              const commentDTO: CommentDTO = {
                comment_id: id,
                post_id: object.post_id,
                message,
                publish_time: created_time,
                from_id: from ? from.id : '',
                from_name: from ? from.name : '',
                attachments: attachment
              }

              return commentDTO
            })
          ]
        } while (canNext)
        return commentsDTO
      })
    )

    return comments.flat(1)
  }

  async addJobSyncUserInfo(user: UserDTO): Promise<Job> | null {
    const job = await this.fbQueue.add('syncUserInfo', user)
    return job
  }
}
