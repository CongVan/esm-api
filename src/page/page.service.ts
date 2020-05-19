import { Injectable } from '@nestjs/common'
import { Page } from './page.interface'
import { InjectModel } from '@nestjs/mongoose'
import { PageDTO } from './page.dto'
import { Model } from 'mongoose'

@Injectable()
export class PageService {
  constructor(@InjectModel('Page') private readonly pageModel: Model<Page>) {}

  async addPages(pagesDTO: PageDTO[]): Promise<PageDTO[]> | null {
    if (pagesDTO.length === 0) {
      return []
    }

    const options = {
      new: true,
      upsert: true,
      useFindAndModify: false
    }

    const pages = await Promise.all(
      pagesDTO.map(async page => {
        const { page_id, user_id } = page

        return await this.pageModel.findOneAndUpdate(
          { page_id, user_id },
          page,
          options
        )
      })
    )

    return pages
  }
}
