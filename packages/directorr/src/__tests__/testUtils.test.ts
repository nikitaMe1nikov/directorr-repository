import {
  dispatchEffectInStore,
  dispatchInitEffectInStore,
  dispatchDestroyEffectInStore,
  dispatchOptionsEffectInStore,
  dispatchReloadEffectInStore,
} from '../testUtils';
import {
  DISPATCH_EFFECTS_FIELD_NAME,
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
  DIRECTORR_RELOAD_STORE_ACTION,
  DIRECTORR_OPTIONS_STORE_ACTION,
} from '../utils';
import { someValue, actionType } from '../__mocks__/mocks';

class SomeStore {
  [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn();
}

describe('testUtils', () => {
  it('dispatchEffectInStore', () => {
    const store = new SomeStore();

    dispatchEffectInStore({}, actionType, someValue);

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).not.toBeCalled();

    dispatchEffectInStore(store, actionType, someValue);

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledWith({
      type: actionType,
      payload: someValue,
    });
  });

  it('dispatchInitEffectInStore', () => {
    const store = new SomeStore();

    dispatchInitEffectInStore(store);

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledWith({
      type: DIRECTORR_INIT_STORE_ACTION,
      payload: {
        StoreConstructor: SomeStore,
      },
    });
  });

  it('dispatchOptionsEffectInStore', () => {
    const store = new SomeStore();

    dispatchOptionsEffectInStore(store, someValue);

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledWith({
      type: DIRECTORR_OPTIONS_STORE_ACTION,
      payload: {
        StoreConstructor: SomeStore,
        initOptions: someValue,
      },
    });
  });

  it('dispatchDestroyEffectInStore', () => {
    const store = new SomeStore();

    dispatchDestroyEffectInStore(store, someValue);

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledWith({
      type: DIRECTORR_DESTROY_STORE_ACTION,
      payload: {
        StoreConstructor: SomeStore,
        ...someValue,
      },
    });
  });

  it('dispatchReloadEffectInStore', () => {
    const store = new SomeStore();

    dispatchReloadEffectInStore(store, someValue);

    expect(store[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledWith({
      type: DIRECTORR_RELOAD_STORE_ACTION,
      payload: someValue,
    });
  });
});
