import {
  EFFECTS_FIELD_NAME,
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  STORES_FIELD_NAME,
  INJECTED_STORES_FIELD_NAME,
  INJECTED_FROM_FIELD_NAME,
  DEPENDENCY_FIELD_NAME,
  emptyFunc,
  ACTION_TYPE_DIVIDER,
  isFunction,
  isObject,
  createValueDescriptor,
  createPropertyDescriptor,
  isLikeActionType,
  isLikeAction,
  createActionType,
  isLikePropertyDecorator,
  createTypescriptDescriptor,
  createBabelDescriptor,
  createDescriptor,
  isBabelDecorator,
  DESCRIPTOR,
  PROPERTY_DESCRIPTOR,
  batchFunction,
  createAction,
  isChecker,
  dispatchEffects,
  composePropertyDecorators,
  checkStoresState,
  isStoreReady,
  findStoreStateInStores,
  isStoreError,
  mergeStateToStore,
  hydrateStoresToState,
  createAfterware,
  getStoreName,
  calcActionType,
  isConverter,
  isTypescriptDecorator,
} from '../utils';
import {
  someProperty,
  someValue,
  someFunc,
  actionType,
  actionType2,
  actionTypeArray,
  action,
  actionTwo,
  context,
  storeName,
  SomeClass,
} from './mocks';

