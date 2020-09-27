import { createContext } from 'react';
import { Directorr } from '@nimel/directorr';
import createConnector from './createConnector';
import createUseStoreHooks from './createUseStoreHooks';
import useLocalStore from './useLocalStore';

const DirectorrContext = createContext<Directorr>((null as unknown) as Directorr);
const DirectorrProvider = DirectorrContext.Provider;
const useStore = createUseStoreHooks(DirectorrContext);
const connector = createConnector(useStore);

export {
  createConnector,
  createUseStoreHooks,
  DirectorrContext,
  DirectorrProvider,
  useStore,
  useLocalStore,
  connector,
};
