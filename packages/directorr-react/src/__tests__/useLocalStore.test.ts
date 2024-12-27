import { renderHook } from '@testing-library/react-hooks'
import { HOOK_MODULE_NAME, useLocalStore } from '../useLocalStore'
import { whenNotStoreConstructor } from '../messages'

describe('useLocalStore', () => {
  it('should throw when call with not constructor', () => {
    const SomeStore: any = 1

    expect(() => renderHook(() => useLocalStore(SomeStore)).result.current).toThrowError(
      whenNotStoreConstructor(HOOK_MODULE_NAME, SomeStore),
    )
  })

  it('should return store', () => {
    class SomeStore {}

    const {
      result: { current: store },
    } = renderHook(() => useLocalStore(SomeStore))

    expect(store).toBeInstanceOf(SomeStore)
  })

  it('should return store when rerender', () => {
    class SomeStore {}

    const {
      result: { current: store },
      rerender,
    } = renderHook(() => useLocalStore(SomeStore))

    expect(store).toBeInstanceOf(SomeStore)

    rerender()

    expect(store).toBeInstanceOf(SomeStore)
  })
})
