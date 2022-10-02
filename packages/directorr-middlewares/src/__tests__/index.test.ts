import { logMiddleware } from '../index'

describe('index', () => {
  it('check exports', () => {
    expect(logMiddleware).not.toBeUndefined()
  })
})
