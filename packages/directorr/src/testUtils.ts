import {
  DISPATCH_EFFECTS_FIELD_NAME,
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
  DIRECTORR_RELOAD_STORE_ACTION,
  DISPATCH_ACTION_FIELD_NAME,
} from './utils';
import config from './config';
import { SomeObject } from './types';

export function dispatchEffectInStore(store: SomeObject, actionType: string, payload?: any): void {
  if (DISPATCH_EFFECTS_FIELD_NAME in store)
    (store as any)[DISPATCH_EFFECTS_FIELD_NAME](config.createAction(actionType, payload));
}

export function dispatchInitEffectInStore(store: SomeObject): void {
  dispatchEffectInStore(store, DIRECTORR_INIT_STORE_ACTION, {
    store,
  });
}

export function dispatchDestroyEffectInStore(store: SomeObject): void {
  dispatchEffectInStore(store, DIRECTORR_DESTROY_STORE_ACTION, {
    store,
  });
}

export function dispatchReloadEffectInStore(store: SomeObject, payload?: any): void {
  dispatchEffectInStore(store, DIRECTORR_RELOAD_STORE_ACTION, payload);
}

export function dispatchActionInStore(store: SomeObject, actionType: string, payload?: any): void {
  if (DISPATCH_ACTION_FIELD_NAME in store)
    (store as any)[DISPATCH_ACTION_FIELD_NAME](config.createAction(actionType, payload));
}
