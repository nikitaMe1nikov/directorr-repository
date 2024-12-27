import { renderHook } from '@testing-library/react-hooks'
import { createContext } from 'react'
import {
  createUseStoreHook,
  BUILDER_MODULE_NAME,
  HOOK_MODULE_NAME,
  DEP_NAME,
} from '../createUseStoreHook'
import {
  whenNotReactContext,
  whenNotStoreConstructor,
  whenContextNotLikeDirrector,
} from '../messages'
import { DirectorrMock, Directorr } from '@nimel/directorr'

describe('createUseStoreHooks', () => {
  it('throw when call with not like context', () => {
    const context: any = 1

    expect(() => createUseStoreHook(context)).toThrowError(
      whenNotReactContext(BUILDER_MODULE_NAME, context),
    )
  })

  it('useStore throw when call with not constructor', () => {
    const SomeStore: any = 1
    const context = createContext<Directorr | undefined>(new DirectorrMock() as any)
    const useStore = createUseStoreHook(context)

    expect(() => renderHook(() => useStore(SomeStore as any)).result.current).toThrowError(
      whenNotStoreConstructor(HOOK_MODULE_NAME, SomeStore),
    )
  })

  it('throw when call with context not like Directorr', () => {
    class SomeStore {}
    const FakeDirectorr = {}
    const context = createContext<Directorr | undefined>(FakeDirectorr as any)
    const useStore = createUseStoreHook(context)

    expect(() => renderHook(() => useStore(SomeStore)).result.current).toThrowError(
      whenContextNotLikeDirrector(HOOK_MODULE_NAME, FakeDirectorr),
    )
  })

  it('useStore return store', () => {
    class SomeStore {}
    const directorr = new DirectorrMock()
    const context = createContext<Directorr>(directorr as any)
    const useStore = createUseStoreHook(context as any)

    const {
      result: { current: store },
      unmount,
    } = renderHook(() => useStore(SomeStore))

    unmount()

    expect(store).toBe(directorr.getStore(SomeStore))
    expect(store).toBeInstanceOf(SomeStore)

    expect(directorr.addStoreDependency).toBeCalledTimes(1)
    expect(directorr.addStoreDependency).lastCalledWith(SomeStore, DEP_NAME)
    expect(directorr.removeStoreDependency).toBeCalledTimes(1)
    expect(directorr.removeStoreDependency).lastCalledWith(SomeStore, DEP_NAME)
  })

  it('useStore return store when rerender', () => {
    class SomeStore {}
    const directorr = new DirectorrMock()
    const context = createContext<Directorr | undefined>(directorr as any)
    const useStore = createUseStoreHook(context)

    const {
      result: { current: store },
      rerender,
    } = renderHook(() => useStore(SomeStore))

    expect(store).toBe(directorr.getStore(SomeStore))
    expect(store).toBeInstanceOf(SomeStore)

    rerender()

    expect(directorr.addStoreDependency).toBeCalledTimes(1)
    expect(directorr.addStoreDependency).lastCalledWith(SomeStore, DEP_NAME)
  })
})
