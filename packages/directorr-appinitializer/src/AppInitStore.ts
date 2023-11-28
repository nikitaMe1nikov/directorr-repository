import { observable, makeObservable } from 'mobx'
import {
  // Action,
  // DirectorrInterface,
  isStoreReady,
  isStoreError,
  injectDirectorr,
  Directorr,
  whenState,
  // isFunction,
} from '@nimel/directorr'
import {
  initStoreAction,
  initStoreEffect,
  initStoreErrorAction,
  initStoreErrorEffect,
  initStoreSuccessAction,
  initStoreSuccessEffect,
  // isReadyEffect,
} from './decorators'
import {
  InitOptions,
  InitStoreErrorPayload,
  InitStorePayload,
  InitStoreSuccessPayload,
  SomeClassConstructor,
} from './types'

function isStores(payload: InitStoreSuccessPayload, store: AppInitStore) {
  return store.loadingStores === payload.stores
}

export class AppInitStore {
  constructor(options?: InitOptions) {
    makeObservable(this)

    this.loadingStores = options
  }

  @injectDirectorr directorr: Directorr

  @observable.ref storeWithError?: SomeClassConstructor = undefined

  @observable isInitComplated = false

  loadingStores?: InitOptions

  @initStoreAction
  loadStores = (stores: InitOptions) => ({ stores })

  @initStoreEffect
  waitStores = ({ stores }: InitStorePayload) => {
    this.loadingStores = stores
    this.directorr.addStores(stores)

    const waitStores = this.directorr.waitStoresState(stores, isStoreReady)
    const waitStoreWithError = this.directorr.findStoreState(isStoreError)

    void Promise.race([waitStores, waitStoreWithError]).then(store => {
      if (store) {
        waitStores.cancel()
        this.directorr.dispatch(initStoreErrorAction.createAction({ store, stores }))
      } else {
        waitStoreWithError.cancel()
        this.directorr.dispatch(initStoreSuccessAction.createAction({ stores }))
      }
    })
  }

  @initStoreSuccessEffect
  @whenState(isStores)
  whenSuccess = () => {
    this.isInitComplated = true
    this.storeWithError = undefined
  }

  @initStoreErrorEffect
  @whenState(isStores)
  whenError = ({ store }: InitStoreErrorPayload) => {
    this.isInitComplated = false
    this.storeWithError = store
  }
}

export default AppInitStore
