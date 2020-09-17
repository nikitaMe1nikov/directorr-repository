import {
  createConnector,
  createUseStoreHooks,
  createUseTempStoreHooks,
  createHooks,
  DirectorrContext,
  DirectorrProvider,
  useStore,
  useLocalStore,
} from '../index';

describe('index', () => {
  it('check exports', () => {
    expect(createConnector).not.toBeUndefined();
    expect(createUseStoreHooks).not.toBeUndefined();
    expect(createUseTempStoreHooks).not.toBeUndefined();
    expect(createHooks).not.toBeUndefined();
    expect(DirectorrContext).not.toBeUndefined();
    expect(DirectorrProvider).not.toBeUndefined();
    expect(useStore).not.toBeUndefined();
    expect(useLocalStore).not.toBeUndefined();
  });
});
