import {
  // callDecoratorWithNotConsrtactorType,
  // notFoundDirectorrStore,
  // notFoundStoreInDirectorrStore,
  dontUseWithAnotherDecorator,
  // notFoundDirectorr,
} from '../messages'
import {
  // DirectorrStoreClassConstructor,
  // Decorator,
  BabelDescriptor,
  DecoratorValueTyped,
  // DirectorrStoreClass,
  // SomeObject,
  // DirectorrInterface,
  DispatchAction,
} from '../types'
import {
  DISPATCH_ACTION_FIELD_NAME,
  // INJECTED_DIRECTORR_FIELD_NAME,
  // INJECTED_STORES_FIELD_NAME,
  // STORES_FIELD_NAME,
} from '../constants'
// import { getStoreName } from '../Directorr/directorrUtils'
import {
  createPropertyDescriptor,
  // createValueDescriptor,
  isTypescriptDecorator,
} from '../utils/decoratorsUtils'
import { addInitFields } from '../utils/initFields'
// import { defineProperty, hasOwnProperty, isFunction } from '../utils/primitives'

export const MODULE_NAME = 'injectDispatch'

function getDispatchAction(this: any) {
  return this[DISPATCH_ACTION_FIELD_NAME]
}

export function injectStoreDecoratorr() {
  return createPropertyDescriptor(getDispatchAction)
}

export function createInjectDirectorr(
  moduleName: string,
  createDescriptor: (moduleName: string) => PropertyDescriptor,
  addFields = addInitFields,
) {
  return (target: any, property: string, descriptor?: BabelDescriptor) => {
    if (isTypescriptDecorator(descriptor)) throw new Error(dontUseWithAnotherDecorator(moduleName))

    addFields(target)

    return createDescriptor(moduleName)
  }
}

export type DecoratorValueWithDispatch = DecoratorValueTyped<DispatchAction>

export const injectDispatch: DecoratorValueWithDispatch = createInjectDirectorr(
  MODULE_NAME,
  injectStoreDecoratorr,
)

export default injectDispatch
