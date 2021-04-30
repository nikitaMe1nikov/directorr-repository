import { Middleware as ReduxMiddleware, Store } from 'redux';
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
  dispatchEffectsInModel,
  MSTDestroy,
  isMSTModelNode,
  applyMSTSnapshot,
  isMSTModelType,
  onMSTAction,
} from './utils';
import config from './config';
import { callWithNotAction, haveCycleInjectedStore, notObserver } from './messages';
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
  Afterware,
  DirectorrStoreClassConstructor,
  DepencyName,
  DirectorrOptions,
  SomeObject,
  AnyMSTModelType,
  MSTInstance,
  MTSStateTreeNode,
  DirectorrStore,
} from './types';
import { ReduxMiddlewareAdapter, MiddlewareAdapter } from './MiddlewareAdapters';

export const MODULE_NAME = 'Directorr';
export const GLOBAL_DEP = { global: true };
export const OMIT_ACTIONS = ['@APPLY_SNAPSHOT'];

export class Directorr implements DirectorrInterface {
  constructor({
    initState = EMPTY_OBJECT,
    context = EMPTY_OBJECT,
  }: DirectorrOptions = EMPTY_OBJECT) {
    this.initState = initState;
    this.context = context;
  }

  private initState: DirectorrStoresState;
  private context: SomeObject;
  stores: DirectorrStores = new Map();

  getStore<C>(StoreConstructor: DirectorrStoreClassConstructor<C>): C | undefined;
  getStore<C extends AnyMSTModelType>(modelType: C): MSTInstance<C> | undefined;
  getStore(modelOrConstructor: any): any {
    return this.stores.get(getStoreName(modelOrConstructor));
  }

  getHydrateStoresState(): DirectorrStoresState {
    return config.hydrateStoresToState(this.stores);
  }

  setStateToStore = config.batchFunction((storeState: DirectorrStoresState) => {
    for (const [storeName, store] of this.stores.entries()) {
      if (hasOwnProperty(storeState, storeName)) {
        if (isMSTModelNode(store)) {
          applyMSTSnapshot(store, storeState[storeName]);
        } else {
          config.setStateToStore(storeState[storeName], store);
        }
      }
    }
  });

  mergeStateToStore = config.batchFunction((storeState: DirectorrStoresState) => {
    for (const [storeName, store] of this.stores.entries()) {
      if (hasOwnProperty(storeState, storeName)) {
        if (isMSTModelNode(store)) {
          applyMSTSnapshot(store, storeState[storeName]);
        } else {
          config.mergeStateToStore(storeState[storeName], store);
        }
      }
    }
  });

  addStores(models: AnyMSTModelType[]): void;
  addStores(storeConstructors: DirectorrStoreClassConstructor<any>[]): void;
  addStores(modelOrConstructor: any[]) {
    modelOrConstructor.forEach(sm => this.addStore(sm));
  }

  addStore<I>(storeConstructor: DirectorrStoreClassConstructor<I>): I;
  addStore<I extends AnyMSTModelType>(modelType: I): I;
  addStore(modelOrConstructor: any): any {
    return this.addStoreDependency(modelOrConstructor, GLOBAL_DEP);
  }

  removeStore(storeConstructor: DirectorrStoreClassConstructor<any>): void;
  removeStore(modelType: AnyMSTModelType): void;
  removeStore(modelOrConstructor: any) {
    return this.removeStoreDependency(modelOrConstructor, GLOBAL_DEP);
  }

  addStoreDependency<I>(
    StoreConstructor: DirectorrStoreClassConstructor<I>,
    depName: DepencyName
  ): I;
  addStoreDependency<I extends AnyMSTModelType>(modelType: I, depName: DepencyName): I;
  addStoreDependency(modelOrConstructor: any, depName: DepencyName): any {
    const store = isMSTModelType(modelOrConstructor)
      ? this.initModel(modelOrConstructor)
      : this.initStore(modelOrConstructor);

    store[DEPENDENCY_FIELD_NAME].push(depName);

    return store;
  }

