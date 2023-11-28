import { clearTimersEffect } from '../Directorr/directorrUtils'
import { callWithPropNotEquallFunc } from '../messages'
import { CreateDecoratorOneArgOption, EffectsMap } from '../types'
import decorator from './decorator'
import createDecoratorFactory from './createDecoratorFactory'
import { addInitFields } from '../utils/initFields'
import {
  CLEAR_TIMERS_EFFECT_FIELD_NAME,
  DIRECTORR_DESTROY_STORE_ACTION,
  EFFECTS_FIELD_NAME,
  TIMERS_FIELD_NAME,
} from '../constants'
import { defineProperty, hasOwnProperty, isFunction } from '../utils/primitives'
import { createValueDescriptor } from '../utils/decoratorsUtils'

export const MODULE_NAME = 'delay'

export function initializer(
  initObject: any,
  value: any,
  property: string,
  [delay = 0]: [number],
  addFields = addInitFields,
) {
  if (!isFunction(value)) throw new Error(callWithPropNotEquallFunc(MODULE_NAME, property))

  addFields(initObject)

  if (!hasOwnProperty(initObject, TIMERS_FIELD_NAME)) {
    const effectsMap: EffectsMap = initObject[EFFECTS_FIELD_NAME]
    const effects = effectsMap.get(DIRECTORR_DESTROY_STORE_ACTION)

    if (effects) {
      effects.push(CLEAR_TIMERS_EFFECT_FIELD_NAME)
    } else {
      effectsMap.set(DIRECTORR_DESTROY_STORE_ACTION, [CLEAR_TIMERS_EFFECT_FIELD_NAME])
    }

    defineProperty(initObject, TIMERS_FIELD_NAME, createValueDescriptor([]))
    defineProperty(
      initObject,
      CLEAR_TIMERS_EFFECT_FIELD_NAME,
      createValueDescriptor(clearTimersEffect),
    )
  }

  return (...args: any[]) => {
    const timers: number[] = initObject[TIMERS_FIELD_NAME]

    const timerID = setTimeout(() => {
      timers.splice(timers.indexOf(timerID), 1)

      value(...args)
    }, delay) as unknown as number

    timers.push(timerID)
  }
}

export const delay: CreateDecoratorOneArgOption<number> = createDecoratorFactory(
  MODULE_NAME,
  decorator,
  initializer,
)

export default delay
