import { Middleware as ReduxMiddleware, Store } from 'redux';

import {
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  INJECTED_STORES_FIELD_NAME,
  STORES_FIELD_NAME,
  INJECTED_FROM_FIELD_NAME,
  DEPENDENCY_FIELD_NAME,
  defineProperty,
  createValueDescriptor,
  emptyFunc,
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
} from './utils';
import config from './config';
import { callWithNotAction, haveCycleInjectedStore } from './messages';
import {
  FindNextMiddleware,
  DispatchAction,
  Action,
  DirectorrStoreClass,
  Middleware,
  DirectorrInterface,
  DirectorrStores,
  DirectorrStoresState,
  SubscribeHandler,
  UnsubscribeHandler,
  CheckStoreState,
  Afterware,
  DirectorrStoreClassConstructor,
} from './types';
import { ReduxMiddlewareAdapter, MiddlewareAdapter } from './MiddlewareAdapters';

export const MODULE_NAME = 'Directorr';
export const GLOBAL_DEP = { global: true };

class Directorr implements DirectorrInterface {
  stores: DirectorrStores = new Map();

  getStore(StoreConstructor: DirectorrStoreClassConstructor<any>) {
    return this.stores.get(getStoreName(StoreConstructor));
  }

  getHydrateStoresState(): DirectorrStoresState {
    return config.hydrateStoresToState(this.stores);
  }

  mergeStateToStore(storeState: DirectorrStoresState) {
    for (const [storeName, store] of this.stores.entries()) {
      if (storeName in storeState) {
        config.mergeStateToStore(storeState[storeName], store);
      }
    }
  }

  private initStoreState: DirectorrStoresState = EMPTY_OBJECT;

  addInitState(initStoreState: DirectorrStoresState = EMPTY_OBJECT) {
    this.initStoreState = initStoreState;
  }

  addStores(...storeConstructors: DirectorrStoreClassConstructor<any>[]) {
    storeConstructors.forEach(sc => this.addStore(sc));
  }

  addStore(storeConstructor: DirectorrStoreClassConstructor<any>, initStoreOptions?: any) {
    return this.addStoreDependency(storeConstructor, GLOBAL_DEP, initStoreOptions);
  }

  removeStore(storeConstructor: DirectorrStoreClassConstructor<any>) {
    return this.removeStoreDependency(storeConstructor, GLOBAL_DEP);
  }

  addStoreDependency(
    StoreConstructor: DirectorrStoreClassConstructor<any>,
    depName: any,
    initOptions?: any
  ) {
    const store = this.initStore(StoreConstructor, initOptions);

    if (DEPENDENCY_FIELD_NAME in store) {
      store[DEPENDENCY_FIELD_NAME].push(depName);
    } else {
      defineProperty(store, DEPENDENCY_FIELD_NAME, createValueDescriptor([depName]));
    }

    return store;
  }

  removeStoreDependency(StoreConstructor: DirectorrStoreClassConstructor<any>, depName: any) {
    const store = this.getStore(StoreConstructor);

    if (store) {
      const dependency: any[] = store[DEPENDENCY_FIELD_NAME];

      const index = dependency.indexOf(depName);

      if (index !== -1) dependency.splice(index, 1);

      if (!dependency.includes(depName)) this.destroyStore(StoreConstructor);
    }
  }

  private initStore(StoreConstructor: DirectorrStoreClassConstructor, initOptions?: any) {
    const storeName = getStoreName(StoreConstructor);

    if (this.stores.has(storeName)) return this.stores.get(storeName);

    // add injected stores
    if (hasOwnProperty(StoreConstructor, INJECTED_STORES_FIELD_NAME)) {
      const InjectedStores = (StoreConstructor as any)[INJECTED_STORES_FIELD_NAME];

      try {
        for (let i = 0, l = InjectedStores.length, injectedFrom; i < l; ++i) {
          injectedFrom = this.initStore(InjectedStores[i])[INJECTED_FROM_FIELD_NAME];

          if (!injectedFrom.includes(StoreConstructor)) injectedFrom.push(StoreConstructor);
        }
      } catch (e) {
        if (e instanceof RangeError) {
          throw new Error(haveCycleInjectedStore(MODULE_NAME));
        }

        throw e;
      }
    }

    // add afterware
    if (StoreConstructor.afterware) this.addStoreAfterware(StoreConstructor.afterware);

    // create store
    const store = new (StoreConstructor as DirectorrStoreClassConstructor)(
      StoreConstructor.storeInitOptions
    );

    // attach to directorr
    defineProperty(store, STORES_FIELD_NAME, createValueDescriptor(this.stores));
    defineProperty(store, DISPATCH_ACTION_FIELD_NAME, createValueDescriptor(this.dispatch));

    // add store
    this.stores.set(storeName, store);

    // merge init state
    if (storeName in this.initStoreState)
      config.mergeStateToStore(this.initStoreState[storeName], store);

    // call init action
    if (hasOwnProperty(StoreConstructor, INJECTED_STORES_FIELD_NAME)) {
      this.waitStoresState((StoreConstructor as any)[INJECTED_STORES_FIELD_NAME]).then(() =>
        this.dispatchType(DIRECTORR_INIT_STORE_ACTION, { StoreConstructor, initOptions })
      );
    } else {
      this.dispatchType(DIRECTORR_INIT_STORE_ACTION, { StoreConstructor, initOptions });
    }

    return store;
  }

