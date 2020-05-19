import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common'
import FbPromise from './fbpromise'
import { FacebookDTO } from './facebook.dto'
import { PageDTO } from 'src/page/page.dto'
import { Queue, Job } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { UserDTO } from 'src/user/user.dto'
import { PostDTO } from 'src/post/post.dto'
import { Logger } from 'winston'

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

  async syncPages(access_token): Promise<PageDTO[]> {
    const fbPromise = new FbPromise({ access_token })
    const pages: PageDTO[] | any = await fbPromise
      .get('me/accounts', { fields: 'access_token,name,id' })
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
      })

    return pages
  }

  async syncPosts(pages: PageDTO[], access_token): Promise<PostDTO[]> {
    const fbPromise = new FbPromise({ access_token })
    const posts: PostDTO[] | any = await Promise.all(
      pages.map(async page => {
        const response: any = await fbPromise
          .get(`${page.page_id}/posts`, { fields: 'id,message,created_time' })
          .catch(err => {
            this.logger.error(
              `Syncs Post: Page: ${page.page_id}: ${err.toString()}`
            )
          })
        const { data: posts } = response

        return posts.map(post => {
          const postDTO: PostDTO = {
            page_id: page.page_id,
            post_id: post.id,
            content: post.message,
            publish_time: post.created_time
          }
          return postDTO
        })
      })
    )

    return posts.flat(1)
  }

  async addJobSyncUserInfo(user: UserDTO): Promise<Job> | null {
    const job = await this.fbQueue.add('syncUserInfo', user)
    return job
  }
}
