import { Middleware as ReduxMiddleware, Store } from 'redux'
import {
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  INJECTED_STORES_FIELD_NAME,
  STORES_FIELD_NAME,
  INJECTED_FROM_FIELD_NAME,
  DEPENDENCY_FIELD_NAME,
  SUBSCRIBE_FIELD_NAME,
  defineProperty,
  createValueDescriptor,
  EMPTY_FUNC,
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
  isLikeAction,
  getStoreName,
  isStoreReady,
  checkStoresState,
  EMPTY_OBJECT,
  findStoreStateInStores,
  isStoreError,
  hasOwnProperty,
  isObject,
  createPromiseCancelable,
} from './utils'
import config from './config'
import { callWithNotAction, haveCycleInjectedStore, notObserver } from './messages'
import {
  FindNextMiddleware,
  DispatchAction,
  Action,
  Middleware,
  DirectorrInterface,
  DirectorrStores,
  DirectorrStoresState,
  SubscribeHandler,
  UnsubscribeHandler,
  CheckStoreState,
  DirectorrStoreClassConstructor,
  DepencyName,
  DirectorrOptions,
  DirectorrStore,
  Afterware,
} from './types'
import { ReduxMiddlewareAdapter, MiddlewareAdapter } from './MiddlewareAdapters'

export const MODULE_NAME = 'Directorr'
export const GLOBAL_DEP = { global: true }
export const OMIT_ACTIONS = ['@APPLY_SNAPSHOT']

export class Directorr implements DirectorrInterface {
  constructor({ initState = EMPTY_OBJECT, middlewares, stores }: DirectorrOptions = EMPTY_OBJECT) {
    this.initState = initState

    if (middlewares) this.addMiddlewares(middlewares)

    if (stores) this.addStores(stores)
  }

  private initState: DirectorrStoresState

  stores: DirectorrStores = new Map()

  getStore<C>(StoreConstructor: DirectorrStoreClassConstructor<C>): C | undefined {
    return this.stores.get(getStoreName(StoreConstructor))
  }

  getHydrateStoresState(): DirectorrStoresState {
    return config.hydrateStoresToState(this.stores)
  }

  setStateToStore = config.batchFunction((storeState: DirectorrStoresState) => {
    for (const [storeName, store] of this.stores.entries()) {
      if (hasOwnProperty(storeState, storeName)) {
        config.setStateToStore(storeState[storeName], store)
      }
    }
  })

  mergeStateToStore = config.batchFunction((storeState: DirectorrStoresState) => {
    for (const [storeName, store] of this.stores.entries()) {
      if (hasOwnProperty(storeState, storeName)) {
        config.mergeStateToStore(storeState[storeName], store)
      }
    }
  })

  addStores(modelOrConstructor: DirectorrStoreClassConstructor<any>[]) {
    modelOrConstructor.forEach(sm => this.addStore(sm))
  }

  addStore<I>(storeConstructor: DirectorrStoreClassConstructor<I>): I {
    return this.addStoreDependency(storeConstructor, GLOBAL_DEP)
  }

  removeStore(storeConstructor: DirectorrStoreClassConstructor<any>) {
    return this.removeStoreDependency(storeConstructor, GLOBAL_DEP)
  }

  addStoreDependency<I>(
    StoreConstructor: DirectorrStoreClassConstructor<I>,
    depName: DepencyName,
  ): I {
    const store = this.initStore(StoreConstructor)

    ;(store as any)[DEPENDENCY_FIELD_NAME].push(depName)

    return store
  }

  removeStoreDependency(
    StoreConstructor: DirectorrStoreClassConstructor<any>,
    depName: DepencyName,
  ) {
    const store = this.getStore(StoreConstructor)

    if (store) {
      const dependency: any[] = store[DEPENDENCY_FIELD_NAME]

      const index = dependency.indexOf(depName)

      if (index !== -1) dependency.splice(index, 1)

      if (!dependency.length) this.destroyStore(StoreConstructor)
    }
  }

