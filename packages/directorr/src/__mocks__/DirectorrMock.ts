import { getStoreName } from '../Directorr/directorrUtils'
import { DirectorrInterface, Action, PromiseCancelable } from '../types'

export class DirectorrMock implements DirectorrInterface {
  stores = new Map()

  actions: Action[] = []

  addStores = jest.fn().mockImplementation((...Stores: any[]) => {
    Stores.forEach(Store => {
      const store = new Store()
      this.stores.set(getStoreName(Store), store)

      return store
    })
  })

  addStore = jest.fn().mockImplementation(Store => {
    const store = new Store()
    this.stores.set(getStoreName(Store), store)

    return store
  })

  addStoreDependency = jest.fn().mockImplementation(Store => {
    const store = new Store()
    this.stores.set(getStoreName(Store), store)

    return store
  })

  removeStoreDependency = jest.fn()

  getHydrateStoresState = jest.fn()

  getStore = jest.fn().mockImplementation(Store => this.stores.get(getStoreName(Store)))

  waitAllStoresState = jest.fn().mockImplementationOnce(() => {
    const promise: any = Promise.resolve()
    promise.cancel = jest.fn()

    return promise as PromiseCancelable
  })

  waitStoresState = jest.fn().mockImplementationOnce(s => {
    const promise: any = Promise.resolve(s)
    promise.cancel = jest.fn()

    return promise as PromiseCancelable
  })

  findStoreState = jest.fn().mockImplementationOnce(() => {
    const promise: any = Promise.resolve()
    promise.cancel = jest.fn()

    return promise as PromiseCancelable
  })

  dispatch = jest.fn().mockImplementationOnce(action => this.actions.push(action))

  dispatchType = jest
    .fn()
    .mockImplementationOnce((type, payload) => this.dispatch({ type, payload }))

  addInitState = jest.fn()

  removeStore = jest.fn()

  addReduxMiddlewares = jest.fn()

  addMiddlewares = jest.fn()

  mergeStateToStore = jest.fn()

  setStateToStore = jest.fn()

  removeMiddleware = jest.fn()

  subscribe = jest.fn()

  unsubscribe = jest.fn()
}
