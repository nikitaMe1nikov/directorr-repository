import {
  DISPATCH_EFFECTS_FIELD_NAME,
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
  DIRECTORR_RELOAD_STORE_ACTION,
  createAction,
} from './utils';
import { SomeObject } from './types';

export function dispatchEffectInStore(store: SomeObject, actionType: string, payload?: any): void {
  if (DISPATCH_EFFECTS_FIELD_NAME in store)
    (store as any)[DISPATCH_EFFECTS_FIELD_NAME](createAction(actionType, payload));
}

export function dispatchInitEffectInStore(store: SomeObject, initOptions?: any): void {
  dispatchEffectInStore(store, DIRECTORR_INIT_STORE_ACTION, {
    StoreConstructor: store.constructor,
    initOptions,
  });
}

export function dispatchDestroyEffectInStore(store: SomeObject, payload?: any): void {
  dispatchEffectInStore(store, DIRECTORR_DESTROY_STORE_ACTION, {
    StoreConstructor: store.constructor,
    ...payload,
  });
}

export function dispatchReloadEffectInStore(store: SomeObject, payload?: any): void {
  dispatchEffectInStore(store, DIRECTORR_RELOAD_STORE_ACTION, payload);
}
