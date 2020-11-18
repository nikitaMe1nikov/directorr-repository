import {
  STORES_FIELD_NAME,
  INJECTED_STORES_FIELD_NAME,
  createPropertyDescriptor,
  isFunction,
  isTypescriptDecorator,
  getStoreName,
  defineProperty,
  createValueDescriptor,
  hasOwnProperty,
  isMSTModelType,
} from './utils';
import {
  callDecoratorWithNotConsrtactorType,
  notFoundDirectorrStore,
  notFoundStoreInDirectorrStore,
  dontUseWithAnotherDecorator,
} from './messages';
import {
  DirectorrStoreClassConstructor,
  Decorator,
  BabelDescriptor,
  AnyMSTModelType,
  MSTInstance,
  DecoratorValueTyped,
  DirectorrStoreClass,
  SomeObject,
} from './types';

export const MODULE_NAME = 'injectStore';

export function injectStoreDecorator(StoreConstructor: any, moduleName: string) {
  function get(this: any) {
    if (!this[STORES_FIELD_NAME])
      throw new Error(notFoundDirectorrStore(moduleName, StoreConstructor));

    const store = this[STORES_FIELD_NAME].get(getStoreName(StoreConstructor));

    if (!store) throw new Error(notFoundStoreInDirectorrStore(moduleName, StoreConstructor, this));

    return store;
  }

  return createPropertyDescriptor(get);
}

export function createInjectStore(moduleName: string, decorator: Decorator) {
  return function injector(StoreConstructor: any) {
    if (!isFunction(StoreConstructor) && !isMSTModelType(StoreConstructor))
      throw new Error(callDecoratorWithNotConsrtactorType(moduleName, StoreConstructor));

    return (target: any, property: string, descriptor?: BabelDescriptor) => {
      if (isTypescriptDecorator(descriptor))
        throw new Error(dontUseWithAnotherDecorator(moduleName));

      const { constructor: targetClass } = target;

      if (hasOwnProperty(targetClass, INJECTED_STORES_FIELD_NAME)) {
        const injectedStores = targetClass[INJECTED_STORES_FIELD_NAME];

        if (!injectedStores.includes(StoreConstructor)) injectedStores.push(StoreConstructor);
      } else {
        defineProperty(
          targetClass,
          INJECTED_STORES_FIELD_NAME,
          createValueDescriptor([StoreConstructor])
        );
      }

      return decorator(StoreConstructor, moduleName);
    };
  };
}

export type CreateDecoratorValueTypedEffect<
  I = DirectorrStoreClass | SomeObject,
  MI = AnyMSTModelType,
  A = DirectorrStoreClassConstructor<I> | MI
> = (arg: A) => DecoratorValueTyped<I | MSTInstance<MI>>;

export const injectStore: CreateDecoratorValueTypedEffect = createInjectStore(
  MODULE_NAME,
  injectStoreDecorator
);

export default injectStore;
