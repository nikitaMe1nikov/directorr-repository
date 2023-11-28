import {
  // callDecoratorWithNotConsrtactorType,
  // notFoundDirectorrStore,
  // notFoundStoreInDirectorrStore,
  dontUseWithAnotherDecorator,
  notFoundDirectorr,
} from '../messages'
import {
  // DirectorrStoreClassConstructor,
  // Decorator,
  BabelDescriptor,
  DecoratorValueTyped,
  // DirectorrStoreClass,
  // SomeObject,
  DirectorrInterface,
} from '../types'
import {
  INJECTED_DIRECTORR_FIELD_NAME,
  // INJECTED_STORES_FIELD_NAME,
  // STORES_FIELD_NAME,
} from '../constants'
// import { getStoreName } from '../Directorr/directorrUtils'
import {
  createPropertyDescriptor,
  // createValueDescriptor,
  isTypescriptDecorator,
} from '../utils/decoratorsUtils'
// import { defineProperty, hasOwnProperty, isFunction } from '../utils/primitives'

export const MODULE_NAME = 'injectDirectorr'

export function injectStoreDecoratorr(moduleName: string) {
  function get(this: any) {
    if (!this[INJECTED_DIRECTORR_FIELD_NAME]) throw new Error(notFoundDirectorr(moduleName))

    return this[INJECTED_DIRECTORR_FIELD_NAME]
  }

  return createPropertyDescriptor(get)
}

export function createInjectDirectorr(
  moduleName: string,
  createDescriptor: (moduleName: string) => PropertyDescriptor,
) {
  return (target: any, property: string, descriptor?: BabelDescriptor) => {
    if (isTypescriptDecorator(descriptor)) throw new Error(dontUseWithAnotherDecorator(moduleName))

    return createDescriptor(moduleName)
  }
}

export type DecoratorValueWithDirectorr = DecoratorValueTyped<DirectorrInterface>

export const injectDirectorr: DecoratorValueWithDirectorr = createInjectDirectorr(
  MODULE_NAME,
  injectStoreDecoratorr,
)

export default injectDirectorr
