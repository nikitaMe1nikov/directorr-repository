import { createContext } from 'react';
import useLocalStore from './useLocalStore';
import createUseStoreHooks from './createUseStoreHooks';

export default function createHooks(DirectorrContext = createContext<any>(null)) {
  return {
    DirectorrContext,
    DirectorrProvider: DirectorrContext.Provider,
    useLocalStore,
    useStore: createUseStoreHooks(DirectorrContext),
  };
}
