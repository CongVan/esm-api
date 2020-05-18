import { Module } from '@nestjs/common'
import { PageService } from './page.service'
import { MongooseModule } from '@nestjs/mongoose'
import { PageSchema } from './page.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Page', schema: PageSchema }])],
  providers: [PageService],
  exports: [PageService]
})
export class PageModule {}
