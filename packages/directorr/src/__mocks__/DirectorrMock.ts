import { getStoreName } from '../utils';
import { DirectorrInterface } from '../types';

export default class DirectorrMock implements DirectorrInterface {
  stores = new Map();
  addStores = jest.fn().mockImplementation((...Stores: any[]) => {
    Stores.forEach(Store => {
      const store = new Store();
      this.stores.set(getStoreName(Store), store);

      return store;
    });
  });
  addStore = jest.fn().mockImplementation(Store => {
    const store = new Store();
    this.stores.set(getStoreName(Store), store);

    return store;
  });
  addStoreDependency = jest.fn().mockImplementation(Store => {
    const store = new Store();
    this.stores.set(getStoreName(Store), store);

    return store;
  });
  // tempStore: any;
  removeStoreDependency = jest.fn();
  getHydrateStoresState = jest.fn();
  getStore = jest.fn().mockImplementation(Store => this.stores.get(getStoreName(Store)));
  waitAllStoresState = jest.fn().mockImplementationOnce(() => Promise.resolve());
  waitStoresState = jest.fn().mockImplementationOnce(s => Promise.resolve(s));
  findStoreState = jest.fn().mockImplementationOnce(() => Promise.resolve());
  dispatch = jest.fn();
  dispatchType = jest.fn();
  addInitState = jest.fn();
  removeStore = jest.fn();
  addReduxMiddlewares = jest.fn();
  addMiddlewares = jest.fn();
  mergeStateToStore = jest.fn();

  // constructor(storeInstance?: any) {
  //   this.tempStore = storeInstance;
  // }
}
