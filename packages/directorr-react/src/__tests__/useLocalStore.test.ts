import { renderHook } from '@testing-library/react-hooks';
import useLocalStore, { HOOK_MODULE_NAME } from '../useLocalStore';
import { whenNotStoreConstructor } from '../messages';

describe('useLocalStore', () => {
  it('should useLocalStore throw when call with not constructor', () => {
    const SomeStore: any = 1;

    expect(() => renderHook(() => useLocalStore(SomeStore)).result.current).toThrowError(
      whenNotStoreConstructor(HOOK_MODULE_NAME, SomeStore)
    );
  });

  it('should useLocalStore return store', async () => {
    class SomeStore {}

    const {
      result: { current: store },
    } = renderHook(() => useLocalStore(SomeStore));

    expect(store).toBeInstanceOf(SomeStore);
  });

  it('should useLocalStore return store when rerender', async () => {
    class SomeStore {}

    const {
      result: { current: store },
      rerender,
    } = renderHook(() => useLocalStore(SomeStore));

    expect(store).toBeInstanceOf(SomeStore);

    rerender();

    expect(store).toBeInstanceOf(SomeStore);
  });
});
