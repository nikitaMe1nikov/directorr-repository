import { renderHook } from '@testing-library/react-hooks';
import { createContext } from 'react';
import createUseStoreHooks, {
  BUILDER_MODULE_NAME,
  HOOK_MODULE_NAME,
  USE_HOOKS,
} from '../createUseStoreHooks';
import {
  whenNotReactContext,
  whenNotStoreConstructor,
  whenContextNotLikeDirrector,
} from '../messages';
import { DirectorrMock } from '@nimel/directorr';

describe('createUseStoreHooks', () => {
  it('throw when call with not like context', () => {
    const context: any = 1;

    expect(() => createUseStoreHooks(context)).toThrowError(
      whenNotReactContext(BUILDER_MODULE_NAME, context)
    );
  });

  it('useStore throw when call with not constructor', () => {
    const SomeStore: any = 1;
    const context = createContext(new DirectorrMock());
    const useStore = createUseStoreHooks(context);

    expect(() => renderHook(() => useStore(SomeStore)).result.current).toThrowError(
      whenNotStoreConstructor(HOOK_MODULE_NAME, SomeStore)
    );
  });

  it('throw when call with context not like Directorr', () => {
    class SomeStore {}
    const FakeDirectorr = {};
    const context = createContext(FakeDirectorr);
    const useStore = createUseStoreHooks(context);

    expect(() => renderHook(() => useStore(SomeStore)).result.current).toThrowError(
      whenContextNotLikeDirrector(HOOK_MODULE_NAME, FakeDirectorr)
    );
  });

  it('useStore return store', () => {
    class SomeStore {}
    const storeInstance = new SomeStore();
    const directorr = new DirectorrMock();
    const context = createContext(directorr);
    const useStore = createUseStoreHooks(context);
    const initOptions = {};

    const {
      result: { current: store },
      unmount,
    } = renderHook(() => useStore(SomeStore, initOptions));

    unmount();

    expect(store).toEqual(storeInstance);
    expect(store).toBeInstanceOf(SomeStore);

    expect(directorr.addStoreDependency).toBeCalledTimes(1);
    expect(directorr.addStoreDependency).lastCalledWith(SomeStore, USE_HOOKS, initOptions);
    expect(directorr.removeStoreDependency).toBeCalledTimes(1);
    expect(directorr.removeStoreDependency).lastCalledWith(SomeStore, USE_HOOKS);
  });

  it('useStore return store when rerender', () => {
    class SomeStore {}
    const storeInstance = new SomeStore();
    const directorr = new DirectorrMock();
    const context = createContext(directorr);
    const useStore = createUseStoreHooks(context);
    const initOptions = {};

    const {
      result: { current: store },
      rerender,
    } = renderHook(() => useStore(SomeStore, initOptions));

    expect(store).toEqual(storeInstance);
    expect(store).toBeInstanceOf(SomeStore);

    rerender();

    expect(directorr.addStoreDependency).toBeCalledTimes(1);
    expect(directorr.addStoreDependency).lastCalledWith(SomeStore, USE_HOOKS, initOptions);
  });
});
