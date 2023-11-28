import {
  Action,
  SomeFunction,
  ActionType,
  SomeActionType,
  DirectorrStoreClass,
  DirectorrStores,
  DirectorrStoreState,
  DirectorrStore,
  EffectsMap,
  SomeObject,
  CheckObjectPattern,
  CheckPayload,
  ConvertPayloadFunction,
  InitPayload,
  CheckPayloadFunc,
} from '../types'
import { notFindStoreName } from '../messages'
import {
  EMPTY_STRING,
  EFFECTS_FIELD_NAME,
  DIRECTORR_ANY_ACTION_TYPE,
  TIMERS_FIELD_NAME,
  TRUPHY_FUNC,
} from '../constants'
import {
  compareObjectWithPattern,
  hasOwnProperty,
  isArray,
  isFunction,
  isObject,
  isString,
} from '../utils/primitives'
import { isDecoratorWithCtx } from '../utils/decoratorsUtils'

export function pickSameStore(payload: InitPayload, store: any) {
  return store === payload.store
}

export function isLikeActionType(actionType?: any): actionType is ActionType {
  if (!actionType) return false

  if (isArray(actionType)) {
    if (!actionType.length) return false

    for (let i = 0, l = actionType.length, at: any; i < l; ++i) {
      at = actionType[i]

      if (!isLikeActionType(at)) return false
    }

    return true
  }

  return isString(actionType) || isFunction(actionType)
}

export function isLikeAction(action?: any): action is Action {
  if (!action) return false

  return isObject(action) && action.type !== undefined
}

export function getStoreName(classOrModel: any): string {
  if (isFunction(classOrModel)) return classOrModel.storeName || classOrModel.name

  if (classOrModel.constructor) return getStoreName(classOrModel.constructor)

  throw new Error(notFindStoreName())
}

export function calcActionType(someActionType: SomeActionType): string {
  if (isFunction(someActionType)) {
    return isDecoratorWithCtx(someActionType) ? someActionType.type : getStoreName(someActionType)
  }

  return someActionType
}

export function createActionType(actionType: ActionType, divider: string): string {
  if (isArray(actionType)) {
    let result = EMPTY_STRING

    for (let i = 0, l = actionType.length, action: any, type: any; i < l; ++i) {
      type = actionType[i]

      action = isArray(type) ? createActionType(type, divider) : calcActionType(type)

      result += i > 0 ? divider + action : action
    }

    return result
  }

  return calcActionType(actionType)
}

export function createAction<T = string, P = any>(type: T, payload?: P): Action<T, P> {
  if (payload) return { type, payload } as Action<T, P>

  return { type } as Action<T, P>
}

export function isChecker(sample?: any): sample is CheckPayload {
  if (!sample) return false

  return isFunction(sample) || isObject(sample)
}

export function isConverter(func?: any): func is ConvertPayloadFunction {
  return isFunction(func)
}

export function dispatchEffects(this: any, action: Action): void {
  const effectsMap = this[EFFECTS_FIELD_NAME] as EffectsMap
  const effectsForActionType = effectsMap.get(action.type)

  if (effectsForActionType) {
    for (let i = 0, l = effectsForActionType.length; i < l; ++i) {
      this[effectsForActionType[i]](action.payload)
    }
  }

  const effectsForAnyActionType = effectsMap.get(DIRECTORR_ANY_ACTION_TYPE)

  if (effectsForAnyActionType) {
    for (let i = 0, l = effectsForAnyActionType.length; i < l; ++i) {
      this[effectsForAnyActionType[i]](action)
    }
  }
}

export function isStoreReady(store: DirectorrStoreClass): boolean {
  return (
    store.isReady === undefined || (isFunction(store.isReady) ? store.isReady() : store.isReady)
  )
}

export function checkStoresState(
  directorrStores: DirectorrStores,
  isStoreState: (store: any) => boolean,
  storesNames?: string[],
) {
  if (storesNames) {
    for (let i = 0, l = storesNames.length, store: any; i < l; ++i) {
      store = directorrStores.get(storesNames[i])

      if (!store) continue

      if (!isStoreState(store)) return false
    }
  } else {
    for (const store of directorrStores.values()) {
      if (!isStoreState(store)) return false
    }
  }

  return true
}

export function isStoreError(store: DirectorrStoreClass): boolean {
  return store.isError !== undefined && store.isError
}

export function findStoreStateInStores(
  directorrStores: DirectorrStores,
  isStoreState: (store: any) => boolean,
) {
  for (const store of directorrStores.values()) {
    if (isStoreState(store)) return store
  }
}

export function mergeStateToStore(storeState: DirectorrStoreState, directorrStore: DirectorrStore) {
  if (directorrStore.fromJSON) {
    directorrStore.fromJSON(storeState)
  } else {
    for (const prop in storeState) {
      if (hasOwnProperty(directorrStore, prop)) {
        const store = storeState[prop]

        if (isObject(store) && directorrStore[prop]) {
          mergeStateToStore(store as DirectorrStoreState, directorrStore[prop])
        } else {
          directorrStore[prop] = store
        }
      }
    }
  }
}

export function setStateToStore(storeState: DirectorrStoreState, directorrStore: DirectorrStore) {
  if (directorrStore.fromJSON) {
    directorrStore.fromJSON(storeState)
  } else {
    for (const prop in storeState) {
      const store = storeState[prop]

      if (isObject(store) && directorrStore[prop]) {
        setStateToStore(store as DirectorrStoreState, directorrStore[prop])
      } else {
        directorrStore[prop] = store
      }
    }
  }
}

export function hydrateStoresToState(directorrStores: DirectorrStores): SomeObject {
  const obj: SomeObject = {}

  for (const [storeName, store] of directorrStores.entries()) {
    obj[storeName] = store
  }

  return JSON.parse(JSON.stringify(obj))
}

export function isActionHave(
  { type, payload }: Action,
  someType: string,
  checkPattern: CheckObjectPattern,
): boolean {
  if (type === someType) {
    return compareObjectWithPattern(checkPattern, payload)
  }

  return false
}

export function clearTimersEffect(this: any, payload: InitPayload) {
  if (this === payload.store) {
    const timers: (number | SomeFunction)[] = this[TIMERS_FIELD_NAME]

    for (const timer of timers) {
      isFunction(timer) ? timer() : clearTimeout(timer)
    }
  }
}

export function isPayloadChecked(payload: any, checker: CheckPayload = TRUPHY_FUNC): boolean {
  if (isFunction(checker)) return (checker as CheckPayloadFunc)(payload)

  for (const prop in checker) {
    const value = (checker as CheckObjectPattern)[prop]

    if (!hasOwnProperty(payload, prop)) return false

    if (isFunction(value)) {
      if (!value(payload, prop)) return false

      continue
    }

    if (payload[prop] !== value) return false
  }

  return true
}

export function createActionTypes(type: string) {
  return {
    type,
    typeLoading: `${type}_LOADING`,
    typeSuccess: `${type}_SUCCESS`,
    typeError: `${type}_ERROR`,
  }
}
