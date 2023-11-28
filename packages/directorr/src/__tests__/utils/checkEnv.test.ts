/**
 * @jest-environment jsdom
 */
import { errorWhenWrongEnv } from '../../messages'

describe('checkEnv', () => {
  afterEach(jest.resetModules)

  it('normal env', () => {
    expect(() => require('../../utils/checkEnv')).not.toThrow()
  })

  it('wrong env', () => {
    Object.defineProperty(global.window, 'Symbol', {})

    expect(() => require('../../utils/checkEnv')).toThrowError(errorWhenWrongEnv())
  })
})
