import { Processor, Process, OnQueueActive, OnQueueFailed } from '@nestjs/bull'
import { Job } from 'bull'
import { FacebookService } from 'src/facebook/facebook.service'
import { UserDTO } from 'src/user/user.dto'
import { PageService } from 'src/page/page.service'
import { Logger } from 'winston'
import { Inject } from '@nestjs/common'
import { PostService } from 'src/post/post.service'
@Processor('FacebookQueue')
export class FacebookConsumer {
  constructor(
    private facebookService: FacebookService,
    private pageService: PageService,
    private postService: PostService,
    @Inject('winston')
    private logger: Logger
  ) {}

  @Process('syncUserInfo')
  async handler(job: Job) {
    const user: UserDTO = job.data
    //Fetch Pages
    const { data: pages }: any = await this.facebookService.syncPages(
      user.fb_access_token
    )
    const pagesDTO = pages.map(page => ({
      page_id: page.id,
      name: page.name,
      access_token: page.access_token,
      user_id: user._id
    }))

    await this.pageService.addPages(pagesDTO)
    const posts = await this.facebookService.syncPosts(
      pagesDTO,
      user.fb_access_token
    )

    await this.postService.addPosts(posts)

    this.logger.info(
      `Job: ${job.id}, user: ${user._id}: Sync user info success`
    )
  }

  @OnQueueFailed()
  handleOnQueueFailed(job: Job, err: Error) {
    this.logger.error(`job: ${job.id}: ${err.message}`)
  }
}
