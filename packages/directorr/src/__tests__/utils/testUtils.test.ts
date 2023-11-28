import {
  dispatchEffectInStore,
  dispatchInitEffectInStore,
  dispatchDestroyEffectInStore,
  dispatchReloadEffectInStore,
  dispatchActionInStore,
} from '../../utils/testUtils'
import {
  DISPATCH_EFFECTS_FIELD_NAME,
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
  DIRECTORR_RELOAD_STORE_ACTION,
  DISPATCH_ACTION_FIELD_NAME,
} from '../../constants'
import { someValue, actionType, action } from '../../__mocks__/mocks'

class SomeStore {
  [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn();

  [DISPATCH_ACTION_FIELD_NAME] = jest.fn()
}

describe('testUtils', () => {
  it('dispatchEffectInStore', () => {
    const store = new SomeStore()

    dispatchEffectInStore({}, actionType, someValue)

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).not.toBeCalled()

    dispatchEffectInStore(store, actionType, someValue)

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledWith({
      type: actionType,
      payload: someValue,
    })
  })

  it('dispatchInitEffectInStore', () => {
    const store = new SomeStore()

    dispatchInitEffectInStore(store)

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledWith({
      type: DIRECTORR_INIT_STORE_ACTION,
      payload: {
        store,
      },
    })
  })

  it('dispatchDestroyEffectInStore', () => {
    const store = new SomeStore()

    dispatchDestroyEffectInStore(store)

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledWith({
      type: DIRECTORR_DESTROY_STORE_ACTION,
      payload: {
        store,
      },
    })
  })

  it('dispatchReloadEffectInStore', () => {
    const store = new SomeStore()

    dispatchReloadEffectInStore(store, someValue)

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledWith({
      type: DIRECTORR_RELOAD_STORE_ACTION,
      payload: someValue,
    })
  })

  it('dispatchActionInStore', () => {
    const store = new SomeStore()

    dispatchActionInStore(store, actionType, someValue)

    expect(store[DISPATCH_ACTION_FIELD_NAME]).toBeCalledWith(action)
  })
})
