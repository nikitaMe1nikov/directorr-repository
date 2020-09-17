import injectStore, { injectStoreDecorator, createInjectStore, MODULE_NAME } from '../injectStore';
import {
  STORES_FIELD_NAME,
  INJECTED_STORES_FIELD_NAME,
  defineProperty,
  createValueDescriptor,
} from '../utils';
import {
  callDecoratorWithNotConsrtactorType,
  notFoundConstuctorInDirectorrStore,
  notFoundStoreInDirectorrStore,
  dontUseWithAnotherDecorator,
} from '../messages';
import { DirectorrStoreClass } from '../types';
import { someValue, SomeClass, someProperty } from '../__mocks__/mocks';

describe('injectStore', () => {
  it('decorator', () => {
    class SomeClass {}
    const storeName = 'storeName';
    const emptyStoreMap = new Map();
    const storeMap = new Map([[SomeClass.name, someValue]]);

    const descriptor: any = injectStoreDecorator(SomeClass, MODULE_NAME);

    descriptor.name = storeName;

    expect(() => descriptor.set()).not.toThrow();
    expect(() => descriptor.get()).toThrowError(
      notFoundConstuctorInDirectorrStore(MODULE_NAME, SomeClass)
    );

    descriptor[STORES_FIELD_NAME] = emptyStoreMap;

    expect(() => descriptor.get()).toThrowError(
      notFoundStoreInDirectorrStore(MODULE_NAME, SomeClass, { name: storeName })
    );

    descriptor[STORES_FIELD_NAME] = storeMap;

    expect(descriptor.get()).toEqual(someValue);
  });

  it('createInjectStore', () => {
    const someDecorator = jest.fn();
    const wrongArg: any = 4;

    const injector = createInjectStore(MODULE_NAME, someDecorator);

    expect(() => injector(wrongArg)).toThrowError(
      callDecoratorWithNotConsrtactorType(MODULE_NAME, wrongArg)
    );
    expect(() => injector(SomeClass)).not.toThrow();

    const resultDecorator = injector(SomeClass);

    resultDecorator(someDecorator, someProperty);

    expect(someDecorator).toHaveBeenCalledTimes(1);
    expect(someDecorator).toHaveBeenLastCalledWith(SomeClass, MODULE_NAME);
  });

  it('injectStore set injected stores field in class', () => {
    class InjectStore1 implements DirectorrStoreClass {}
    class InjectStore2 {
      some = '12';
    }

    class SomeClass1 {
      @injectStore(InjectStore1) store: any;
    }

    class SomeClass2 extends SomeClass1 {
      @injectStore(InjectStore1) store1: any;

      @injectStore(InjectStore2) store2: any;
    }

    expect((SomeClass1 as any)[INJECTED_STORES_FIELD_NAME]).toEqual([InjectStore1]);
    expect((SomeClass2 as any)[INJECTED_STORES_FIELD_NAME]).toEqual([InjectStore1, InjectStore2]);
  });

  it('use injectStore in class', () => {
    class InjectStore {}
    const storeMap = new Map([[InjectStore.name, someValue]]);

    class SomeClass {
      @injectStore(InjectStore) store: InjectStore;
    }

    const obj = new SomeClass();

    expect(() => obj.store).toThrowError(
      notFoundConstuctorInDirectorrStore(MODULE_NAME, InjectStore)
    );

    defineProperty(SomeClass.prototype, STORES_FIELD_NAME, createValueDescriptor(storeMap));

    expect(() => obj.store).not.toThrow();
    expect(obj.store).toEqual(someValue);
  });

  it('use injectStore in class with other decorator', () => {
    class InjectStore {}

    expect(() => {
      class SomeClass {
        @injectStore(InjectStore)
        @injectStore(InjectStore)
        store: any;
      }

      new SomeClass();
    }).toThrowError(dontUseWithAnotherDecorator(MODULE_NAME));
  });
});
