import { observable } from 'mobx';
import { whenInit, Action, DirectorrInterface, isStoreError } from '@nimel/directorr';
import {
  initStoreAction,
  initStoreErrorAction,
  initStoreSuccessAction,
  isReadyEffect,
} from './decorators';
import { InitOptions } from './types';

export default class AppInitStore {
  static afterware = (
    { type, payload }: Action,
    dispatchType: DirectorrInterface['dispatchType'],
    directorr: DirectorrInterface
  ) => {
    if (type === initStoreAction.type) {
      const { stores } = payload;

      directorr.addStores(...stores);
      const waitStores = directorr.waitStoresState(stores);
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

  @observable isInitComplated = false;

  @whenInit
  @initStoreAction
  init = (stores: InitOptions) => ({ stores });

  @isReadyEffect
  toSuccess = () => {
    this.isInitComplated = true;
  };
}
