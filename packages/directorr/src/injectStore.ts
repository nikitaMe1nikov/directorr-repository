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
} from './utils';
import {
  callDecoratorWithNotConsrtactorType,
  notFoundConstuctorInDirectorrStore,
  notFoundStoreInDirectorrStore,
  dontUseWithAnotherDecorator,
} from './messages';
import {
  DirectorrStoreClassConstructor,
  // DecoratorTarget,
  Decorator,
  // CreateDecorator,
  CreateDecoratorOneArg,
  BabelDescriptor,
} from './types';

export const MODULE_NAME = 'injectStore';

export function injectStoreDecorator(
  StoreConstructor: DirectorrStoreClassConstructor,
  moduleName: string
) {
  function get(this: any) {
    if (!(STORES_FIELD_NAME in this))
      throw new Error(notFoundConstuctorInDirectorrStore(moduleName, StoreConstructor));

    const store = this[STORES_FIELD_NAME].get(getStoreName(StoreConstructor));

    if (!store) throw new Error(notFoundStoreInDirectorrStore(moduleName, StoreConstructor, this));

    return store;
  }

  return createPropertyDescriptor(get);
}

export function createInjectStore(moduleName: string, decorator: Decorator) {
  return function injector(StoreConstructor: DirectorrStoreClassConstructor) {
    if (!isFunction(StoreConstructor))
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

const injectStore: CreateDecoratorOneArg = createInjectStore(MODULE_NAME, injectStoreDecorator);

export default injectStore;
