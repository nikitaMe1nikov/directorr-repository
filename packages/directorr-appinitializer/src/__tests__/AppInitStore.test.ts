import {
  createAction,
  DISPATCH_ACTION_FIELD_NAME,
  dispatchInitEffectInStore,
  dispatchEffectInStore,
  Directorr,
  action,
  effect,
} from '@nimel/directorr';
import {
  initStoreAction,
  isReadyAction,
  initStoreSuccessEffect,
  initStoreErrorEffect,
} from '../decorators';
import AppInitStore from '../AppInitStore';
import { flushPromises } from '../../../../tests/utils';

const CHANGE_READY = 'CHANGE_READY';
const CHANGE_ERROR = 'CHANGE_ERROR';

class StoreOne {
  isReady = false;

  @action(CHANGE_READY)
  changeReady = () => ({
    isReady: !this.isReady,
  });

  @effect(CHANGE_READY)
  toChangeReady = ({ isReady }) => {
    this.isReady = isReady;
  };

  @initStoreSuccessEffect
  toReadyAppinit = jest.fn();
}

class StoreError {
  isError = false;

  @action(CHANGE_ERROR)
  changeError = () => ({
    isError: !this.isError,
  });

  @effect(CHANGE_ERROR)
  toChangeReady = ({ isError }) => {
    this.isError = isError;
  };

  @initStoreErrorEffect
  toErrorAppinit = jest.fn();
}

describe('AppInitStore', () => {
  it('init', () => {
    const initOptions = {};
    const dispatchAction = jest.fn();
    const store: any = new AppInitStore();

    Object.defineProperty(store, DISPATCH_ACTION_FIELD_NAME, { value: dispatchAction });

    dispatchInitEffectInStore(store, initOptions);

    expect(dispatchAction).toBeCalledTimes(1);
    expect(dispatchAction).toBeCalledWith(
      createAction(initStoreAction.type, { stores: initOptions })
    );
  });

  it('change state isInitComplated', () => {
    const store: any = new AppInitStore();

    expect(store.isInitComplated).toBeFalsy();

    dispatchEffectInStore(store, isReadyAction.type);

    expect(store.isInitComplated).toBeTruthy();
  });

  it('with stores where change state to ready', async () => {
    const directorr = new Directorr();
    const stores = [StoreOne];

    directorr.addStore(AppInitStore, stores);

    const storeOne = directorr.getStore(StoreOne);
    storeOne.changeReady();

    await flushPromises();

    expect(storeOne.toReadyAppinit).toBeCalledTimes(1);
    expect(storeOne.toReadyAppinit).toBeCalledWith({ stores });
  });

  it('with stores where some have error state', async () => {
    const directorr = new Directorr();
    const stores = [StoreOne, StoreError];
    jest.spyOn(directorr, 'unsubscribe');

    const appStore = directorr.addStore(AppInitStore, stores);

    await flushPromises();

    expect(appStore.isInitComplated).toBeFalsy();

    const storeError = directorr.getStore(StoreError);
    storeError.changeError();

    await flushPromises();

    expect(storeError.toErrorAppinit).toBeCalledTimes(1);
    expect(storeError.toErrorAppinit).toBeCalledWith({ store: storeError, stores });
    expect(directorr.unsubscribe).toBeCalledTimes(2);
  });
});