  private initStore<I = any>(StoreConstructor: DirectorrStoreClassConstructor<I>): I {
    const storeName = getStoreName(StoreConstructor)

    if (this.stores.has(storeName)) return this.stores.get(storeName)

    // add injected stores
    if (hasOwnProperty(StoreConstructor, INJECTED_STORES_FIELD_NAME)) {
      const injectedModelsOrConstructors: any[] = (StoreConstructor as any)[
        INJECTED_STORES_FIELD_NAME
      ]

      try {
        for (const modelOrConstructor of injectedModelsOrConstructors) {
          const store = this.initStore(modelOrConstructor)
          store[INJECTED_FROM_FIELD_NAME].push(StoreConstructor)
        }
      } catch (error) {
        if (error instanceof RangeError) {
          throw new TypeError(haveCycleInjectedStore(MODULE_NAME))
        }

        throw error
      }
    }

    // add afterware
    if (StoreConstructor.afterware) this.addAfterware(StoreConstructor.afterware)

    // create store
    const store: any = new StoreConstructor(StoreConstructor.storeInitOptions)

    if (!hasOwnProperty(store, INJECTED_FROM_FIELD_NAME)) {
      defineProperty(store, INJECTED_FROM_FIELD_NAME, createValueDescriptor([]))
      defineProperty(store, DEPENDENCY_FIELD_NAME, createValueDescriptor([]))
    }

    // attach to directorr
    defineProperty(store, STORES_FIELD_NAME, createValueDescriptor(this.stores))
    defineProperty(store, DISPATCH_ACTION_FIELD_NAME, createValueDescriptor(this.dispatch))
    defineProperty(store, SUBSCRIBE_FIELD_NAME, createValueDescriptor(this.subscribe))

    if (!hasOwnProperty(store, DISPATCH_EFFECTS_FIELD_NAME))
      defineProperty(store, DISPATCH_EFFECTS_FIELD_NAME, createValueDescriptor(EMPTY_FUNC))

    // add store
    this.stores.set(storeName, store)

    // merge init state
    if (hasOwnProperty(this.initState, storeName)) {
      config.mergeStateToStore(this.initState[storeName], store)
      // remove outdated data
      delete this.initState[storeName]
    }

    // call init action
    if (hasOwnProperty(StoreConstructor, INJECTED_STORES_FIELD_NAME)) {
      const injectedModelsOrConstructors: DirectorrStore[] = (StoreConstructor as any)[
        INJECTED_STORES_FIELD_NAME
      ]
      const storeNames = injectedModelsOrConstructors.map(s => getStoreName(s))

      if (checkStoresState(this.stores, isStoreReady, storeNames)) {
        this.dispatchType(DIRECTORR_INIT_STORE_ACTION, { store })
      } else {
        void this.waitStoresState(injectedModelsOrConstructors).then(() => {
          this.dispatchType(DIRECTORR_INIT_STORE_ACTION, { store })
        })
      }
    } else {
      this.dispatchType(DIRECTORR_INIT_STORE_ACTION, { store })
    }

    return store
  }

  private destroyStore(
    StoreConstructor: DirectorrStoreClassConstructor,
    FromStoreConstructor?: DirectorrStoreClassConstructor,
  ) {
    const storeName = getStoreName(StoreConstructor)
    const store = this.stores.get(storeName)

    if (store) {
      // remove injected stores
      if (hasOwnProperty(StoreConstructor, INJECTED_STORES_FIELD_NAME)) {
        const injectedModelsOrConstructors: any[] = (StoreConstructor as any)[
          INJECTED_STORES_FIELD_NAME
        ]

        try {
          for (const modelOrConstructor of injectedModelsOrConstructors) {
            this.destroyStore(modelOrConstructor, StoreConstructor)
          }
        } catch (error) {
          if (error instanceof RangeError) {
            throw new TypeError(haveCycleInjectedStore(MODULE_NAME))
          }

          throw error
        }
      }

      // remove injected from stores
      if (FromStoreConstructor) {
        const injectedFrom: any[] = store[INJECTED_FROM_FIELD_NAME]
        const index = injectedFrom.indexOf(FromStoreConstructor)

        injectedFrom.splice(index, 1)
      }

      // when dont have dependencies
      if (!store[INJECTED_FROM_FIELD_NAME].length && !store[DEPENDENCY_FIELD_NAME].length) {
        // remove afterware
        if (StoreConstructor.afterware) this.removeAfterware(StoreConstructor.afterware)

        this.dispatchType(DIRECTORR_DESTROY_STORE_ACTION, { store })
        defineProperty(store, DISPATCH_ACTION_FIELD_NAME, createValueDescriptor(EMPTY_FUNC))

        // remove store
        this.stores.delete(storeName)
      }
    }
  }

  private subscribeHandlers: SubscribeHandler[] = []

  subscribe = (handler: SubscribeHandler): UnsubscribeHandler => {
    this.subscribeHandlers = [...this.subscribeHandlers, handler]

    return () => this.unsubscribe(handler)
  }

