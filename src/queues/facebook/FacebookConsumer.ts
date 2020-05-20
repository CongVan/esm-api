import { Processor, Process, OnQueueActive, OnQueueFailed } from '@nestjs/bull'
import { Job } from 'bull'
import { FacebookService } from 'src/facebook/facebook.service'
import { UserDTO } from 'src/user/user.dto'
import { PageService } from 'src/page/page.service'
import { Logger } from 'winston'
import { Inject } from '@nestjs/common'
import { PostService } from 'src/post/post.service'
import { CommentService } from 'src/comment/comment.service'
import { PostDTO } from 'src/post/post.dto'
@Processor('FacebookQueue')
export class FacebookConsumer {
  constructor(
    private facebookService: FacebookService,
    private pageService: PageService,
    private postService: PostService,
    private commentService: CommentService,
    @Inject('winston')
    private logger: Logger
  ) {}

  @Process('syncUserInfo')
  async handler(job: Job) {
    const user: UserDTO = job.data
    //Fetch Pages
    const pages = await this.facebookService.syncPages(user)

    await this.pageService.addPages(pages)

    //Sync Post
    const posts = await this.facebookService.syncPosts(
      pages,
      user.fb_access_token
    )

    // console.log('SYNC COMMENT', posts)
    await this.postService.addPosts(posts)

    //Sync Comment

    const comments = await this.facebookService.syncComments(
      posts,
      pages,
      user.fb_access_token
    )

    

    await this.commentService.addComments(comments)

    this.logger.info(
      `Job: ${job.id}, user: ${user._id}: Sync user info success`
    )
  }

  @OnQueueFailed()
  handleOnQueueFailed(job: Job, err: Error) {
    this.logger.error(
      `job: ${job.id}, data: ${JSON.stringify(job.data)} : ${err.message}`
    )
  }
}
