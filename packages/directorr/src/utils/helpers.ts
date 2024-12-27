import {
  DISPATCH_EFFECTS_FIELD_NAME,
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
  DIRECTORR_RELOAD_STORE_ACTION,
  DISPATCH_ACTION_FIELD_NAME,
} from '../constants'
import config from '../config'
import { Action, SomeObject } from '../types'

export function dispatchEffectInStore(store: SomeObject, action: Action): void
export function dispatchEffectInStore(store: SomeObject, actionType: string, payload: any): void
export function dispatchEffectInStore(store: any, actionOrType: any, payload?: any): void {
  if (DISPATCH_EFFECTS_FIELD_NAME in store)
    (store as any)[DISPATCH_EFFECTS_FIELD_NAME](
      typeof actionOrType !== 'string' ? actionOrType : config.createAction(actionOrType, payload),
    )
}

export function dispatchInitEffectInStore(store: SomeObject): void {
  dispatchEffectInStore(store, DIRECTORR_INIT_STORE_ACTION, {
    store,
  })
}

export function dispatchDestroyEffectInStore(store: SomeObject): void {
  dispatchEffectInStore(store, DIRECTORR_DESTROY_STORE_ACTION, {
    store,
  })
}

export function dispatchReloadEffectInStore(store: SomeObject, payload?: any): void {
  dispatchEffectInStore(store, DIRECTORR_RELOAD_STORE_ACTION, payload)
}

export function dispatchActionInStore(store: SomeObject, action: Action): void
export function dispatchActionInStore(store: SomeObject, actionType: string, payload?: any): void
export function dispatchActionInStore(store: SomeObject, actionOrType: any, payload?: any): void {
  if (DISPATCH_ACTION_FIELD_NAME in store)
    (store as any)[DISPATCH_ACTION_FIELD_NAME](
      typeof actionOrType !== 'string' ? actionOrType : config.createAction(actionOrType, payload),
    )
}

// export
