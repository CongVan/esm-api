import { Processor, Process, OnQueueActive } from '@nestjs/bull'
import { Job } from 'bull'
import { FacebookService } from 'src/facebook/facebook.service'
import { UserDTO } from 'src/user/user.dto'
import { PageService } from 'src/page/page.service'

@Processor('FacebookQueue')
export class FacebookConsumer {
  constructor(
    private facebookService: FacebookService,
    private pageService: PageService
  ) {}

  @Process('syncUserInfo')
  async handler(job: Job) {
    const user: UserDTO = job.data
    //Fetch Pages
    const { data: pages }: any = await this.facebookService.getUserPages(
      user.fb_access_token
    )
    const pagesDTO = pages.map(page => ({
      page_id: page.id,
      name: page.name,
      access_token: page.access_token,
      user_id: user._id
    }))

    const pagesResult = await this.pageService.addPages(pagesDTO)
    console.log(pagesResult)
  }
}
