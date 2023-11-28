import {
  // DISPATCH_ACTION_FIELD_NAME,
  // SUBSCRIBE_FIELD_NAME,
  // createPromiseCancelable,
  // DISPATHERS_FIELD_NAME,
  // EFFECTS_FIELD_NAME,
  // DIRECTORR_DESTROY_STORE_ACTION,
  // DISPATHERS_EFFECT_FIELD_NAME,
  // defineProperty,
  // createValueDescriptor,
  isPayloadChecked,
  createActionTypes,
  // hasOwnProperty,
} from '../Directorr/directorrUtils'
import config from '../config'
import { callWithStoreNotConnectedToDirrectorr } from '../messages'
import {
  Action,
  EffectsMap,
  InitPayload,
  SomeFunction,
  CheckPayload,
  DispatcherActionType,
} from '../types'
import {
  DIRECTORR_DESTROY_STORE_ACTION,
  DISPATCH_ACTION_FIELD_NAME,
  DISPATHERS_EFFECT_FIELD_NAME,
  DISPATHERS_FIELD_NAME,
  EFFECTS_FIELD_NAME,
  SUBSCRIBE_FIELD_NAME,
} from '../constants'
import { createPromiseCancelable, defineProperty, hasOwnProperty } from '../utils/primitives'
import { createValueDescriptor } from '../utils/decoratorsUtils'

export const MODULE_NAME = 'createDispatcher'

export function clearDispatchers(this: any, payload: InitPayload) {
  if (this === payload.store) {
    const dispatchers: SomeFunction[] = this[DISPATHERS_EFFECT_FIELD_NAME]

    dispatchers.forEach(d => d())
  }
}

export function createDispatcher(store: any) {
  if (!hasOwnProperty(store, DISPATHERS_FIELD_NAME)) {
    const effectsMap: EffectsMap = store[EFFECTS_FIELD_NAME]
    const effects = effectsMap.get(DIRECTORR_DESTROY_STORE_ACTION)

    if (effects) {
      effects.push(DISPATHERS_EFFECT_FIELD_NAME)
    } else {
      effectsMap.set(DIRECTORR_DESTROY_STORE_ACTION, [DISPATHERS_EFFECT_FIELD_NAME])
    }

    defineProperty(store, DISPATHERS_FIELD_NAME, createValueDescriptor([]))
    defineProperty(store, DISPATHERS_EFFECT_FIELD_NAME, createValueDescriptor(clearDispatchers))
  }

  function dispatcher<P extends DispatcherActionType>(
    actionType: P,
    payload?: ReturnType<Parameters<P>[0][Parameters<P>[1]]>,
  ): Action<P>
  function dispatcher<P extends DispatcherActionType>(
    actionTypes: [P] | [P, DispatcherActionType] | [P, DispatcherActionType, DispatcherActionType],
    payload?: ReturnType<Parameters<P>[0][Parameters<P>[1]]>,
    checker?: CheckPayload,
  ): Promise<Action<P>>
  function dispatcher(actionTypes: any, payload?: any, checker?: CheckPayload) {
    if (!store[SUBSCRIBE_FIELD_NAME])
      throw new Error(callWithStoreNotConnectedToDirrectorr(MODULE_NAME, store))

    if (!Array.isArray(actionTypes))
      return store[DISPATCH_ACTION_FIELD_NAME](
        config.createAction(config.createActionType(actionTypes), payload),
      )

    const [firstActionType, secondActionType, thirdActionType] = actionTypes
    const types = createActionTypes(config.createActionType(firstActionType))

    const { type } = types
    const typeSuccess = secondActionType
      ? config.createActionType(secondActionType)
      : types.typeSuccess
    const typeError = thirdActionType ? config.createActionType(thirdActionType) : types.typeError

    const dispatchers: any[] = store[DISPATHERS_FIELD_NAME]
    const allTypes = [typeSuccess, typeError]

    const promise = createPromiseCancelable<any>((res, rej, whenCancel) => {
      const unsub = store[SUBSCRIBE_FIELD_NAME]((_: any, action: Action) => {
        if (allTypes.includes(action.type) && isPayloadChecked(action.payload, checker)) {
          unsub()
          dispatchers.splice(dispatchers.indexOf(promise.cancel), 1)

          if (action.type === typeSuccess) return res(action.payload)

          return rej(action.payload)
        }
      })

      whenCancel(unsub)
    })

    dispatchers.push(promise.cancel)

    store[DISPATCH_ACTION_FIELD_NAME](config.createAction(type, payload))

    return promise
  }

  return dispatcher
}

export default createDispatcher
