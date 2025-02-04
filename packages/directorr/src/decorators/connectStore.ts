import config from '../config'
import { useForPropNotEquallObject } from '../messages'
import {
  Action,
  DispatchProxyAction,
  AddDispatchAction,
  ActionType,
  CreateDecoratorOneArgOption,
} from '../types'
import decorator from './decorator'
import createDecoratorFactory from './createDecoratorFactory'
import createActionTypeOptionContext from './createActionTypeOptionContext'
import { addInitFields } from '../utils/initFields'
import { DISPATCH_ACTION_FIELD_NAME, DISPATCH_EFFECTS_FIELD_NAME } from '../constants'
import { defineProperty, isFunction } from '../utils/primitives'
import { createValueDescriptor } from '../utils/decoratorsUtils'

export const MODULE_NAME = 'connectStore'

export function dispatchProxyAction(
  action: Action,
  fromStore: any,
  toStore: any,
  connectStoreProperty: string,
  prefixActionType?: string,
) {
  fromStore[DISPATCH_EFFECTS_FIELD_NAME](action)

  toStore[DISPATCH_EFFECTS_FIELD_NAME](
    config.createAction(
      config.createActionType(prefixActionType ? [prefixActionType, action.type] : action.type),
      { ...action.payload, connectStoreProperty },
    ),
  )
}

export function addDispatchAction(
  fromStore: any,
  toStore: any,
  property: string,
  prefixActionType?: string,
  dispatchAction: DispatchProxyAction = dispatchProxyAction,
) {
  return defineProperty(
    fromStore,
    DISPATCH_ACTION_FIELD_NAME,
    createValueDescriptor((action: Action) =>
      dispatchAction(action, fromStore, toStore, property, prefixActionType),
    ),
  )
}

export function initializer(
  initObject: any,
  store: any,
  property: string,
  prefixActionType?: string,
  addDispatchActionInStore: AddDispatchAction = addDispatchAction,
  addFields = addInitFields,
) {
  if (isFunction(store)) throw new Error(useForPropNotEquallObject(MODULE_NAME, property))

  addFields(initObject)

  if (!store) return store

  return addDispatchActionInStore(store, initObject, property, prefixActionType)
}

export const connectStore: CreateDecoratorOneArgOption<ActionType> = createDecoratorFactory(
  MODULE_NAME,
  decorator,
  initializer,
  createActionTypeOptionContext,
)

export default connectStore
