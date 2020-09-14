import Directorr, { MODULE_NAME, GLOBAL_DEP } from '../Directorr';
import {
  DISPATCH_EFFECTS_FIELD_NAME,
  STORES_FIELD_NAME,
  DISPATCH_ACTION_FIELD_NAME,
  INJECTED_STORES_FIELD_NAME,
  defineProperty,
  createValueDescriptor,
  DEPENDENCY_FIELD_NAME,
  createAction,
  DIRECTORR_INIT_STORE_ACTION,
  INJECTED_FROM_FIELD_NAME,
  DIRECTORR_DESTROY_STORE_ACTION,
} from '../utils';
import config from '../config';
import { haveCycleInjectedStore } from '../messages';
import { action, actionTwo, actionType, someValue } from './mocks';
import { flushPromises } from './utils';

class Store {
  static storeInitOptions = someValue;

  initProps: any;
  [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn();
  [INJECTED_FROM_FIELD_NAME] = [];
  propOne = 1;
  propTwo = { someValue };

  constructor(initProps?: any) {
    this.initProps = initProps;
  }
}

class StoreTwo extends Store {}

class StoreInjected {
  [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn();
  [INJECTED_FROM_FIELD_NAME] = [];
  [DEPENDENCY_FIELD_NAME] = [];
}

class StoreWithInjectedStores {
  static [INJECTED_STORES_FIELD_NAME] = [StoreInjected];
  [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn();
  [INJECTED_FROM_FIELD_NAME] = [];
  propOne = 1;
  propTwo = { someValue };
}

class StoreWithInjectedStoresTwo {
  static [INJECTED_STORES_FIELD_NAME] = [StoreInjected];
  [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn();
  [INJECTED_FROM_FIELD_NAME] = [];
  propOne = 2;
  propTwo = { someValue: 'StoreWithInjectedStoresTwo' };
}

const initOptions = {};
const DEP = {};

describe('Directorr', () => {
  // afterEach(jest.clearAllMocks);

  it('reduxStores', () => {
    const director = new Directorr();

    expect((director as any).reduxStores).toMatchSnapshot();
  });

  it('addStore', () => {
    const director = new Directorr();
    director.addStoreDependency = jest.fn();

    director.addStore(Store, initOptions);

    expect(director.addStoreDependency).toHaveBeenCalledTimes(1);
    expect(director.addStoreDependency).toHaveBeenLastCalledWith(Store, GLOBAL_DEP, initOptions);
  });

  it('addStores', () => {
    const director = new Directorr();
    director.addStore = jest.fn();

    director.addStores(Store, StoreWithInjectedStores);

    expect(director.addStore).toHaveBeenCalledTimes(2);
    expect(director.addStore).toHaveBeenCalledWith(Store);
    expect(director.addStore).toHaveBeenCalledWith(StoreWithInjectedStores);
  });

  it('removeStore', () => {
    const director = new Directorr();

    director.removeStoreDependency = jest.fn();

    director.removeStore(Store);

    expect(director.removeStoreDependency).toHaveBeenCalledTimes(1);
    expect(director.removeStoreDependency).toHaveBeenLastCalledWith(Store, GLOBAL_DEP);
  });

  it('getStore', () => {
    const director = new Directorr();
    const store = new Store();
    const stores = new Map([[Store.name, store]]);

    defineProperty(director, 'stores', createValueDescriptor(stores));

    expect(director.getStore(Store)).toEqual(store);
    expect(director.getStore(StoreWithInjectedStores)).toEqual(undefined);
  });

  it('addStoreDependency', () => {
    const director = new Directorr();
    const store = {
      [DEPENDENCY_FIELD_NAME]: [],
    };
    const initStore = jest.fn().mockReturnValue(store);

    defineProperty(director, 'initStore', createValueDescriptor(initStore));

    expect(director.addStoreDependency(Store, DEP, initOptions)).toEqual(store);
    expect(initStore).toHaveBeenCalledTimes(1);
    expect(initStore).toHaveBeenLastCalledWith(Store, initOptions);
    expect(store[DEPENDENCY_FIELD_NAME]).toHaveLength(1);
    expect(store[DEPENDENCY_FIELD_NAME]).toContain(DEP);

    expect(director.addStoreDependency(StoreTwo, DEP, initOptions)).toEqual(store);
    expect(initStore).toHaveBeenCalledTimes(2);
    expect(initStore).toHaveBeenLastCalledWith(StoreTwo, initOptions);
    expect(store[DEPENDENCY_FIELD_NAME]).toHaveLength(2);
    expect(store[DEPENDENCY_FIELD_NAME]).toEqual([DEP, DEP]);
  });

  it('initStore', async () => {
    const director = new Directorr();

    const store = director.addStoreDependency(Store, DEP, initOptions);

    await flushPromises();

    expect(store).toBeInstanceOf(Store);
    expect(store.initProps).toEqual(Store.storeInitOptions);
    expect(store[STORES_FIELD_NAME]).toEqual(director.stores);
    expect(store[DISPATCH_ACTION_FIELD_NAME]).toEqual(director.dispatch);

    expect(director.getStore(Store)).toEqual(store);

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(1);
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenLastCalledWith(
      createAction(DIRECTORR_INIT_STORE_ACTION, { StoreConstructor: Store, initOptions })
    );

    const storeNext = director.addStoreDependency(Store, DEP, initOptions);

    expect(storeNext).toEqual(store);
  });

  it('initStore with injected store', async () => {
    const director = new Directorr();

    const store = director.addStoreDependency(StoreWithInjectedStores, DEP, initOptions);

    await flushPromises();

    expect(store).toBeInstanceOf(StoreWithInjectedStores);
    expect(director.getStore(StoreWithInjectedStores)).toEqual(store);
    expect(director.getStore(StoreWithInjectedStoresTwo)).toBeUndefined();

    const injectedStore = director.getStore(StoreInjected);

    expect(injectedStore).toBeInstanceOf(StoreInjected);
    expect(director.getStore(StoreInjected)).toEqual(injectedStore);

    const storeTwo = director.addStoreDependency(StoreWithInjectedStoresTwo, DEP, initOptions);

    await flushPromises();

    expect(storeTwo).toBeInstanceOf(StoreWithInjectedStoresTwo);
    expect(director.getStore(StoreWithInjectedStoresTwo)).toEqual(storeTwo);

    expect(injectedStore[INJECTED_FROM_FIELD_NAME]).toEqual([
      StoreWithInjectedStores,
      StoreWithInjectedStoresTwo,
    ]);
    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(3);
    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      1,
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        StoreConstructor: StoreInjected,
      })
    );
    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      2,
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        StoreConstructor: StoreWithInjectedStores,
        initOptions,
      })
    );
    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      3,
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        StoreConstructor: StoreWithInjectedStoresTwo,
        initOptions,
      })
    );

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(2);
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      1,
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        StoreConstructor: StoreWithInjectedStores,
        initOptions,
      })
    );
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      2,
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        StoreConstructor: StoreWithInjectedStoresTwo,
        initOptions,
      })
    );

    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(1);
    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledWith(
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        StoreConstructor: StoreWithInjectedStoresTwo,
        initOptions,
      })
    );
  });

  it('initStore with cyrcle injected stores', () => {
    class StoreOne extends StoreWithInjectedStores {}
    class StoreTwo extends StoreWithInjectedStores {}

    (StoreOne as any)[INJECTED_STORES_FIELD_NAME] = [StoreTwo];
    (StoreTwo as any)[INJECTED_STORES_FIELD_NAME] = [StoreOne];

    const director = new Directorr();

    expect(() => director.addStores(StoreOne, StoreTwo)).toThrowError(
      haveCycleInjectedStore(MODULE_NAME)
    );
  });

  it('initStore with storeName', () => {
    class StoreOne extends Store {
      static storeName = 'store_name';
    }

    class StoreTwo extends Store {
      static storeName = StoreOne.storeName;
    }

    const director = new Directorr();

    const store = director.addStoreDependency(StoreOne, DEP, initOptions);

    expect(store).toBeInstanceOf(StoreOne);
    expect(director.getStore(StoreOne)).toEqual(store);
    expect(director.getStore(StoreTwo)).toEqual(store);
  });

  it('initStore with afterware', async () => {
    class StoreWithAfterware extends Store {
      static afterware = jest.fn();
    }

    const director = new Directorr();

    const store = director.addStoreDependency(StoreWithAfterware, DEP);

    await flushPromises();

    expect(store).toBeInstanceOf(StoreWithAfterware);
    expect(director.getStore(StoreWithAfterware)).toEqual(store);

    expect(StoreWithAfterware.afterware).toHaveBeenCalledTimes(1);
    expect(StoreWithAfterware.afterware).toHaveBeenLastCalledWith(
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        StoreConstructor: StoreWithAfterware,
      }),
      director.dispatchType
    );
  });

  it('initStore with initState', async () => {
    jest.spyOn(config, 'mergeStateToStore');
    const initStoresState = {
      [Store.name]: {
        propOne: 'propOne',
        propTwo: { someValue: 'someValue' },
      },
      someAnotherStoreName: {
        propOne: 'propOne someAnotherStoreName',
        propTwo: { someValue: 'someValue someAnotherStoreName' },
      },
    };
    const director = new Directorr();

    director.addInitState(initStoresState);

    const store = director.addStore(Store);

    await flushPromises();

    expect(store).toBeInstanceOf(Store);
    expect(director.getStore(Store)).toEqual(store);

    expect(config.mergeStateToStore).toHaveBeenCalledTimes(1);
    expect(config.mergeStateToStore).toHaveBeenCalledWith(initStoresState[Store.name], store);

    expect(store).toMatchObject(initStoresState[Store.name]);
  });

  it('mergeStateToStore', () => {
    jest.spyOn(config, 'mergeStateToStore');
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
    };
    const director = new Directorr();

    const storeOne = director.addStore(Store);
    const storeTwo = director.addStore(StoreTwo);

    expect(storeOne).not.toMatchObject(initStoresState[Store.name]);
    expect(storeTwo).not.toMatchObject(initStoresState[StoreTwo.name]);

    director.mergeStateToStore(initStoresState);

    expect(config.mergeStateToStore).toHaveBeenCalledTimes(2);
    expect(config.mergeStateToStore).toHaveBeenCalledWith(initStoresState[Store.name], storeOne);
    expect(config.mergeStateToStore).toHaveBeenCalledWith(initStoresState[StoreTwo.name], storeTwo);

    expect(storeOne).toMatchObject(initStoresState[Store.name]);
    expect(storeTwo).toMatchObject(initStoresState[StoreTwo.name]);
  });

  it('removeStoreDependency', () => {
    const director = new Directorr();
    const destroyStore = jest.fn();

    defineProperty(director, 'destroyStore', createValueDescriptor(destroyStore));

    const store = director.addStoreDependency(Store, DEP);
    director.addStoreDependency(Store, DEP);

    expect(store[DEPENDENCY_FIELD_NAME]).toHaveLength(2);

    director.removeStoreDependency(StoreTwo, DEP);

    expect(destroyStore).toHaveBeenCalledTimes(0);

    director.removeStoreDependency(Store, DEP);

    expect(store[DEPENDENCY_FIELD_NAME]).toHaveLength(1);
    expect(destroyStore).toHaveBeenCalledTimes(0);

    director.removeStoreDependency(Store, DEP);

    expect(store[DEPENDENCY_FIELD_NAME]).toHaveLength(0);
    expect(destroyStore).toHaveBeenCalledTimes(1);
  });

  it('destroyStore', async () => {
    const director = new Directorr();

    const store = director.addStoreDependency(StoreWithInjectedStores, DEP);

    await flushPromises();

    expect(store).toBeInstanceOf(StoreWithInjectedStores);
    expect(director.getStore(StoreWithInjectedStores)).toEqual(store);
    expect(director.getStore(StoreWithInjectedStoresTwo)).toBeUndefined();

    const injectedStore = director.getStore(StoreInjected);

    expect(injectedStore).toBeInstanceOf(StoreInjected);
    expect(director.getStore(StoreInjected)).toEqual(injectedStore);

    director.removeStoreDependency(Store, DEP);

    expect(director.getStore(StoreWithInjectedStores)).toEqual(store);
    expect(director.getStore(StoreInjected)).toEqual(injectedStore);

    const storeTwo = director.addStoreDependency(StoreWithInjectedStoresTwo, DEP, initOptions);

    await flushPromises();

    expect(storeTwo).toBeInstanceOf(StoreWithInjectedStoresTwo);
    expect(director.getStore(StoreWithInjectedStoresTwo)).toEqual(storeTwo);

    director.removeStoreDependency(StoreWithInjectedStores, DEP);

    expect(director.getStore(StoreWithInjectedStores)).toBeUndefined();
    expect(director.getStore(StoreInjected)).toEqual(injectedStore);

    director.removeStoreDependency(StoreWithInjectedStoresTwo, DEP);

    expect(director.getStore(StoreWithInjectedStores)).toBeUndefined();
    expect(director.getStore(StoreWithInjectedStoresTwo)).toBeUndefined();
    expect(director.getStore(StoreInjected)).toBeUndefined();

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(3);
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      3,
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        StoreConstructor: StoreWithInjectedStores,
      })
    );

    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(4);
    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      2,
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        StoreConstructor: StoreWithInjectedStores,
      })
    );
    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      3,
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        StoreConstructor: StoreInjected,
      })
    );
    expect(storeTwo[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      4,
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        StoreConstructor: StoreWithInjectedStoresTwo,
      })
    );

    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(5);
    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      4,
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        StoreConstructor: StoreWithInjectedStores,
      })
    );
    expect(injectedStore[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      5,
      createAction(DIRECTORR_DESTROY_STORE_ACTION, {
        StoreConstructor: StoreInjected,
      })
    );
  });

  it('destroyStore with initState', async () => {
    const initStoresState = {
      [Store.name]: {
        propOne: 'propOne',
        propTwo: { someValue: 'someValue' },
      },
      someAnotherStoreName: {
        propOne: 'propOne someAnotherStoreName',
        propTwo: { someValue: 'someValue someAnotherStoreName' },
      },
    };
    const director = new Directorr();

    director.addInitState(initStoresState);

    const store = director.addStoreDependency(Store, DEP);

    await flushPromises();

    expect(store).toBeInstanceOf(Store);
    expect(director.getStore(Store)).toEqual(store);

    director.removeStoreDependency(Store, DEP);

    expect(initStoresState).toEqual({
      someAnotherStoreName: {
        propOne: 'propOne someAnotherStoreName',
        propTwo: { someValue: 'someValue someAnotherStoreName' },
      },
    });
  });

  it('subscribe logic', async () => {
    const subscribeHandler = jest.fn();
    const director = new Directorr();

    const unsub = director.subscribe(subscribeHandler);
    director.dispatch(action);

    expect(subscribeHandler).toHaveBeenCalledTimes(1);
    expect(subscribeHandler).toHaveBeenCalledWith(director.stores);

    unsub();

    director.dispatch(action);

    expect(subscribeHandler).toHaveBeenCalledTimes(1);
    expect(subscribeHandler).toHaveBeenCalledWith(director.stores);
  });

  it('waitAllStoresState with store isReady = true', async () => {
    const resolve = jest.fn();
    const reject = jest.fn();
    class StoreTrue extends Store {
      isReady = true;
    }

    const director = new Directorr();

    director.addStores(StoreTrue);

    director
      .waitAllStoresState()
      .then(resolve)
      .catch(reject);

    await flushPromises();

    expect(resolve).toHaveBeenCalled();
    expect(reject).not.toHaveBeenCalled();
  });

  it('waitAllStoresState with store isReady = false', async () => {
    const resolve = jest.fn();
    const reject = jest.fn();

    class StoreFalse extends Store {
      isReady = false;
    }

    const director = new Directorr();

    director.addStores(StoreFalse);

    director
      .waitAllStoresState()
      .then(resolve)
      .catch(reject);

    await flushPromises();

    expect(resolve).not.toHaveBeenCalled();
    expect(reject).not.toHaveBeenCalled();
  });

  it('waitStoresState', async () => {
    const resolve = jest.fn();
    const reject = jest.fn();

    class StoreTrue extends Store {
      isReady = true;
    }

    class StoreFalse extends Store {
      isReady = false;
    }

    const director = new Directorr();

    director.addStores(StoreTrue, StoreFalse);

    director
      .waitStoresState([StoreFalse])
      .then(resolve)
      .catch(reject);

    await flushPromises();

    expect(resolve).not.toHaveBeenCalled();
    expect(reject).not.toHaveBeenCalled();

    director
      .waitStoresState([StoreTrue])
      .then(resolve)
      .catch(reject);

    await flushPromises();

    expect(resolve).toHaveBeenCalled();
    expect(reject).not.toHaveBeenCalled();
  });

  it('findStoreState', async () => {
    const resolve = jest.fn();
    const reject = jest.fn();

    class StoreTrue extends Store {
      isError = true;
    }

    class StoreFalse extends Store {
      isError = false;
    }

    const director = new Directorr();

    director.addStores(StoreTrue, StoreFalse);

    director
      .findStoreState()
      .then(resolve)
      .catch(reject);

    await flushPromises();

    expect(resolve).toHaveBeenCalledWith(director.getStore(StoreTrue));
    expect(reject).not.toHaveBeenCalled();
  });

  it('addReduxMiddlewares', () => {
    const middlewareLogic = jest.fn();
    const middlewareOne = (store: any) => (next: any) => (action: any) => {
      middlewareLogic(store, next, action);
      next(action);
    };
    const middlewareTwo = (store: any) => (next: any) => (action: any) => {
      middlewareLogic(store, next, action);
      next(action);
    };
    const director = new Directorr();

    director.addReduxMiddlewares(middlewareOne, middlewareTwo);
    director.dispatch(action);

    expect(middlewareLogic).toHaveBeenCalledTimes(2);
    expect(middlewareLogic).toHaveBeenNthCalledWith(
      1,
      director.reduxStores,
      director.middlewares[0].next,
      action
    );
    expect(middlewareLogic).toHaveBeenNthCalledWith(
      2,
      director.reduxStores,
      director.middlewares[1].next,
      action
    );
  });

  it('addMiddlewares', () => {
    const middlewareOne = jest.fn().mockImplementation((action, next) => next(action));
    const middlewareTwo = jest.fn().mockImplementation((action, next) => next(action));
    const director = new Directorr();

    director.addMiddlewares(middlewareOne, middlewareTwo);
    director.dispatch(action);

    expect(middlewareOne).toHaveBeenCalledTimes(1);
    expect(middlewareOne).toHaveBeenCalledWith(action, director.middlewares[0].next, director);
    expect(middlewareTwo).toHaveBeenCalledTimes(1);
    expect(middlewareTwo).toHaveBeenCalledWith(action, director.middlewares[1].next, director);
  });

  it('dispatchType', () => {
    const dispatch = jest.fn();
    const director = new Directorr();

    director.dispatch = dispatch;

    director.dispatchType(actionType, someValue);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(action);
  });

  it('dispatch logic', () => {
    const middleware = jest.fn().mockImplementation((action, next) => next(action));
    const initPayload = {
      StoreConstructor: Store,
    };

    const director = new Directorr();

    director.addMiddlewares(middleware);
    director.addStores(Store);

    const store = director.getStore(Store);

    expect(store).toBeInstanceOf(Store);

    director.dispatch(action);

    store[DISPATCH_ACTION_FIELD_NAME](actionTwo);

    expect(middleware).toHaveBeenCalledTimes(3);
    expect(middleware).toHaveBeenNthCalledWith(
      1,
      createAction(DIRECTORR_INIT_STORE_ACTION, initPayload),
      director.middlewares[0].next,
      director
    );
    expect(middleware).toHaveBeenNthCalledWith(2, action, director.middlewares[0].next, director);
    expect(middleware).toHaveBeenNthCalledWith(
      3,
      actionTwo,
      director.middlewares[0].next,
      director
    );

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(3);
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(
      1,
      createAction(DIRECTORR_INIT_STORE_ACTION, initPayload)
    );
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(2, action);
    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenNthCalledWith(3, actionTwo);
  });
});
