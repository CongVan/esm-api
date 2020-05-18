import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import * as graph from 'fbgraph'
import FbPromise from './fbpromise'
import { FacebookDTO } from './facebook.dto'
import { PageDTO } from 'src/page/page.dto'
@Injectable()
export class FacebookService {
  async getUserInfo(access_token): Promise<FacebookDTO> {
    const fbPromise = new FbPromise({ access_token })
    const fbUser: FacebookDTO | any = await fbPromise
      .get('me', { fields: 'id,name,email' })
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
      })
    return fbUser
  }

  async getUserPages(access_token): Promise<PageDTO[]> {
    const fbPromise = new FbPromise({ access_token })
    const pages: PageDTO[] | any = await fbPromise
      .get('me/accounts', { fields: 'access_token,name,id' })
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
      })

    return pages
  }
}