  removeStoreDependency(
    StoreConstructor: DirectorrStoreClassConstructor<any>,
    depName: DepencyName
  ): void;
  removeStoreDependency(modelType: AnyMSTModelType, depName: DepencyName): void;
  removeStoreDependency(modelOrConstructor: any, depName: DepencyName) {
    const store = this.getStore(modelOrConstructor);

    if (store) {
      const dependency: any[] = store[DEPENDENCY_FIELD_NAME];

      const index = dependency.indexOf(depName);

      if (index !== -1) dependency.splice(index, 1);

      if (!dependency.length)
        isMSTModelType(modelOrConstructor)
          ? this.destroyModel(modelOrConstructor)
          : this.destroyStore(modelOrConstructor);
    }
  }

  private initStore<I = any>(StoreConstructor: DirectorrStoreClassConstructor<I>): I {
    const storeName = getStoreName(StoreConstructor);

    if (this.stores.has(storeName)) return this.stores.get(storeName);

    // add injected stores
    if (hasOwnProperty(StoreConstructor, INJECTED_STORES_FIELD_NAME)) {
      const injectedModelsOrConstructors: any[] = (StoreConstructor as any)[
        INJECTED_STORES_FIELD_NAME
      ];

      try {
        for (const modelOrConstructor of injectedModelsOrConstructors) {
          const store = isMSTModelType(modelOrConstructor)
            ? this.initModel(modelOrConstructor)
            : this.initStore(modelOrConstructor);
          store[INJECTED_FROM_FIELD_NAME].push(StoreConstructor);
        }
      } catch (e) {
        if (e instanceof RangeError) {
          throw new Error(haveCycleInjectedStore(MODULE_NAME));
        }

        throw e;
      }
    }

    // add afterware
    if (StoreConstructor.afterware) this.addAfterware(StoreConstructor.afterware);

    // create store
    const store: any = new StoreConstructor(StoreConstructor.storeInitOptions);

    if (!hasOwnProperty(store, INJECTED_FROM_FIELD_NAME)) {
      defineProperty(store, INJECTED_FROM_FIELD_NAME, createValueDescriptor([]));
      defineProperty(store, DEPENDENCY_FIELD_NAME, createValueDescriptor([]));
    }

    // attach to directorr
    defineProperty(store, STORES_FIELD_NAME, createValueDescriptor(this.stores));
    defineProperty(store, DISPATCH_ACTION_FIELD_NAME, createValueDescriptor(this.dispatch));
    defineProperty(store, SUBSCRIBE_FIELD_NAME, createValueDescriptor(this.subscribe));

    if (!hasOwnProperty(store, DISPATCH_EFFECTS_FIELD_NAME))
      defineProperty(store, DISPATCH_EFFECTS_FIELD_NAME, createValueDescriptor(EMPTY_FUNC));

    // add store
    this.stores.set(storeName, store);

    // merge init state
    if (hasOwnProperty(this.initState, storeName)) {
      config.mergeStateToStore(this.initState[storeName], store);
      // remove outdated data
      delete this.initState[storeName];
    }

    // call init action
    if (hasOwnProperty(StoreConstructor, INJECTED_STORES_FIELD_NAME)) {
      const injectedModelsOrConstructors: DirectorrStore[] = (StoreConstructor as any)[
        INJECTED_STORES_FIELD_NAME
      ];
      const storeNames = injectedModelsOrConstructors.map(s => getStoreName(s));

      if (checkStoresState(this.stores, isStoreReady, storeNames)) {
        this.dispatchType(DIRECTORR_INIT_STORE_ACTION, { store });
      } else {
        this.waitStoresState(injectedModelsOrConstructors).then(() => {
          this.dispatchType(DIRECTORR_INIT_STORE_ACTION, { store });
        });
      }
    } else {
      this.dispatchType(DIRECTORR_INIT_STORE_ACTION, { store });
    }

    return store;
  }

