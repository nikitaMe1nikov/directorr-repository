import {
  createAction,
  DISPATCH_ACTION_FIELD_NAME,
  dispatchEffectInStore,
  Directorr,
  action,
  effect,
} from '@nimel/directorr'
import {
  initStoreAction,
  initStoreSuccessEffect,
  initStoreErrorEffect,
  initStoreSuccessAction,
} from '../decorators'
import AppInitStore from '../AppInitStore'
import { flushPromises } from '../../../../tests/utils'
import { SomeClassConstructor } from '../types'

const CHANGE_READY = 'CHANGE_READY'
const CHANGE_ERROR = 'CHANGE_ERROR'

class StoreOne {
  isStoreStateReady = false

  @action(CHANGE_READY)
  changeReady = () => ({
    isStoreStateReady: !this.isStoreStateReady,
  })

  @effect(CHANGE_READY)
  toChangeReady = ({ isStoreStateReady }: { isStoreStateReady: boolean }) => {
    this.isStoreStateReady = isStoreStateReady
  }

  @initStoreSuccessEffect
  toReadyAppinit = jest.fn()
}

class StoreError {
  isStoreStateError = false

  @action(CHANGE_ERROR)
  changeError = () => ({
    isStoreStateError: !this.isStoreStateError,
  })

  @effect(CHANGE_ERROR)
  toChangeReady = ({ isStoreStateError }: { isStoreStateError: boolean }) => {
    this.isStoreStateError = isStoreStateError
  }

  @initStoreErrorEffect
  toErrorAppinit = jest.fn()
}

describe('AppInitStore', () => {
  it('init', () => {
    const initOptions = {}
    const dispatchAction = jest.fn()
    const store: any = new AppInitStore()

    Object.defineProperty(store, DISPATCH_ACTION_FIELD_NAME, { value: dispatchAction })

    store.loadStores(initOptions)

    expect(dispatchAction).toBeCalledTimes(1)
    expect(dispatchAction).toBeCalledWith(
      createAction(initStoreAction.type, { stores: initOptions }),
    )
  })

  it('change state isInitComplated', () => {
    const options = [] as SomeClassConstructor<any, any>[]
    const store: any = new AppInitStore(options)

    expect(store.isInitComplated).toBeFalsy()

    dispatchEffectInStore(store, initStoreSuccessAction.createAction({ stores: options }))

    expect(store.isInitComplated).toBeTruthy()
  })

  it('with stores where change state to ready', async () => {
    const directorr = new Directorr()
    const stores = [StoreOne]

    const initStore = directorr.addStore(AppInitStore)

    initStore.loadStores(stores)

    const storeOne = directorr.getStore(StoreOne) as StoreOne
    storeOne.changeReady()

    await flushPromises()

    expect(storeOne.toReadyAppinit).toBeCalledTimes(1)
    expect(storeOne.toReadyAppinit).toBeCalledWith({ stores })
  })

  it('with stores where some have error state', async () => {
    const directorr = new Directorr()
    const stores = [StoreOne, StoreError]
    jest.spyOn(directorr, 'unsubscribe')

    const initStore = directorr.addStore(AppInitStore)

    initStore.loadStores(stores)

    await flushPromises()

    expect(initStore.isInitComplated).toBeFalsy()

    const storeError = directorr.getStore(StoreError) as StoreError
    storeError.changeError()

    await flushPromises()

    expect(storeError.toErrorAppinit).toBeCalledTimes(1)
    expect(storeError.toErrorAppinit).toBeCalledWith({ store: storeError, stores })
    expect(directorr.unsubscribe).toBeCalledTimes(2)
  })
})
