import { useContext, useEffect, Context, useRef } from 'react'
import { Directorr } from '@nimel/directorr'
import {
  whenNotStoreConstructor,
  whenContextNotLikeDirrector,
  whenNotReactContext,
} from './messages'
import { isFunction, isDirrectorInstance, isContext } from './utils'
import { UseStoreHook } from './types'

export const HOOK_MODULE_NAME = 'useStore'
export const BUILDER_MODULE_NAME = 'createUseStoreHooks'
export const DEP_NAME = { useStore: true }

export function useStoreRunner(context: Context<Directorr>, StoreConstructor: any): any {
  if (!isFunction(StoreConstructor))
    throw new Error(whenNotStoreConstructor(HOOK_MODULE_NAME, StoreConstructor))

  const store = useRef<any>()
  const dir: Directorr = useContext(context)

  if (!isDirrectorInstance(dir)) throw new Error(whenContextNotLikeDirrector(HOOK_MODULE_NAME, dir))

  if (!store.current) {
    store.current = dir.addStoreDependency(StoreConstructor, DEP_NAME)
  }

  useEffect(
    () => () => {
      store.current = null
      dir.removeStoreDependency(StoreConstructor, DEP_NAME)
    },
    [dir, StoreConstructor],
  )

  return store.current
}

export default function createUseStoreHook(storeContext: Context<Directorr>) {
  if (!isContext(storeContext))
    throw new Error(whenNotReactContext(BUILDER_MODULE_NAME, storeContext))

  return ((StoreConstructor: any) => useStoreRunner(storeContext, StoreConstructor)) as UseStoreHook
}
