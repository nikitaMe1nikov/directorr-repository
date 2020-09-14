import { useContext, useEffect, Context, useRef } from 'react';
import { Directorr, DirectorrStoreClass, DirectorrStoreClassConstructor } from '@nimel/directorr';
import { whenNotStoreConstructor, whenContextNotLikeDirrector } from './messages';
import { isFunction, isDirrectorInstance } from './utils';
import createBuilderHook from './createBuilderHook';

export const HOOK_MODULE_NAME = 'useStore';
export const BUILDER_MODULE_NAME = 'createUseStoreHooks';
export const USE_HOOKS = { hooks: true };

function useStore<C>(
  context: Context<any>,
  StoreConstructor: DirectorrStoreClass<C>,
  initOptions?: any
): C {
  if (!isFunction(StoreConstructor))
    throw new Error(whenNotStoreConstructor(HOOK_MODULE_NAME, StoreConstructor));

  const store = useRef<C>();
  const dir: Directorr = useContext(context);

  if (!isDirrectorInstance(dir))
    throw new Error(whenContextNotLikeDirrector(HOOK_MODULE_NAME, dir));

  if (!store.current) {
    store.current = (dir.addStoreDependency(
      StoreConstructor as DirectorrStoreClassConstructor,
      USE_HOOKS,
      initOptions
    ) as unknown) as C;
  }

  useEffect(
    () => () => {
      if (store.current)
        dir.removeStoreDependency(StoreConstructor as DirectorrStoreClassConstructor, USE_HOOKS);
    },
    []
  );

  return store.current;
}

export default createBuilderHook(useStore, BUILDER_MODULE_NAME);
