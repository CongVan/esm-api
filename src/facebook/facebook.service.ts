import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import * as graph from 'fbgraph'
import FbPromise from './fbpromise'
@Injectable()
export class FacebookService {
  async getUserInfo(access_token) {
    const fbPromise = new FbPromise({ access_token })
    const fbUser = await fbPromise
      .get('me', { fields: 'id,name,email' })
      .catch(err => {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
      })
    return fbUser
  }

  graphPromise({ method, query, params, access_token }: any) {
    return new Promise((res, rej) => {
      graph.setAccessToken(access_token)
      graph[method](query, params, (err, data) => {
        res(data)
      })
    })
  }
}
