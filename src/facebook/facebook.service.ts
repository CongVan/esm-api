import { Injectable } from '@nestjs/common'
import * as graph from 'fbgraph'
import FbPromise from './FbP'
@Injectable()
export class FacebookService {
  async getUserInfo(access_token) {
      const fbPromise = new FbPromise()
    const fbUser = await this.graphPromise({
      method: 'get',
      query: 'me?fields=id,name',
      access_token
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
