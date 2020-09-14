import { useRef } from 'react';
import { DirectorrStoreClassConstructor } from '@nimel/directorr';
import { whenNotStoreConstructor } from './messages';
import { isFunction } from './utils';

export const HOOK_MODULE_NAME = 'useLocalStore';

export default function useLocalStore<C>(StoreConstructor: DirectorrStoreClassConstructor<C>): C {
  if (!isFunction(StoreConstructor))
    throw new Error(whenNotStoreConstructor(HOOK_MODULE_NAME, StoreConstructor));

  const store = useRef<C | null>(null);

  if (!store.current) store.current = new StoreConstructor();

  return store.current;
}
