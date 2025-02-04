import Directorr, { MODULE_NAME, GLOBAL_DEP } from '../../Directorr/Directorr'
import {
  // DISPATCH_EFFECTS_FIELD_NAME,
  // STORES_FIELD_NAME,
  // DISPATCH_ACTION_FIELD_NAME,
  // INJECTED_STORES_FIELD_NAME,
  // defineProperty,
  // createValueDescriptor,
  // DEPENDENCY_FIELD_NAME,
  createAction,
  // DIRECTORR_INIT_STORE_ACTION,
  // INJECTED_FROM_FIELD_NAME,
  // DIRECTORR_DESTROY_STORE_ACTION,
  // EMPTY_FUNC,
} from '../../Directorr/directorrUtils'
import config from '../../config'
import { haveCycleInjectedStore, callWithNotAction, notObserver } from '../../messages'
import { action, actionTwo, actionType, someValue } from '../../__mocks__/mocks'
import { flushPromises } from '../../../../../tests/utils'
import {
  DEPENDENCY_FIELD_NAME,
  DIRECTORR_DESTROY_STORE_ACTION,
  DIRECTORR_INIT_STORE_ACTION,
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  EMPTY_FUNC,
  INJECTED_FROM_FIELD_NAME,
  INJECTED_STORES_FIELD_NAME,
  STORES_FIELD_NAME,
} from '../../constants'
import { defineProperty } from '../../utils/primitives'
import { createValueDescriptor } from '../../utils/decoratorsUtils'

class Store {
  static storeInitOptions = someValue

  initProps: any;

  [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn()

  propOne = 1

  propTwo = { someValue }

  constructor(initProps?: any) {
    this.initProps = initProps
  }
}

class StoreTwo extends Store {}

class StoreInjected {
  [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn();

  [DEPENDENCY_FIELD_NAME] = []
}

class StoreWithInjectedStores {
  static [INJECTED_STORES_FIELD_NAME] = [StoreInjected];

  [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn()

  propOne = 1

  propTwo = { someValue }
}

class StoreWithInjectedStoresAndDepency {
  static [INJECTED_STORES_FIELD_NAME] = [StoreInjected];

