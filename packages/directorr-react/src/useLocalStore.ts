import { useRef } from 'react'
import { whenNotStoreConstructor } from './messages'
import { isFunction } from './utils'
import { UseStoreHook } from './types'

export const HOOK_MODULE_NAME = 'useLocalStore'

export const useLocalStore: UseStoreHook = (StoreConstructor: any) => {
  if (!isFunction(StoreConstructor))
    throw new Error(whenNotStoreConstructor(HOOK_MODULE_NAME, StoreConstructor))

  const store = useRef<any>()

  if (!store.current) store.current = new StoreConstructor(StoreConstructor.storeInitOptions)

  return store.current
}
