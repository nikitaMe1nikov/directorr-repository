import { AppInitStore } from '../index'
import {
  initStoreAction,
  initStoreErrorAction,
  initStoreErrorEffect,
  initStoreSuccessAction,
  initStoreSuccessEffect,
} from '../decorators'

describe('index', () => {
  it('check exports', () => {
    expect(AppInitStore).not.toBeUndefined()
    expect(initStoreAction).not.toBeUndefined()
    expect(initStoreErrorAction).not.toBeUndefined()
    expect(initStoreErrorEffect).not.toBeUndefined()
    expect(initStoreSuccessAction).not.toBeUndefined()
    expect(initStoreSuccessEffect).not.toBeUndefined()
  })
})