  private destroyStore(
    StoreConstructor: DirectorrStoreClassConstructor,
    FromStoreConstructor?: DirectorrStoreClassConstructor
  ) {
    const storeName = getStoreName(StoreConstructor);
    const store = this.stores.get(storeName);

    if (store) {
      // remove injected stores
      if (hasOwnProperty(StoreConstructor, INJECTED_STORES_FIELD_NAME)) {
        const injectedModelsOrConstructors: any[] = (StoreConstructor as any)[
          INJECTED_STORES_FIELD_NAME
        ];

        try {
          for (const modelOrConstructor of injectedModelsOrConstructors) {
            isMSTModelType(modelOrConstructor)
              ? this.destroyModel(modelOrConstructor, StoreConstructor)
              : this.destroyStore(modelOrConstructor, StoreConstructor);
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
        const injectedFrom: any[] = store[INJECTED_FROM_FIELD_NAME];
        const index = injectedFrom.indexOf(FromStoreConstructor);

        injectedFrom.splice(index, 1);
      }

      // when dont have dependencies
      if (!store[INJECTED_FROM_FIELD_NAME].length) {
        // remove afterware
        if (StoreConstructor.afterware) this.removeAfterware(StoreConstructor.afterware);

        this.dispatchType(DIRECTORR_DESTROY_STORE_ACTION, { store });
        defineProperty(store, DISPATCH_ACTION_FIELD_NAME, createValueDescriptor(EMPTY_FUNC));

        // remove store
        this.stores.delete(storeName);
      }
    }
  }

  private initModel<I extends AnyMSTModelType>(modelType: I): MTSStateTreeNode {
    const modelName = getStoreName(modelType);

    if (this.stores.has(modelName)) return this.stores.get(modelName);

    const initState = this.initState[modelName];

    // create store
    const store = modelType.create(initState, this.context);

    delete this.initState[modelName];

    // listen actions
    onMSTAction(store, call => {
      if (!OMIT_ACTIONS.includes(call.name)) this.dispatchType(`${modelName}.${call.name}`, call);
    });

    defineProperty(store, INJECTED_FROM_FIELD_NAME, createValueDescriptor([]));
    defineProperty(store, DEPENDENCY_FIELD_NAME, createValueDescriptor([]));
    defineProperty(
      store,
      DISPATCH_EFFECTS_FIELD_NAME,
      createValueDescriptor((action: Action) =>
        dispatchEffectsInModel(store, modelName, config.actionTypeDivider, action)
      )
    );
    defineProperty(store, DISPATCH_ACTION_FIELD_NAME, createValueDescriptor(this.dispatch));

    this.dispatchType(DIRECTORR_INIT_STORE_ACTION, { store });

    // add store
    this.stores.set(modelName, store);

    return store;
  }

  private destroyModel(
    modelType: AnyMSTModelType,
    FromStoreConstructor?: DirectorrStoreClassConstructor
  ) {
    const modelName = getStoreName(modelType);
    const store = this.stores.get(modelName);

    if (store) {
      // remove injected from stores
      if (FromStoreConstructor) {
        const injectedFrom: any[] = store[INJECTED_FROM_FIELD_NAME];
        const index = injectedFrom.indexOf(FromStoreConstructor);

        injectedFrom.splice(index, 1);
      }

      // when dont have dependencies
      if (!store[INJECTED_FROM_FIELD_NAME].length) {
        this.dispatchType(DIRECTORR_DESTROY_STORE_ACTION, { store });

        // remove store
        this.stores.delete(modelName);

        // destroy node
        MSTDestroy(store);
      }
    }
  }

  private subscribeHandlers: SubscribeHandler[] = [];

  subscribe = (handler: SubscribeHandler): UnsubscribeHandler => {
    this.subscribeHandlers.push(handler);

    return () => this.unsubscribe(handler);
  };

  unsubscribe = (handler: SubscribeHandler) => {
    const index = this.subscribeHandlers.indexOf(handler);
    if (index !== -1) this.subscribeHandlers.splice(index, 1);
  };

  waitAllStoresState(isStoreState: CheckStoreState = isStoreReady) {
    return createPromiseCancelable<any>((res, rej, whenCancel) => {
      if (checkStoresState(this.stores, isStoreState)) return res();

      const unsub = this.subscribe(stores => {
        if (checkStoresState(stores, isStoreState)) {
          unsub();

          return res();
        }
      });

      whenCancel(unsub);
    });
  }

  waitStoresState(stores: DirectorrStore[], isStoreState: CheckStoreState = isStoreReady) {
    const storeNames = stores.map(s => getStoreName(s));

    return createPromiseCancelable<any>((res, rej, whenCancel) => {
      if (checkStoresState(this.stores, isStoreState, storeNames)) return res();

      const unsub = this.subscribe(stores => {
        if (checkStoresState(stores, isStoreState, storeNames)) {
          unsub();

          return res();
        }
      });

      whenCancel(unsub);
    });
  }

  findStoreState(isStoreState: CheckStoreState = isStoreError) {
    return createPromiseCancelable<any>((res, rej, whenCancel) => {
      const store = findStoreStateInStores(this.stores, isStoreState);

      if (store) return res(store);

      const unsub = this.subscribe(stores => {
        const store = findStoreStateInStores(stores, isStoreState);

        if (store) {
          unsub();

          return res(store);
        }
      });

      whenCancel(unsub);
    });
  }

  private middlewares: MiddlewareAdapter[] = [];

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
          this.reduxStore
        )
      );
    }
  }

  addReduxMiddlewares(middlewares: ReduxMiddleware[]) {
    this.addSomeMiddlewares(middlewares, ReduxMiddlewareAdapter);
  }

  addMiddlewares(middlewares: Middleware[]) {
    this.addSomeMiddlewares(middlewares, MiddlewareAdapter);
  }

  removeMiddleware(middleware: Middleware) {
    const idx = this.middlewares.findIndex(m => m.middleware === middleware);

    this.middlewares.slice(idx, 1);
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

  private addAfterware(afterware: Afterware) {
    this.afterwares.push(afterware);
  }

  private removeAfterware(afterware: Afterware) {
    const index = this.afterwares.indexOf(afterware);

    this.afterwares.splice(index, 1);
  }

  dispatch: DispatchAction = config.batchFunction(action => {
    if (!isLikeAction(action)) throw new Error(callWithNotAction(MODULE_NAME, action));

    this.findNextMiddleware(-1, action);

    return action;
  });

  dispatchType = (type: string, payload?: any) => this.dispatch(config.createAction(type, payload));

  reduxStore: Store = {
    getState: () => this.getHydrateStoresState(),
    dispatch: this.dispatch,
    subscribe: this.subscribe,
    replaceReducer: EMPTY_FUNC,
    [Symbol.observable]: () => {
      const { subscribe } = this;

      return {
        subscribe(observer: any) {
          if (observer === null || !isObject(observer)) {
            throw new TypeError(notObserver());
          }

          return {
            unsubscribe: observer.next ? subscribe(stores => observer.next(stores)) : EMPTY_FUNC,
          };
        },
        [Symbol.observable]() {
          return this;
        },
      };
    },
  };

  private runEffects(action: Action) {
    for (const store of this.stores.values()) {
      store[DISPATCH_EFFECTS_FIELD_NAME](action);
    }

    for (const afterware of this.afterwares) {
      afterware(action, this.dispatchType, this);
    }

    for (const handler of this.subscribeHandlers.concat()) {
      handler(this.stores, action);
    }
  }
}

export default Directorr;
