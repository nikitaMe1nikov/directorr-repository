import reloadAction from '../reloadAction';
import whenReload from '../whenReload';
import whenInit from '../whenInit';
import whenDestroy from '../whenDestroy';
import {
  DISPATCH_ACTION_FIELD_NAME,
  DIRECTORR_RELOAD_STORE_ACTION,
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
  createValueDescriptor,
} from '../utils';
import config from '../config';
import { someValue } from './mocks';

describe('baseActionDecorators', () => {
  it('reloadAction', () => {
    const action = jest.fn().mockImplementation(v => v);
    const dispatch = jest.fn();

    class SomeClass {
      @reloadAction
      action = action;
    }

    const obj = new SomeClass();

    Object.defineProperty(obj, DISPATCH_ACTION_FIELD_NAME, createValueDescriptor(dispatch));

    obj.action(someValue);

    expect(action).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenLastCalledWith(someValue);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith(
      config.createAction(DIRECTORR_RELOAD_STORE_ACTION, someValue)
    );
  });

  it('whenReload', () => {
    const effect = jest.fn();
    const action = config.createAction(DIRECTORR_RELOAD_STORE_ACTION, someValue);

    class SomeClass {
      @whenReload
      effect = effect;
    }

    const obj = new SomeClass();

    (obj as any)[DISPATCH_ACTION_FIELD_NAME](action);

    expect(effect).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenLastCalledWith(someValue);
  });

  it('whenInit', () => {
    const effect = jest.fn();

    class SomeClass {
      @whenInit
      effect = effect;
    }

    const action = config.createAction(DIRECTORR_INIT_STORE_ACTION, {
      StoreConstructor: SomeClass,
      initOptions: someValue,
    });

    const obj = new SomeClass();

    (obj as any)[DISPATCH_ACTION_FIELD_NAME](action);

    expect(effect).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenLastCalledWith(someValue);
  });

  it('whenDestroy', () => {
    const effect = jest.fn();

    class SomeClass {
      @whenDestroy
      effect = effect;
    }

    const action = config.createAction(DIRECTORR_DESTROY_STORE_ACTION, {
      StoreConstructor: SomeClass,
    });

    const obj = new SomeClass();

    (obj as any)[DISPATCH_ACTION_FIELD_NAME](action);

    expect(effect).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenLastCalledWith(action.payload);
  });
});