  unsubscribe = (handler: SubscribeHandler) => {
    this.subscribeHandlers = this.subscribeHandlers.filter(h => h !== handler)
  }

  waitAllStoresState(isStoreState: CheckStoreState = isStoreReady) {
    return createPromiseCancelable<any>((res, rej, whenCancel) => {
      if (checkStoresState(this.stores, isStoreState)) return res(undefined)

      const unsub = this.subscribe(stores => {
        if (checkStoresState(stores, isStoreState)) {
          unsub()

          return res(undefined)
        }
      })

      whenCancel(unsub)
    })
  }

  waitStoresState(stores: DirectorrStore[], isStoreState: CheckStoreState = isStoreReady) {
    const storeNames = stores.map(s => getStoreName(s))

    return createPromiseCancelable<any>((res, rej, whenCancel) => {
      if (checkStoresState(this.stores, isStoreState, storeNames)) return res(undefined)

      const unsub = this.subscribe(stores => {
        if (checkStoresState(stores, isStoreState, storeNames)) {
          unsub()

          return res(undefined)
        }
      })

      whenCancel(unsub)
    })
  }

  findStoreState(isStoreState: CheckStoreState = isStoreError) {
    return createPromiseCancelable<any>((res, rej, whenCancel) => {
      const store = findStoreStateInStores(this.stores, isStoreState)

      if (store) return res(store)

      const unsub = this.subscribe(stores => {
        const store = findStoreStateInStores(stores, isStoreState)

        if (store) {
          unsub()

          return res(store)
        }
      })

      whenCancel(unsub)
    })
  }

  private middlewares: MiddlewareAdapter[] = []

  private addSomeMiddlewares(
    middlewares: ReduxMiddleware[] | Middleware[],
    someMiddlewareAdapter: any,
  ) {
    const { length: totalMiddlewares } = this.middlewares

    for (let i = 0, l = middlewares.length, m: any; i < l; ++i) {
      m = middlewares[i]

      if (this.middlewares.some(mid => mid.middleware === m)) continue

      this.middlewares.push(
        new someMiddlewareAdapter(
          m,
          this.findNextMiddleware,
          totalMiddlewares + i,
          this,
          this.reduxStore,
        ),
      )
    }
  }

  addReduxMiddlewares(middlewares: ReduxMiddleware[]) {
    this.addSomeMiddlewares(middlewares, ReduxMiddlewareAdapter)
  }

  addMiddlewares(middlewares: Middleware[]) {
    this.addSomeMiddlewares(middlewares, MiddlewareAdapter)
  }

  removeMiddleware(middleware: Middleware | ReduxMiddleware) {
    const idx = this.middlewares.findIndex(m => m.middleware === middleware)

    this.middlewares.splice(idx, 1)
  }

  private findNextMiddleware: FindNextMiddleware = (nextIndex, action) => {
    const nextMiddleware = this.middlewares[nextIndex + 1]

    if (nextMiddleware) {
      nextMiddleware.run(action)
    } else {
      this.runEffects(action)
    }
  }

  dispatch: DispatchAction = config.batchFunction(action => {
    if (!isLikeAction(action)) throw new Error(callWithNotAction(MODULE_NAME, action))

    this.findNextMiddleware(-1, action)

    return action
  })

  dispatchType = (type: string, payload?: any) => this.dispatch(config.createAction(type, payload))

  reduxStore: Store = {
    getState: () => this.getHydrateStoresState(),
    dispatch: this.dispatch,
    subscribe: this.subscribe,
    replaceReducer: EMPTY_FUNC,
    [Symbol.observable]: () => {
      const { subscribe } = this

      return {
        subscribe(observer: any) {
          if (observer === null || !isObject(observer)) {
            throw new TypeError(notObserver())
          }

          return {
            unsubscribe: observer.next ? subscribe(stores => observer.next(stores)) : EMPTY_FUNC,
          }
        },
        [Symbol.observable]() {
          return this
        },
      }
    },
  }

  private afterwares: Afterware[] = []

  private addAfterware(afterware: Afterware) {
    this.afterwares = [...this.afterwares, afterware]
  }

  private removeAfterware(afterware: Afterware) {
    this.afterwares = this.afterwares.filter(a => a !== afterware)
  }

  private runEffects(action: Action) {
    for (const store of this.stores.values()) {
      store[DISPATCH_EFFECTS_FIELD_NAME](action)
    }

    for (const afterware of this.afterwares) {
      void afterware(action, this.dispatchType, this)
    }

    for (const handler of this.subscribeHandlers) {
      handler(this.stores, action)
    }
  }
}

export default Directorr
