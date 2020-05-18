import * as graph from 'fbgraph'

export default class FbPromise {
  constructor({ access_token }) {
    graph.setAccessToken(access_token)
  }
  get(url, params) {
    return new Promise((res, rej) => {
      graph.get(url, params, (err, data) => {
        if (err) {
          rej(err)
        }
        res(data)
      })
    })
  }
}
