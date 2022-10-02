/**
 * @jest-environment jsdom
 */
import { errorWhenWrongEnv } from '../messages'

describe('checkEnv', () => {
  afterEach(jest.resetModules)

  it('normal env', () => {
    expect(() => require('../checkEnv')).not.toThrow()
  })

  it('wrong env', () => {
    Object.defineProperty(global.window, 'Symbol', {})

    expect(() => require('../checkEnv')).toThrowError(errorWhenWrongEnv())
  })
})
