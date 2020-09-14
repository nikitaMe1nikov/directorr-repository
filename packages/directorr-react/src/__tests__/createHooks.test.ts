import { createContext } from 'react';
import createHooks from '../createHooks';
import useLocalStoreImport from '../useLocalStore';

jest.mock('../createUseStoreHooks', () => {
  const createUseStoreHooks = jest.fn().mockImplementation(() => createUseStoreHooks);

  return createUseStoreHooks;
});

describe('createHooks', () => {
  it('createHooks', () => {
    const context = createContext(null);
    const { DirectorrContext, DirectorrProvider, useLocalStore, useStore } = createHooks(context);

    expect(DirectorrContext).toEqual(context);
    expect(DirectorrProvider).toEqual(context.Provider);
    expect(useLocalStore).toEqual(useLocalStoreImport);
    expect(useStore).toHaveBeenCalledTimes(1);
    expect(useStore).toHaveBeenLastCalledWith(context);
  });
});
