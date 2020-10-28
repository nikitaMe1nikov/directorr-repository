import { Context } from 'react';
import { DirectorrStoreClassConstructor } from '@nimel/directorr';
import { whenNotReactContext } from './messages';
import { isContext } from './utils';
import { HookToBuild } from './types';

export default function createBuilderHook(hookToBuild: HookToBuild, moduleName: string) {
  return function createHook(storeContext: Context<any>) {
    if (!isContext(storeContext)) throw new Error(whenNotReactContext(moduleName, storeContext));

    return <I>(StoreConstructor: DirectorrStoreClassConstructor<I>): I =>
      hookToBuild(storeContext, StoreConstructor);
  };
}