  private destroyStore(
    StoreConstructor: DirectorrStoreClassConstructor,
    FromStoreConstructor?: DirectorrStoreClass
  ) {
    const storeName = getStoreName(StoreConstructor);
    const store = this.stores.get(storeName);

    if (store) {
      // remove injected stores
      if (INJECTED_STORES_FIELD_NAME in StoreConstructor) {
        const InjectedStores = (StoreConstructor as any)[INJECTED_STORES_FIELD_NAME];

        try {
          for (let i = 0, l = InjectedStores.length; i < l; ++i) {
            this.destroyStore(InjectedStores[i], StoreConstructor);
          }
        } catch (e) {
          if (e instanceof RangeError) {
            throw new Error(haveCycleInjectedStore(MODULE_NAME));
          }

          throw e;
        }
      }

      // remove injected from stores
      if (FromStoreConstructor) {
        const injectedFrom: DirectorrStoreClass[] = store[INJECTED_FROM_FIELD_NAME];
        const index = injectedFrom.indexOf(FromStoreConstructor);

        if (index !== -1) injectedFrom.splice(index, 1);
      }

      // remove store
      if (!store[INJECTED_FROM_FIELD_NAME].length && !store[DEPENDENCY_FIELD_NAME].length) {
        // remove afterware
        if (StoreConstructor.afterware) this.removeStoreAfterware(StoreConstructor.afterware);

        this.dispatchType(DIRECTORR_DESTROY_STORE_ACTION, { StoreConstructor });

        delete this.initStoreState[storeName];
        this.stores.delete(storeName);
      }
    }
  }

  private subscribeHandlers: SubscribeHandler[] = [];

  subscribe(handler: SubscribeHandler): UnsubscribeHandler {
    this.subscribeHandlers.push(handler);

    return () => this.unsubscribe(handler);
  }

  unsubscribe(handler: SubscribeHandler) {
    const index = this.subscribeHandlers.indexOf(handler);
    if (index !== -1) this.subscribeHandlers.splice(index, 1);
  }

  waitAllStoresState(isStoreState: CheckStoreState = isStoreReady) {
    return new Promise<any>(res => {
      if (checkStoresState(this.stores, isStoreState)) return res();

      const unsub = this.subscribe(stores => {
        if (checkStoresState(stores, isStoreState)) {
          unsub();

          return res();
        }
      });
    });
  }

  waitStoresState(
    stores: DirectorrStoreClassConstructor<any>[],
    isStoreState: CheckStoreState = isStoreReady
  ) {
    const storeNames = stores.map(s => getStoreName(s));

    return new Promise<any>(res => {
      if (checkStoresState(this.stores, isStoreState, storeNames)) return res();

      const unsub = this.subscribe(stores => {
        if (checkStoresState(stores, isStoreState, storeNames)) {
          unsub();

          return res();
        }
      });
    });
  }

  findStoreState(isStoreState: CheckStoreState = isStoreError) {
    return new Promise<any>(res => {
      const store = findStoreStateInStores(this.stores, isStoreState);

      if (store) return res(store);

      const unsub = this.subscribe(stores => {
        const store = findStoreStateInStores(stores, isStoreState);

        if (store) {
          unsub();

          return res(store);
        }
      });
    });
  }

  middlewares: MiddlewareAdapter[] = [];

  private addSomeMiddlewares(
    middlewares: ReduxMiddleware[] | Middleware[],
    someMiddlewareAdapter: any
  ) {
    const { length: totalMiddlewares } = this.middlewares;

    for (let i = 0, l = middlewares.length, m: any; i < l; ++i) {
      m = middlewares[i];

      if (this.middlewares.some(mid => mid.middleware === m)) continue;

      this.middlewares.push(
        new someMiddlewareAdapter(
          m,
          this.findNextMiddleware,
          totalMiddlewares + i,
          this,
          this.reduxStores
        )
      );
    }
  }

  addReduxMiddlewares(...middlewares: ReduxMiddleware[]) {
    this.addSomeMiddlewares(middlewares, ReduxMiddlewareAdapter);
  }

  addMiddlewares(...middlewares: Middleware[]) {
    this.addSomeMiddlewares(middlewares, MiddlewareAdapter);
  }

  private findNextMiddleware: FindNextMiddleware = (nextIndex, action) => {
    const nextMiddleware = this.middlewares[nextIndex + 1];

    if (nextMiddleware) {
      nextMiddleware.run(action);
    } else {
      this.runEffects(action);
    }
  };

  private afterwares: Afterware[] = [];

  private addStoreAfterware(afterware: Afterware) {
    this.afterwares.push(afterware);
  }

  private removeStoreAfterware(afterware: Afterware) {
    const index = this.afterwares.indexOf(afterware);
    if (index !== -1) this.afterwares.splice(index, 1);
  }

  dispatch: DispatchAction = config.batchFunction(action => {
    if (!isLikeAction(action)) throw new Error(callWithNotAction(MODULE_NAME, action));

    this.findNextMiddleware(-1, action);

    return action;
  });

  dispatchType = (type: string, payload?: any) => this.dispatch(config.createAction(type, payload));

  reduxStores: Store = {
    getState: () => this.stores,
    dispatch: this.dispatch,
    subscribe() {
      return emptyFunc;
    },
    replaceReducer: emptyFunc,
    [Symbol.observable]: () => ({
      subscribe() {
        return { unsubscribe: emptyFunc };
      },
      [Symbol.observable]() {
        return this;
      },
    }),
  };

  private runEffects(action: Action) {
    // console.log('runEffects', action);
    for (const store of this.stores.values()) {
      store[DISPATCH_EFFECTS_FIELD_NAME](action);
      // console.log('run store', store[DISPATCH_EFFECTS_FIELD_NAME].mock.calls);
    }

    for (const afterware of this.afterwares) {
      afterware(action, this.dispatchType);
    }

    for (const handler of this.subscribeHandlers.concat()) {
      handler(this.stores);
    }
  }
}

export default Directorr;