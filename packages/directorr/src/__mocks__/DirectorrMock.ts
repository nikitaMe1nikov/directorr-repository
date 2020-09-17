import { DirectorrInterface } from '../types';

export default class DirectorrMock
  implements
    Pick<
      DirectorrInterface,
      'addStoreDependency' | 'removeStoreDependency' | 'getStore' | 'getHydrateStoresState'
    > {
  stores = new Map();
  addStores = jest.fn().mockImplementation(([v]) => (this.tempStore = new v()));
  addStoreDependency = jest.fn().mockImplementation(v => (this.tempStore = new v()));
  tempStore: any;
  removeStoreDependency = jest.fn();
  getHydrateStoresState = jest.fn();
  getStore = jest.fn().mockImplementationOnce(() => this.tempStore);
  waitAllStoresState = jest.fn().mockImplementationOnce(() => Promise.resolve());
  waitStoresState = jest.fn().mockImplementationOnce(s => Promise.resolve(s));
  findStoreState = jest.fn().mockImplementationOnce(() => Promise.resolve());

  constructor(storeInstance?: any) {
    this.tempStore = storeInstance;
  }
}