  [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn();

  [INJECTED_FROM_FIELD_NAME] = [];

  [DEPENDENCY_FIELD_NAME] = []

  propOne = 2

  propTwo = { someValue: 'StoreWithInjectedStoresAndDepency' }
}

const DEP = {}

describe('Directorr', () => {
  it('addStore', () => {
    const director = new Directorr()
    director.addStoreDependency = jest.fn()

    director.addStore(Store)

    expect(director.addStoreDependency).toBeCalledTimes(1)
    expect(director.addStoreDependency).lastCalledWith(Store, GLOBAL_DEP)
  })

  it('addStores', () => {
    const director = new Directorr()
    director.addStore = jest.fn()

    director.addStores([Store, StoreWithInjectedStores])

    expect(director.addStore).toBeCalledTimes(2)
    expect(director.addStore).toBeCalledWith(Store)
    expect(director.addStore).toBeCalledWith(StoreWithInjectedStores)
  })

  it('removeStore', () => {
    const director = new Directorr()

    director.removeStoreDependency = jest.fn()

    director.removeStore(Store)

    expect(director.removeStoreDependency).toBeCalledTimes(1)
    expect(director.removeStoreDependency).lastCalledWith(Store, GLOBAL_DEP)
  })

  it('getStore', () => {
    const director = new Directorr()
    const store = new Store()
    const stores = new Map([[Store.name, store]])

    defineProperty(director, 'stores', createValueDescriptor(stores))

    expect(director.getStore(Store)).toBe(store)
    expect(director.getStore(StoreWithInjectedStores)).toBeUndefined()
  })

  it('addStoreDependency', () => {
    const director = new Directorr()
    const store = {
      [DEPENDENCY_FIELD_NAME]: [],
    }
    const initStore = jest.fn().mockReturnValue(store)

    defineProperty(director, 'initStore', createValueDescriptor(initStore))

    expect(director.addStoreDependency(Store, DEP)).toBe(store)
    expect(initStore).toBeCalledTimes(1)
    expect(initStore).lastCalledWith(Store)
    expect(store[DEPENDENCY_FIELD_NAME]).toHaveLength(1)
    expect(store[DEPENDENCY_FIELD_NAME]).toContain(DEP)

    expect(director.addStoreDependency(StoreTwo, DEP)).toBe(store)
    expect(initStore).toBeCalledTimes(2)
    expect(initStore).lastCalledWith(StoreTwo)
    expect(store[DEPENDENCY_FIELD_NAME]).toHaveLength(2)
    expect(store[DEPENDENCY_FIELD_NAME]).toStrictEqual([DEP, DEP])
  })

  it('initStore', async () => {
    const director = new Directorr()

    const store: any = director.addStoreDependency(Store, DEP)

    await flushPromises()

    expect(store).toBeInstanceOf(Store)
    expect(store.initProps).toBe(Store.storeInitOptions)
    expect(store[STORES_FIELD_NAME]).toBe(director.stores)
    expect(store[DISPATCH_ACTION_FIELD_NAME]).toBe(director.dispatch)
    expect(store[INJECTED_FROM_FIELD_NAME]).toHaveLength(0)

    expect(director.getStore(Store)).toBe(store)

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(1)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      1,
      createAction(DIRECTORR_INIT_STORE_ACTION, { store }),
    )

    const storeNext = director.addStoreDependency(Store, DEP)

    expect(storeNext).toBe(store)
  })

  it('initStore with store dont used decorators', async () => {
    class SomeStore {
      static storeInitOptions = {}

      initProps: any

      constructor(initProps: any) {
        this.initProps = initProps
      }
    }
    const director = new Directorr()

    const store: any = director.addStoreDependency(SomeStore, DEP)

    await flushPromises()

    expect(store).toBeInstanceOf(SomeStore)
    expect(store.initProps).toBe(SomeStore.storeInitOptions)
    expect(store[STORES_FIELD_NAME]).toBe(director.stores)
    expect(store[DISPATCH_ACTION_FIELD_NAME]).toBe(director.dispatch)
    expect(store[INJECTED_FROM_FIELD_NAME]).toHaveLength(0)

    expect(director.getStore(SomeStore)).toBe(store)

    const storeNext = director.addStoreDependency(SomeStore, DEP)

    expect(storeNext).toBe(store)
  })

  it('initStore with injected store', async () => {
    const director = new Directorr()

    const store = director.addStoreDependency(StoreWithInjectedStores, DEP)

    await flushPromises()

    expect(store).toBeInstanceOf(StoreWithInjectedStores)
    expect(director.getStore(StoreWithInjectedStores)).toBe(store)
    expect(director.getStore(StoreWithInjectedStoresAndDepency)).toBeUndefined()

    const injectedStore: any = director.getStore(StoreInjected)

    expect(injectedStore).toBeInstanceOf(StoreInjected)
    expect(director.getStore(StoreInjected)).toBe(injectedStore)
    expect(injectedStore[INJECTED_FROM_FIELD_NAME]).toMatchObject([StoreWithInjectedStores])

    const storeTwo = director.addStoreDependency(StoreWithInjectedStoresAndDepency, DEP)

    await flushPromises()

    expect(storeTwo).toBeInstanceOf(StoreWithInjectedStoresAndDepency)
    expect(director.getStore(StoreWithInjectedStoresAndDepency)).toBe(storeTwo)
    expect(injectedStore[INJECTED_FROM_FIELD_NAME]).toMatchObject([
      StoreWithInjectedStores,
      StoreWithInjectedStoresAndDepency,
    ])

    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(3)
    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      1,
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        store: injectedStore,
      }),
    )
    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      2,
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        store,
      }),
    )
    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      3,
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        store: storeTwo,
      }),
    )

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(2)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      1,
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        store,
      }),
    )
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      2,
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        store: storeTwo,
      }),
    )

    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(1)
    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      1,
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        store: storeTwo,
      }),
    )
  })

  it('initStore with cyrcle injected stores', () => {
    class StoreOne extends StoreWithInjectedStores {}
    class StoreTwo extends StoreWithInjectedStores {}

    ;(StoreOne as any)[INJECTED_STORES_FIELD_NAME] = [StoreTwo]
    ;(StoreTwo as any)[INJECTED_STORES_FIELD_NAME] = [StoreOne]

    const director = new Directorr()

    expect(() => director.addStores([StoreOne, StoreTwo])).toThrowError(
      haveCycleInjectedStore(MODULE_NAME),
    )
  })

  it('initStore with storeName', () => {
    class StoreOne extends Store {
      static storeName = 'store_name'
    }

    class StoreTwo extends Store {
      static storeName = StoreOne.storeName
    }

    const director = new Directorr()

    const store = director.addStoreDependency(StoreOne, DEP)

    expect(store).toBeInstanceOf(StoreOne)
    expect(director.getStore(StoreOne)).toBe(store)
    expect(director.getStore(StoreTwo)).toBe(store)
  })

  it('initStore with initState', async () => {
    jest.spyOn(config, 'mergeStateToStore')
    const initState = {
      [Store.name]: {
        propOne: 'propOne',
        propTwo: { someValue: 'someValue' },
      },
      someAnotherStoreName: {
        propOne: 'propOne someAnotherStoreName',
        propTwo: { someValue: 'someValue someAnotherStoreName' },
      },
    }
    const director = new Directorr({ initState: JSON.parse(JSON.stringify(initState)) })

    const store = director.addStore(Store)

    await flushPromises()

    expect(store).toBeInstanceOf(Store)
    expect(director.getStore(Store)).toBe(store)

    expect(config.mergeStateToStore).toBeCalledTimes(1)
    expect(config.mergeStateToStore).toBeCalledWith(initState[Store.name], store)

    expect(store).toMatchObject(initState[Store.name])
  })

  it('mergeStateToStore', () => {
    jest.spyOn(config, 'mergeStateToStore')
    const initStoresState = {
      [Store.name]: {
        propOne: 'propOne',
        propTwo: { someValue: 'someValue' },
      },
      [StoreTwo.name]: {
        propOne: 'propOne StoreTwo',
        propTwo: { someValue: 'someValue StoreTwo' },
      },
      someAnotherStoreName: {
        propOne: 'propOne someAnotherStoreName',
        propTwo: { someValue: 'someValue someAnotherStoreName' },
      },
    }
    const director = new Directorr()

    const storeOne = director.addStore(Store)
    const storeTwo = director.addStore(StoreTwo)

    expect(storeOne).not.toMatchObject(initStoresState[Store.name])
    expect(storeTwo).not.toMatchObject(initStoresState[StoreTwo.name])

    director.mergeStateToStore({})

    expect(storeOne).not.toMatchObject(initStoresState[Store.name])
    expect(storeTwo).not.toMatchObject(initStoresState[StoreTwo.name])

    director.mergeStateToStore(initStoresState)

    expect(config.mergeStateToStore).toBeCalledTimes(2)
    expect(config.mergeStateToStore).toBeCalledWith(initStoresState[Store.name], storeOne)
    expect(config.mergeStateToStore).toBeCalledWith(initStoresState[StoreTwo.name], storeTwo)

    expect(storeOne).toMatchObject(initStoresState[Store.name])
    expect(storeTwo).toMatchObject(initStoresState[StoreTwo.name])
  })

  it('removeStoreDependency', () => {
    const director = new Directorr()
    const destroyStore = jest.fn()
    const wrongDep = {}

    defineProperty(director, 'destroyStore', createValueDescriptor(destroyStore))

    const store: any = director.addStoreDependency(Store, DEP)
    director.addStoreDependency(Store, DEP)

    expect(store[DEPENDENCY_FIELD_NAME]).toHaveLength(2)

    director.removeStoreDependency(StoreTwo, DEP)

    expect(destroyStore).toBeCalledTimes(0)

    director.removeStoreDependency(Store, wrongDep)

    expect(destroyStore).toBeCalledTimes(0)

    director.removeStoreDependency(Store, DEP)

    expect(store[DEPENDENCY_FIELD_NAME]).toHaveLength(1)
    expect(destroyStore).toBeCalledTimes(0)

    director.removeStoreDependency(Store, DEP)

    expect(store[DEPENDENCY_FIELD_NAME]).toHaveLength(0)
    expect(destroyStore).toBeCalledTimes(1)
  })

  it('destroyStore', async () => {
    const director = new Directorr()

    expect(() => (director as any).destroyStore(StoreWithInjectedStores)).not.toThrow()

    const store = director.addStoreDependency(StoreWithInjectedStores, DEP)

    await flushPromises()

    expect(store).toBeInstanceOf(StoreWithInjectedStores)
    expect(director.getStore(StoreWithInjectedStores)).toBe(store)
    expect(director.getStore(StoreWithInjectedStoresAndDepency)).toBeUndefined()

    const injectedStore: any = director.getStore(StoreInjected)

    expect(injectedStore).toBeInstanceOf(StoreInjected)
    expect(director.getStore(StoreInjected)).toBe(injectedStore)

    director.removeStoreDependency(Store, DEP)

    expect(director.getStore(StoreWithInjectedStores)).toBe(store)
    expect(director.getStore(StoreInjected)).toBe(injectedStore)

    const storeTwo = director.addStoreDependency(StoreWithInjectedStoresAndDepency, DEP)

    await flushPromises()

    expect(storeTwo).toBeInstanceOf(StoreWithInjectedStoresAndDepency)
    expect(director.getStore(StoreWithInjectedStoresAndDepency)).toBe(storeTwo)

    director.removeStoreDependency(StoreWithInjectedStores, DEP)

    expect(director.getStore(StoreWithInjectedStores)).toBeUndefined()
    expect(director.getStore(StoreInjected)).toBe(injectedStore)

    director.removeStoreDependency(StoreWithInjectedStoresAndDepency, DEP)

    expect(director.getStore(StoreWithInjectedStores)).toBeUndefined()
    expect(director.getStore(StoreWithInjectedStoresAndDepency)).toBeUndefined()
    expect(director.getStore(StoreInjected)).toBeUndefined()

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(3)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).lastCalledWith(
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        store,
      }),
    )

    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(4)
    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      2,
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        store,
      }),
    )
    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      3,
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        store: injectedStore,
      }),
    )
    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      4,
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        store: storeTwo,
      }),
    )

    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(5)
    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      4,
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        store,
      }),
    )
    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(
      5,
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        store: injectedStore,
      }),
    )
  })

  it('destroyStore with initState', async () => {
    const initState = {
      [Store.name]: {
        propOne: 'propOne',
        propTwo: { someValue: 'someValue' },
      },
      someAnotherStoreName: {
        propOne: 'propOne someAnotherStoreName',
        propTwo: { someValue: 'someValue someAnotherStoreName' },
      },
    }
    const director = new Directorr({ initState })

    const store = director.addStoreDependency(Store, DEP)

    await flushPromises()

    expect(store).toBeInstanceOf(Store)
    expect(director.getStore(Store)).toBe(store)

    director.removeStoreDependency(Store, DEP)

    expect(initState).toStrictEqual({
      someAnotherStoreName: {
        propOne: 'propOne someAnotherStoreName',
        propTwo: { someValue: 'someValue someAnotherStoreName' },
      },
    })
  })

  it('destroyStore with cyrcle injected stores', async () => {
    class StoreOne extends StoreWithInjectedStores {}
    class StoreTwo extends StoreWithInjectedStores {}

    const director = new Directorr()

    director.addStoreDependency(StoreOne, DEP)
    director.addStoreDependency(StoreTwo, DEP)

    await flushPromises()
    ;(StoreOne as any)[INJECTED_STORES_FIELD_NAME] = [StoreTwo]
    ;(StoreTwo as any)[INJECTED_STORES_FIELD_NAME] = [StoreOne]

    expect(() => director.removeStoreDependency(StoreOne, DEP)).toThrowError(
      haveCycleInjectedStore(MODULE_NAME),
    )
  })

  it('subscribe logic', () => {
    const subscribeHandler = jest.fn()
    const director = new Directorr()

    const unsub = director.subscribe(subscribeHandler)
    director.dispatch(action)

    expect(subscribeHandler).toBeCalledTimes(1)
    expect(subscribeHandler).toBeCalledWith(director.stores, action)

    unsub()

    director.dispatch(action)

    expect(subscribeHandler).toBeCalledTimes(1)
    expect(subscribeHandler).toBeCalledWith(director.stores, action)

    // double unsub
    director.unsubscribe(subscribeHandler)

    director.dispatch(action)

    expect(subscribeHandler).toBeCalledTimes(1)
    expect(subscribeHandler).toBeCalledWith(director.stores, action)
  })

  it('unsubscribe when subscribe handler call', () => {
    const director = new Directorr()
    const handlerUnsub = jest.fn()
    const handler = jest.fn()

    const unsub = director.subscribe(store => {
      handlerUnsub(store)
      unsub()
    })
    director.subscribe(handler)
    director.dispatch(action)

    expect(handlerUnsub).toBeCalledTimes(1)
    expect(handlerUnsub).toBeCalledWith(director.stores)
    expect(handler).toBeCalledTimes(1)
  })

  it('waitAllStoresState with store isReady = true', async () => {
    const resolve = jest.fn()
    const reject = jest.fn()
    class StoreTrue extends Store {
      isReady = true
    }

    const director = new Directorr()

    director.addStores([StoreTrue])

    director.waitAllStoresState().then(resolve).catch(reject)

    await flushPromises()

    expect(resolve).toBeCalled()
    expect(reject).not.toBeCalled()
  })

  it('waitAllStoresState with store isReady = false', async () => {
    const resolve = jest.fn()
    const reject = jest.fn()

    class StoreFalse extends Store {
      isReady = false
    }

    const director = new Directorr()

    director.addStores([StoreFalse])

    director.waitAllStoresState().then(resolve).catch(reject)

    await flushPromises()

    expect(resolve).not.toBeCalled()
    expect(reject).not.toBeCalled()
  })

  it('waitAllStoresState with store that change isReady', async () => {
    const resolve = jest.fn()
    const reject = jest.fn()

    class StoreReady extends Store {
      isReady = false

      changeReady() {
        this.isReady = !this.isReady
      }
    }

    const director = new Directorr()

    const store = director.addStore(StoreReady)

    director.waitAllStoresState().then(resolve).catch(reject)

    await flushPromises()

    expect(resolve).not.toBeCalled()
    expect(reject).not.toBeCalled()

    director.dispatch(action)

    expect(resolve).not.toBeCalled()
    expect(reject).not.toBeCalled()

    store.changeReady()
    director.dispatch(action)

    await flushPromises()

    expect(resolve).toBeCalled()
    expect(reject).not.toBeCalled()
  })

  it('waitStoresState', async () => {
    const resolve = jest.fn()
    const reject = jest.fn()

    class StoreTrue extends Store {
      isReady = true
    }

    class StoreFalse extends Store {
      isReady = false
    }

    const director = new Directorr()

    director.addStores([StoreTrue, StoreFalse])

    director.waitStoresState([StoreFalse]).then(resolve).catch(reject)

    await flushPromises()

    expect(resolve).not.toBeCalled()
    expect(reject).not.toBeCalled()

    director.waitStoresState([StoreTrue]).then(resolve).catch(reject)

    await flushPromises()

    expect(resolve).toBeCalled()
    expect(reject).not.toBeCalled()
  })

  it('waitStoresState with store that change isReady', async () => {
    const resolve = jest.fn()
    const reject = jest.fn()

    class StoreReady extends Store {
      isReady = false

      changeReady() {
        this.isReady = !this.isReady
      }
    }

    const director = new Directorr()

    const store = director.addStore(StoreReady)

    director.waitStoresState([StoreReady]).then(resolve).catch(reject)

    await flushPromises()

    expect(resolve).not.toBeCalled()
    expect(reject).not.toBeCalled()

    director.dispatch(action)

    expect(resolve).not.toBeCalled()
    expect(reject).not.toBeCalled()

    store.changeReady()
    director.dispatch(action)

    await flushPromises()

    expect(resolve).toBeCalled()
    expect(reject).not.toBeCalled()
  })

  it('findStoreState', async () => {
    const resolve = jest.fn()
    const reject = jest.fn()

    class StoreTrue extends Store {
      isError = true
    }

    class StoreFalse extends Store {
      isError = false
    }

    const director = new Directorr()

    director.addStores([StoreTrue, StoreFalse])

    director.findStoreState().then(resolve).catch(reject)

    await flushPromises()

    expect(resolve).toBeCalledWith(director.getStore(StoreTrue))
    expect(reject).not.toBeCalled()
  })

  it('findStoreState with store that change isError', async () => {
    const resolve = jest.fn()
    const reject = jest.fn()

    class StoreError extends Store {
      isError = false

      changeError() {
        this.isError = !this.isError
      }
    }

    const director = new Directorr()

    const store = director.addStore(StoreError)

    director.findStoreState().then(resolve).catch(reject)

    await flushPromises()

    expect(resolve).not.toBeCalled()
    expect(reject).not.toBeCalled()

    director.dispatch(action)

    expect(resolve).not.toBeCalled()
    expect(reject).not.toBeCalled()

    store.changeError()
    director.dispatch(action)

    await flushPromises()

    expect(resolve).toBeCalledWith(store)
    expect(reject).not.toBeCalled()
  })

  it('check unsubscribe when findStoreState and waitStoresState in Promise.race with store that change isError', async () => {
    const resolve = jest.fn()
    const reject = jest.fn()

    class StoreReady extends Store {
      isReady = false

      changeReady() {
        this.isReady = !this.isReady
      }
    }

    class StoreError extends Store {
      isError = false

      changeError() {
        this.isError = !this.isError
      }
    }

    const director = new Directorr()

    jest.spyOn(director, 'unsubscribe')

    director.addStores([StoreReady])

    const store = director.addStore(StoreError)
    const waitStores = director.waitStoresState([StoreReady, StoreError])

    Promise.race([waitStores, director.findStoreState()]).then(resolve).catch(reject)

    await flushPromises()

    expect(resolve).not.toBeCalled()
    expect(reject).not.toBeCalled()

    director.dispatch(action)

    expect(resolve).not.toBeCalled()
    expect(reject).not.toBeCalled()

    store.changeError()
    director.dispatch(action)

    await flushPromises()

    expect(resolve).toBeCalledWith(store)
    expect(reject).not.toBeCalled()
    expect(director.unsubscribe).toBeCalledTimes(1)

    waitStores.cancel()

    expect(director.unsubscribe).toBeCalledTimes(2)
  })

  it('addReduxMiddlewares', () => {
    const middlewareOneLogic = jest.fn()
    const middlewareTwoLogic = jest.fn()
    const middlewareOne = (store: any) => (next: any) => (action: any) => {
      middlewareOneLogic(store, action)
      next(action)
    }
    const middlewareTwo = (store: any) => () => (action: any) => {
      middlewareTwoLogic(store, action)
    }
    const director = new Directorr()

    const store = director.addStore(Store)
    director.addReduxMiddlewares([middlewareOne])
    director.dispatch(action)

    expect(middlewareOneLogic).toBeCalledTimes(1)
    expect(middlewareOneLogic).lastCalledWith(director.reduxStore, action)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(2)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).lastCalledWith(action)

    director.addReduxMiddlewares([middlewareTwo])
    director.dispatch(action)

    expect(middlewareTwoLogic).toBeCalledTimes(1)
    expect(middlewareTwoLogic).lastCalledWith(director.reduxStore, action)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(2)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).lastCalledWith(action)
  })

  it('addMiddlewares', () => {
    const middlewareOneLogic = jest.fn()
    const middlewareTwoLogic = jest.fn()
    const middlewareOne = jest.fn().mockImplementation((action, next, director) => {
      middlewareOneLogic(action, director)
      next(action)
    })
    const middlewareTwo = jest
      .fn()
      .mockImplementation((action, next, director) => middlewareTwoLogic(action, director))
    const director = new Directorr()

    const store = director.addStore(Store)
    director.addMiddlewares([middlewareOne])
    director.dispatch(action)

    expect(middlewareOneLogic).toBeCalledTimes(1)
    expect(middlewareOneLogic).lastCalledWith(action, director)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(2)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).lastCalledWith(action)

    director.addMiddlewares([middlewareTwo])
    director.dispatch(action)

    expect(middlewareTwoLogic).toBeCalledTimes(1)
    expect(middlewareTwoLogic).lastCalledWith(action, director)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(2)
  })

  it('addMiddlewares with already added middleware', () => {
    const middleware = jest.fn().mockImplementation((action, next) => next(action))
    const director = new Directorr()

    director.addMiddlewares([middleware])
    director.addMiddlewares([middleware])
    director.dispatch(action)

    expect(middleware).toBeCalledTimes(1)
  })

  it('dispatchType', () => {
    const dispatch = jest.fn()
    const director = new Directorr()

    director.dispatch = dispatch

    director.dispatchType(actionType, someValue)

    expect(dispatch).toBeCalledTimes(1)
    expect(dispatch).toBeCalledWith(action)
  })

  it('dispatch logic', () => {
    const middlewareLogic = jest.fn()
    const middleware = jest.fn().mockImplementation((action, next, director) => {
      middlewareLogic(action, director)
      next(action)
    })
    const wrongAction: any = {}

    const director = new Directorr()

    director.addMiddlewares([middleware])

    const store: any = director.addStore(Store)

    const initStoreAction = createAction(DIRECTORR_INIT_STORE_ACTION, {
      store,
    })

    expect(store).toBeInstanceOf(Store)

    expect(() => director.dispatch(wrongAction)).toThrowError(
      callWithNotAction(MODULE_NAME, wrongAction),
    )

    director.dispatch(action)

    store[DISPATCH_ACTION_FIELD_NAME](actionTwo)

    expect(middlewareLogic).toBeCalledTimes(3)
    expect(middlewareLogic).nthCalledWith(1, initStoreAction, director)
    expect(middlewareLogic).nthCalledWith(2, action, director)
    expect(middlewareLogic).nthCalledWith(3, actionTwo, director)

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(3)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(1, initStoreAction)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(2, action)
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).nthCalledWith(3, actionTwo)
  })

  it('getHydrateStoresState', () => {
    const dispatch = jest.fn()
    const director = new Directorr()
    const propOne = 'propOne'
    const propTwo = 'propTwo'
    class SomeClassOne {
      [DISPATCH_EFFECTS_FIELD_NAME] = dispatch

      propOne = propOne
    }
    class SomeClassTwo {
      [DISPATCH_EFFECTS_FIELD_NAME] = dispatch

      propTwo = propTwo
    }

    director.addStores([SomeClassOne, SomeClassTwo])

    expect(director.getHydrateStoresState()).toMatchObject({
      [SomeClassOne.name]: {
        propOne,
      },
      [SomeClassTwo.name]: {
        propTwo,
      },
    })
  })

  it('reduxStores', () => {
    const { reduxStore, stores, dispatch, subscribe } = new Directorr()
    const next = jest.fn()

    expect(reduxStore.getState()).toMatchObject({})
    expect(reduxStore.dispatch).toBe(dispatch)
    expect(reduxStore.subscribe).toBe(subscribe)
    expect(reduxStore.replaceReducer).toBe(EMPTY_FUNC)

    const observable = reduxStore[Symbol.observable]()

    expect(observable[Symbol.observable]()).toBe(observable)
    expect(() => observable.subscribe(null as any)).toThrowError(notObserver())
    expect(observable.subscribe({})).toMatchObject({ unsubscribe: EMPTY_FUNC })

    const { unsubscribe } = observable.subscribe({
      next,
    })
    dispatch(action)

    expect(next).toBeCalledTimes(1)
    expect(next).toBeCalledWith(stores)

    unsubscribe()
    dispatch(action)

    expect(next).toBeCalledTimes(1)
  })
})
