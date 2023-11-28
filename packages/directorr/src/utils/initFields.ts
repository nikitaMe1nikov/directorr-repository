import { defineProperty, hasOwnProperty } from './primitives'
import config from '../config'
import {
  DEPENDENCY_FIELD_NAME,
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  EFFECTS_FIELD_NAME,
  INJECTED_FROM_FIELD_NAME,
  STORES_FIELD_NAME,
} from '../constants'
import { createValueDescriptor } from './decoratorsUtils'

export function addInitFields(initObject: any) {
  if (!hasOwnProperty(initObject, DISPATCH_EFFECTS_FIELD_NAME)) {
    defineProperty(
      initObject,
      DISPATCH_EFFECTS_FIELD_NAME,
      createValueDescriptor(config.dispatchEffects),
    )
    defineProperty(
      initObject,
      DISPATCH_ACTION_FIELD_NAME,
      createValueDescriptor(config.dispatchEffects),
    )

    defineProperty(initObject, EFFECTS_FIELD_NAME, createValueDescriptor(new Map()))

    defineProperty(initObject, DEPENDENCY_FIELD_NAME, createValueDescriptor([]))

    defineProperty(initObject, INJECTED_FROM_FIELD_NAME, createValueDescriptor([]))

    defineProperty(initObject, STORES_FIELD_NAME, createValueDescriptor(null))
  }
}
