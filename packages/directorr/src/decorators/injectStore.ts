import {
  callDecoratorWithNotConsrtactorType,
  notFoundDirectorrStore,
  notFoundStoreInDirectorrStore,
  dontUseWithAnotherDecorator,
} from '../messages'
import {
  DirectorrStoreClassConstructor,
  Decorator,
  BabelDescriptor,
  DecoratorValueTyped,
  DirectorrStoreClass,
  SomeObject,
} from '../types'
import { INJECTED_STORES_FIELD_NAME, STORES_FIELD_NAME } from '../constants'
import { getStoreName } from '../Directorr/directorrUtils'
import {
  createPropertyDescriptor,
  createValueDescriptor,
  isTypescriptDecorator,
} from '../utils/decoratorsUtils'
import { defineProperty, hasOwnProperty, isFunction } from '../utils/primitives'

export const MODULE_NAME = 'injectStore'

export function injectStoreDecorator(StoreConstructor: any, moduleName: string) {
  function get(this: any) {
    if (!this[STORES_FIELD_NAME])
      throw new Error(notFoundDirectorrStore(moduleName, StoreConstructor))

    const store = this[STORES_FIELD_NAME].get(getStoreName(StoreConstructor))

    if (!store)
      throw new Error(notFoundStoreInDirectorrStore(moduleName, StoreConstructor, this.constructor))

    return store
  }

  return createPropertyDescriptor(get)
}

export function createInjectStore(moduleName: string, decorator: Decorator) {
  return function injector(StoreConstructor: any) {
    if (!isFunction(StoreConstructor))
      throw new Error(callDecoratorWithNotConsrtactorType(moduleName, StoreConstructor))

    return (target: any, property: string, descriptor?: BabelDescriptor) => {
      if (isTypescriptDecorator(descriptor))
        throw new Error(dontUseWithAnotherDecorator(moduleName))

      const { constructor: targetClass } = target

      if (hasOwnProperty(targetClass, INJECTED_STORES_FIELD_NAME)) {
        const injectedStores = targetClass[INJECTED_STORES_FIELD_NAME]

        if (!injectedStores.includes(StoreConstructor)) injectedStores.push(StoreConstructor)
      } else {
        defineProperty(
          targetClass,
          INJECTED_STORES_FIELD_NAME,
          createValueDescriptor([StoreConstructor]),
        )
      }

      return decorator(StoreConstructor, moduleName)
    }
  }
}

export type CreateDecoratorValueTypedEffect<
  I = DirectorrStoreClass | SomeObject,
  A = DirectorrStoreClassConstructor<I>,
> = (arg: A) => DecoratorValueTyped<I>

export const injectStore: CreateDecoratorValueTypedEffect = createInjectStore(
  MODULE_NAME,
  injectStoreDecorator,
)

export default injectStore
