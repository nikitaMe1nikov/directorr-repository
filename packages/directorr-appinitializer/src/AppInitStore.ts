import { observable, makeObservable } from 'mobx';
import { Action, DirectorrInterface, isStoreReady, isStoreError } from '@nimel/directorr';
import {
  initStoreAction,
  initStoreErrorAction,
  initStoreSuccessAction,
  isReadyEffect,
} from './decorators';
import { InitOptions } from './types';

export class AppInitStore {
  static afterware = (
    { type, payload }: Action,
    dispatchType: DirectorrInterface['dispatchType'],
    directorr: DirectorrInterface
  ) => {
    if (type === initStoreAction.type) {
      const { stores } = payload;

      directorr.addStores(stores);

      const waitStores = directorr.waitStoresState(stores, isStoreReady);
      const waitStoreWithError = directorr.findStoreState(isStoreError);

      Promise.race([waitStores, waitStoreWithError]).then(store => {
        if (store) {
          waitStores.cancel();
          dispatchType(initStoreErrorAction.type, { store, stores });
        } else {
          waitStoreWithError.cancel();
          dispatchType(initStoreSuccessAction.type, { stores });
        }
      });
    }
  };

  constructor() {
    makeObservable(this);
  }

  @observable isInitComplated = false;

  @initStoreAction
  loadStores = (stores: InitOptions) => ({ stores });

  @isReadyEffect
  toSuccess = () => {
    this.isInitComplated = true;
  };
}

export default AppInitStore;
