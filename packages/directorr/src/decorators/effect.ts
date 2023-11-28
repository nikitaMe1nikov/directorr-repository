import { isFunction } from '../utils/primitives'
import { callWithPropNotEquallFunc } from '../messages'
import config from '../config'
import {
  ActionType,
  EffectsMap,
  CreateDecoratorValueTypedEffect,
  DecoratorValueTypedWithType,
  AddToPayload,
  Action,
} from '../types'
import decorator from './decorator'
import createrDecoratorFactory from './createDecoratorFactory'
import createActionTypeContext from './createActionTypeContext'
import { addInitFields } from '../utils/initFields'
import { EFFECTS_FIELD_NAME } from '../constants'

export const MODULE_NAME = 'effect'

export function initializer(
  initObject: any,
  value: any,
  property: string,
  [actionType]: [string],
  addFields = addInitFields,
) {
  if (!isFunction(value)) throw new Error(callWithPropNotEquallFunc(MODULE_NAME, property))

  addFields(initObject)

  const effectsMap: EffectsMap = initObject[EFFECTS_FIELD_NAME]
  const effects = effectsMap.get(actionType)

  if (effects) {
    effects.push(property)
  } else {
    effectsMap.set(actionType, [property])
  }

  return value
}

export function addTypeToDecorator(
  decorator: DecoratorValueTypedWithType,
  context: [string, AddToPayload],
) {
  decorator.type = context[0]
  decorator.createAction = payload => config.createAction(decorator.type, payload)
  decorator.isAction = (action: Action): action is Action => decorator.type === action.type

  return decorator
}

export const effect: CreateDecoratorValueTypedEffect<ActionType> = createrDecoratorFactory(
  MODULE_NAME,
  decorator,
  initializer,
  createActionTypeContext,
  addTypeToDecorator,
)

export default effect