describe('utils', () => {
  it('symbols', () => {
    expect(typeof EFFECTS_FIELD_NAME).toBe('symbol');
    expect(typeof DISPATCH_EFFECTS_FIELD_NAME).toBe('symbol');
    expect(typeof STORES_FIELD_NAME).toBe('symbol');
    expect(typeof DISPATCH_ACTION_FIELD_NAME).toBe('symbol');
    expect(typeof INJECTED_STORES_FIELD_NAME).toBe('symbol');
    expect(typeof INJECTED_FROM_FIELD_NAME).toBe('symbol');
    expect(typeof DEPENDENCY_FIELD_NAME).toBe('symbol');
  });

  it('isLikeActionType', () => {
    expect(isLikeActionType()).toBeFalsy();
    expect(isLikeActionType(actionType)).toBeTruthy();
    expect(isLikeActionType(actionTypeArray)).toBeTruthy();
  });

  it('isLikeAction', () => {
    expect(isLikeAction()).toBeFalsy();
    expect(isLikeAction(4)).toBeFalsy();
    expect(isLikeAction(action)).toBeTruthy();
  });

  it('isFunction', () => {
    expect(isFunction(4)).toBeFalsy();
    expect(isFunction(someValue)).toBeFalsy();
    expect(isFunction(someFunc)).toBeTruthy();
  });

  it('isObject', () => {
    expect(isObject(true)).toBeFalsy();
    expect(isObject(3)).toBeFalsy();
    expect(isObject(someFunc)).toBeFalsy();
    expect(isObject(someValue)).toBeTruthy();
  });

  it('getStoreName', () => {
    class SomeStore {}
    class SomeStoreStaticName {
      static storeName = 'storeName';
    }

    expect(getStoreName(SomeStore)).toEqual(SomeStore.name);
    expect(getStoreName(SomeStoreStaticName)).toEqual(SomeStoreStaticName.storeName);
    expect(getStoreName(new SomeStore())).toEqual(SomeStore.name);
    expect(getStoreName(new SomeStoreStaticName())).toEqual(SomeStoreStaticName.storeName);
  });

  it('calcActionType', () => {
    class SomeStore {}
    const storeName = 'storeName';

    expect(calcActionType(SomeStore)).toEqual(SomeStore.name);
    expect(calcActionType(storeName)).toEqual(storeName);
  });

  it('createActionType', () => {
    expect(createActionType(actionType, ACTION_TYPE_DIVIDER)).toEqual(actionType);
    expect(createActionType(actionTypeArray, ACTION_TYPE_DIVIDER)).toEqual(
      actionTypeArray.join(ACTION_TYPE_DIVIDER)
    );
    expect(createActionType(SomeClass, ACTION_TYPE_DIVIDER)).toEqual(SomeClass.name);
    expect(createActionType([actionType, SomeClass], ACTION_TYPE_DIVIDER)).toEqual(
      [actionType, SomeClass.name].join(ACTION_TYPE_DIVIDER)
    );
  });

  it('batchFunction', () => {
    expect(batchFunction(someFunc)).toEqual(someFunc);
  });

  it('createAction', () => {
    expect(createAction(actionType, someValue)).toEqual({
      type: actionType,
      payload: someValue,
    });
  });

  it('isChecker', () => {
    expect(isChecker()).toBeFalsy();
    expect(isChecker(3)).toBeFalsy();
    expect(isChecker(someFunc)).toBeTruthy();
    expect(isChecker(someValue)).toBeTruthy();
  });

  it('isConverter', () => {
    expect(isConverter(1)).toBeFalsy();
    expect(isConverter(someFunc)).toBeTruthy();
  });

  it('dispatchEffects', () => {
    const emptyStore = {
      dispatchEffects,
      [EFFECTS_FIELD_NAME]: new Map(),
    };

    expect(() =>
      emptyStore.dispatchEffects({
        type: actionType,
        payload: someValue,
      })
    ).not.toThrow();

    const store = {
      dispatchEffects,
      [EFFECTS_FIELD_NAME]: new Map([[actionType, ['someEffect']]]),
      someEffect: jest.fn(),
    };

    store.dispatchEffects({
      type: actionType,
      payload: someValue,
    });

    expect(store.someEffect).toHaveBeenCalledTimes(1);
    expect(store.someEffect).toHaveBeenLastCalledWith(someValue);
  });

  it('DESCRIPTOR', () => {
    expect(DESCRIPTOR).toEqual({
      writable: false,
      enumerable: false,
      configurable: true,
      value: null,
    });
  });

  it('PROPERTY_DESCRIPTOR', () => {
    expect(PROPERTY_DESCRIPTOR).toEqual({
      enumerable: false,
      configurable: true,
      get: emptyFunc,
      set: emptyFunc,
    });
  });

  it('createValueDescriptor', () => {
    expect(createValueDescriptor(someValue).value).toEqual(someValue);
  });

  it('createPropertyDescriptor', () => {
    expect(createPropertyDescriptor(someFunc, someFunc).get).toEqual(someFunc);
    expect(createPropertyDescriptor(someFunc, someFunc).set).toEqual(someFunc);
  });

  it('isLikePropertyDecorator', () => {
    expect(isLikePropertyDecorator({})).toBeFalsy();
    expect(isLikePropertyDecorator(createValueDescriptor(someValue))).toBeTruthy();
  });

  it('createTypescriptDescriptor', () => {
    const initializer = jest.fn().mockImplementation(() => someValue);

    const descriptor: any = createTypescriptDescriptor(
      createValueDescriptor(someValue),
      someProperty,
      initializer,
      context
    );

    expect(descriptor).toHaveProperty('set');
    expect(descriptor).toHaveProperty('get');

    descriptor.set(someValue);

    expect(initializer).toHaveBeenCalledTimes(1);
    expect(initializer).toHaveBeenLastCalledWith(descriptor, someValue, someProperty, context);
    expect(descriptor[Symbol.for(someProperty)]).toEqual(someValue);
    expect(descriptor.get()).toEqual(someValue);

    const get = jest.fn().mockImplementation(() => someValue);
    const set = jest.fn();
    const propDescriptor: any = createTypescriptDescriptor(
      {
        enumerable: false,
        configurable: true,
        get,
        set,
      },
      someProperty,
      initializer,
      context
    );

    expect(propDescriptor).toHaveProperty('set');
    expect(propDescriptor).toHaveProperty('get');

    propDescriptor.set(someValue);

    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(someValue);
    expect(get).toHaveBeenCalledTimes(1);
    expect(initializer).toHaveBeenCalledTimes(2);
    expect(initializer).toHaveBeenLastCalledWith(propDescriptor, someValue, someProperty, context);
    expect(propDescriptor[Symbol.for(someProperty)]).toEqual(someValue);
    expect(propDescriptor.get()).toEqual(someValue);
  });

  it('isBabelDecorator', () => {
    expect(isBabelDecorator({})).toBeFalsy();
    expect(isBabelDecorator({ initializer: emptyFunc })).toBeTruthy();
  });

  it('isTypescriptDecorator', () => {
    expect(isTypescriptDecorator({})).toBeTruthy();
    expect(isTypescriptDecorator({ initializer: emptyFunc })).toBeFalsy();
  });

  it('createBabelDescriptor', () => {
    const initializer = jest.fn();

    const babelInitializer = jest.fn().mockImplementation(() => someValue);
    const babelDescriptor = {
      writable: true,
      initializer: babelInitializer,
    };
    const descriptor: any = createBabelDescriptor(
      babelDescriptor,
      someProperty,
      initializer,
      context
    );

    expect(descriptor).toHaveProperty('initializer');

    descriptor.initializer();

    expect(descriptor.writable).toBeFalsy();
    expect(descriptor).toEqual(babelDescriptor);
    expect(babelInitializer).toHaveBeenCalledTimes(1);
    expect(initializer).toHaveBeenCalledTimes(1);
    expect(initializer).toHaveBeenLastCalledWith(babelDescriptor, someValue, someProperty, context);
  });

  it('createDescriptor', () => {
    const babelDescriptor = {
      initializer: someFunc,
    };
    const typescriptdescriptor = {};

    expect(createDescriptor(babelDescriptor, someProperty, someFunc, context)).toHaveProperty(
      'initializer'
    );
    expect(createDescriptor(typescriptdescriptor, someProperty, someFunc, context)).toHaveProperty(
      'get'
    );
  });

  it('composePropertyDecorators', () => {
    const decorator1 = jest.fn().mockImplementation((v1, v2, d) => d);
    const decorator2 = jest.fn().mockImplementation((v1, v2, d) => d);
    const decorators = [decorator1, decorator2];
    const descriptor = {};
    const decorator = composePropertyDecorators(decorators);

    expect(decorator(someValue, someProperty, descriptor)).toEqual(descriptor);

    expect(decorator1).toHaveBeenCalledTimes(1);
    expect(decorator1).toHaveBeenLastCalledWith(someValue, someProperty, descriptor);
    expect(decorator2).toHaveBeenCalledTimes(1);
    expect(decorator2).toHaveBeenLastCalledWith(someValue, someProperty, descriptor);
  });

  it('checkStoresState', () => {
    const stores = new Map([[someProperty, someValue]]);
    const isStoreStateTrue = jest.fn().mockReturnValue(true);
    const isStoreStateFalse = jest.fn().mockReturnValue(false);
    const storesNameExist = [someProperty];
    const storesNameNotExist = ['someNotExistStoreName'];

    expect(checkStoresState(stores, isStoreStateFalse)).toEqual(false);
    expect(isStoreStateFalse).toHaveBeenCalledTimes(1);
    expect(isStoreStateFalse).toHaveBeenLastCalledWith(someValue);

    expect(checkStoresState(stores, isStoreStateTrue)).toEqual(true);
    expect(isStoreStateTrue).toHaveBeenCalledTimes(1);
    expect(isStoreStateTrue).toHaveBeenLastCalledWith(someValue);

    expect(checkStoresState(stores, isStoreStateFalse, storesNameExist)).toEqual(false);
    expect(isStoreStateFalse).toHaveBeenCalledTimes(2);
    expect(isStoreStateFalse).toHaveBeenLastCalledWith(someValue);

    expect(checkStoresState(stores, isStoreStateTrue, storesNameExist)).toEqual(true);
    expect(isStoreStateTrue).toHaveBeenCalledTimes(2);
    expect(isStoreStateTrue).toHaveBeenLastCalledWith(someValue);

    expect(checkStoresState(stores, isStoreStateFalse, storesNameNotExist)).toEqual(true);
    expect(isStoreStateFalse).toHaveBeenCalledTimes(2);
    expect(isStoreStateFalse).toHaveBeenLastCalledWith(someValue);

    expect(checkStoresState(stores, isStoreStateTrue, storesNameNotExist)).toEqual(true);
    expect(isStoreStateTrue).toHaveBeenCalledTimes(2);
    expect(isStoreStateTrue).toHaveBeenLastCalledWith(someValue);
  });

  it('isStoreReady', () => {
    const storeEmpty = {};
    const storeFalse = {
      isReady: false,
    };
    const storeTrue = {
      isReady: true,
    };

    expect(isStoreReady(storeEmpty)).toEqual(true);
    expect(isStoreReady(storeFalse)).toEqual(false);
    expect(isStoreReady(storeTrue)).toEqual(true);
  });

  it('findStoreStateInStores', () => {
    const stores = new Map([[someProperty, someValue]]);
    const isStoreStateTrue = jest.fn().mockReturnValue(true);
    const isStoreStateFalse = jest.fn().mockReturnValue(false);

    expect(findStoreStateInStores(stores, isStoreStateFalse)).toBeUndefined();
    expect(isStoreStateFalse).toHaveBeenCalledTimes(1);
    expect(isStoreStateFalse).toHaveBeenLastCalledWith(someValue);

    expect(findStoreStateInStores(stores, isStoreStateTrue)).toEqual(someValue);
    expect(isStoreStateTrue).toHaveBeenCalledTimes(1);
    expect(isStoreStateTrue).toHaveBeenLastCalledWith(someValue);
  });

  it('isStoreError', () => {
    const storeEmpty = {};
    const storeFalse = {
      isError: false,
    };
    const storeTrue = {
      isError: true,
    };

    expect(isStoreError(storeEmpty)).toEqual(false);
    expect(isStoreError(storeFalse)).toEqual(false);
    expect(isStoreError(storeTrue)).toEqual(true);
  });

  it('mergeStateToStore', () => {
    const directorrStoreWithJSON = {
      fromJSON: jest.fn(),
    };
    const directorrStoreEmpty = {};
    const storeState = {
      [someProperty]: someValue,
    };
    const directorrStore = {
      [someProperty]: null,
    };
    const storeStateDeep = {
      [someProperty]: {
        [someProperty]: someValue,
      },
    };
    const directorrStoreDeep = {
      [someProperty]: null,
    };

    mergeStateToStore(storeState, directorrStoreWithJSON);

    expect(directorrStoreWithJSON.fromJSON).toHaveBeenCalledTimes(1);
    expect(directorrStoreWithJSON.fromJSON).toHaveBeenLastCalledWith(storeState);

    mergeStateToStore(storeState, directorrStoreEmpty);

    expect(directorrStoreEmpty).toEqual({});

    mergeStateToStore(storeState, directorrStore);

    expect(directorrStore).toEqual({
      [someProperty]: someValue,
    });

    mergeStateToStore(storeStateDeep, directorrStoreDeep);

    expect(directorrStoreDeep).toEqual(storeStateDeep);
  });

  it('hydrateStoresToState', () => {
    const directorrStores = new Map([
      [someProperty, someValue],
      [storeName, someValue],
    ]);

    expect(hydrateStoresToState(directorrStores)).toEqual({
      [someProperty]: someValue,
      [storeName]: someValue,
    });
  });

  it('createAfterware', () => {
    const actionTypePayloadAfterware = jest.fn();
    const actionType2PayloadAfterware = jest.fn();
    const dispatch = jest.fn();
    const afterwareMap = {
      [actionType]: actionTypePayloadAfterware,
      [actionType2]: actionType2PayloadAfterware,
    };

    const afterware = createAfterware(afterwareMap);

    afterware({ type: 'type', payload: {} }, dispatch);

    expect(actionTypePayloadAfterware).toHaveBeenCalledTimes(0);
    expect(actionType2PayloadAfterware).toHaveBeenCalledTimes(0);

    afterware(action, dispatch);

    expect(actionTypePayloadAfterware).toHaveBeenCalledTimes(1);
    expect(actionTypePayloadAfterware).toHaveBeenLastCalledWith(dispatch, action.payload);

    afterware(actionTwo, dispatch);

    expect(actionType2PayloadAfterware).toHaveBeenCalledTimes(1);
    expect(actionType2PayloadAfterware).toHaveBeenLastCalledWith(dispatch, actionTwo.payload);
  });
});