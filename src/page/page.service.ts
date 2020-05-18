import { Injectable } from '@nestjs/common'
import { Page } from './page.interface'
import { InjectModel } from '@nestjs/mongoose'
import { PageDTO } from './page.dto'
import { Model } from 'mongoose'

@Injectable()
export class PageService {
  constructor(@InjectModel('Page') private readonly pageModel: Model<Page>) {}

  async addPages(pagesDTO: PageDTO[]): Promise<PageDTO[]> | null {
    const pages = await this.pageModel.insertMany(pagesDTO)
    return pages
  }
}
