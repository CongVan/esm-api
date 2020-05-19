import { Module } from '@nestjs/common'
import { FacebookService } from './facebook.service'
import { FacebookController } from './facebook.controller'
import { BullModule } from '@nestjs/bull'
import { FacebookQueueConfigService } from 'src/queues/facebook/FacebookConfigService'
import { FacebookConsumer } from 'src/queues/facebook/FacebookConsumer'
import { PageModule } from 'src/page/page.module'
import { PostModule } from 'src/post/post.module'

@Module({
  imports: [
    PageModule,
    PostModule,
    BullModule.registerQueueAsync({
      name: 'FacebookQueue',
      useClass: FacebookQueueConfigService
    })
  ],
  providers: [FacebookService, FacebookConsumer],
  controllers: [FacebookController],
  exports: [FacebookService, FacebookConsumer]
})
export class FacebookModule {}
