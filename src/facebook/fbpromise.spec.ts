import { FbPromise } from './fbpromise'

describe('Fbpromise', () => {
  it('should be defined', () => {
    expect(new FbPromise({ access_token: '' })).toBeDefined()
  })
})
