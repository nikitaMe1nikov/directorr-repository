import {
  EFFECTS_FIELD_NAME,
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  STORES_FIELD_NAME,
  INJECTED_STORES_FIELD_NAME,
  INJECTED_FROM_FIELD_NAME,
  DEPENDENCY_FIELD_NAME,
  EMPTY_FUNC,
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
  isActionHave,
  isDecoratorWithCtx,
  createPromiseCancelable,
  clearTimersEffect,
  TIMERS_FIELD_NAME,
} from '../utils';
import { notFindStoreName } from '../messages';
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
} from '../__mocks__/mocks';
import { flushPromises, flushTimeouts } from '../../../../tests/utils';

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
    expect(isLikeActionType([])).toBeFalsy();
    expect(isLikeActionType([{}] as any)).toBeFalsy();
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

    expect(getStoreName(SomeStore)).toBe(SomeStore.name);
    expect(getStoreName(SomeStoreStaticName)).toBe(SomeStoreStaticName.storeName);
    expect(getStoreName(new SomeStore())).toBe(SomeStore.name);
    expect(getStoreName(new SomeStoreStaticName())).toBe(SomeStoreStaticName.storeName);
    expect(() => getStoreName(Object.create(null))).toThrowError(notFindStoreName());
  });

  it('calcActionType', () => {
    class SomeStore {}
    const storeName = 'storeName';

    expect(calcActionType(SomeStore)).toBe(SomeStore.name);
    expect(calcActionType(storeName)).toBe(storeName);
  });

  it('isDecoratorWithCtx', () => {
    function someActionDecorator() {}
    someActionDecorator.type = 'type';

    expect(isDecoratorWithCtx(someActionDecorator)).toBeTruthy();
    expect(isDecoratorWithCtx(EMPTY_FUNC)).toBeFalsy();
  });

  it('createActionType', () => {
    function someActionDecorator() {}
    someActionDecorator.type = 'type';

    expect(createActionType(actionType, ACTION_TYPE_DIVIDER)).toBe(actionType);
    expect(createActionType(actionTypeArray, ACTION_TYPE_DIVIDER)).toBe(
      actionTypeArray.join(ACTION_TYPE_DIVIDER)
    );
    expect(createActionType(SomeClass, ACTION_TYPE_DIVIDER)).toBe(SomeClass.name);
    expect(createActionType([actionType, SomeClass], ACTION_TYPE_DIVIDER)).toBe(
      [actionType, SomeClass.name].join(ACTION_TYPE_DIVIDER)
    );
    expect(createActionType([actionType, someActionDecorator], ACTION_TYPE_DIVIDER)).toBe(
      [actionType, someActionDecorator.type].join(ACTION_TYPE_DIVIDER)
    );
    expect(createActionType([[actionType, SomeClass], SomeClass], ACTION_TYPE_DIVIDER)).toBe(
      [actionType, SomeClass.name, SomeClass.name].join(ACTION_TYPE_DIVIDER)
    );
  });

  it('batchFunction', () => {
    expect(batchFunction(someFunc)).toBe(someFunc);
  });

  it('createAction', () => {
    expect(createAction(actionType, someValue)).toStrictEqual({
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

    expect(store.someEffect).toBeCalledTimes(1);
    expect(store.someEffect).lastCalledWith(someValue);
  });

  it('DESCRIPTOR', () => {
    expect(DESCRIPTOR).toStrictEqual({
      writable: false,
      enumerable: false,
      configurable: true,
      value: null,
    });
  });

  it('PROPERTY_DESCRIPTOR', () => {
    expect(PROPERTY_DESCRIPTOR).toStrictEqual({
      enumerable: false,
      configurable: true,
      get: EMPTY_FUNC,
      set: EMPTY_FUNC,
    });
  });

  it('createValueDescriptor', () => {
    expect(createValueDescriptor(someValue).value).toBe(someValue);
  });

  it('createPropertyDescriptor', () => {
    expect(createPropertyDescriptor().get).toBe(EMPTY_FUNC);
    expect(createPropertyDescriptor().set).toBe(EMPTY_FUNC);
    expect(createPropertyDescriptor(someFunc, someFunc).get).toBe(someFunc);
    expect(createPropertyDescriptor(someFunc, someFunc).set).toBe(someFunc);
  });

  it('isLikePropertyDecorator', () => {
    expect(isLikePropertyDecorator({})).toBeTruthy();
    expect(isLikePropertyDecorator(createValueDescriptor(someValue))).toBeFalsy();
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

    expect(initializer).toBeCalledTimes(1);
    expect(initializer).lastCalledWith(descriptor, someValue, someProperty, context);
    expect(descriptor[Symbol.for(someProperty)]).toBe(someValue);
    expect(descriptor.get()).toBe(someValue);

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

    expect(set).toBeCalledTimes(1);
    expect(set).toBeCalledWith(someValue);
    expect(get).toBeCalledTimes(1);
    expect(initializer).toBeCalledTimes(2);
    expect(initializer).lastCalledWith(propDescriptor, someValue, someProperty, context);
    expect(propDescriptor[Symbol.for(someProperty)]).toBe(someValue);
    expect(propDescriptor.get()).toBe(someValue);
  });

  it('isBabelDecorator', () => {
    expect(isBabelDecorator({})).toBeFalsy();
    expect(isBabelDecorator({ initializer: EMPTY_FUNC })).toBeTruthy();
  });

  it('isTypescriptDecorator', () => {
    expect(isTypescriptDecorator({})).toBeTruthy();
    expect(isTypescriptDecorator({ initializer: EMPTY_FUNC })).toBeFalsy();
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
    expect(descriptor).toStrictEqual(babelDescriptor);
    expect(babelInitializer).toBeCalledTimes(1);
    expect(initializer).toBeCalledTimes(1);
    expect(initializer).lastCalledWith(babelDescriptor, someValue, someProperty, context);
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

    expect(decorator(someValue, someProperty, descriptor)).toStrictEqual(descriptor);

    expect(decorator1).toBeCalledTimes(1);
    expect(decorator1).lastCalledWith(someValue, someProperty, descriptor);
    expect(decorator2).toBeCalledTimes(1);
    expect(decorator2).lastCalledWith(someValue, someProperty, descriptor);
  });

  it('checkStoresState', () => {
    const stores = new Map([[someProperty, someValue]]);
    const isStoreStateTrue = jest.fn().mockReturnValue(true);
    const isStoreStateFalse = jest.fn().mockReturnValue(false);
    const storesNameExist = [someProperty];
    const storesNameNotExist = ['someNotExistStoreName'];

    expect(checkStoresState(stores, isStoreStateFalse)).toBeFalsy();
    expect(isStoreStateFalse).toBeCalledTimes(1);
    expect(isStoreStateFalse).lastCalledWith(someValue);

    expect(checkStoresState(stores, isStoreStateTrue)).toBeTruthy();
    expect(isStoreStateTrue).toBeCalledTimes(1);
    expect(isStoreStateTrue).lastCalledWith(someValue);

    expect(checkStoresState(stores, isStoreStateFalse, storesNameExist)).toBeFalsy();
    expect(isStoreStateFalse).toBeCalledTimes(2);
    expect(isStoreStateFalse).lastCalledWith(someValue);

    expect(checkStoresState(stores, isStoreStateTrue, storesNameExist)).toBeTruthy();
    expect(isStoreStateTrue).toBeCalledTimes(2);
    expect(isStoreStateTrue).lastCalledWith(someValue);

    expect(checkStoresState(stores, isStoreStateFalse, storesNameNotExist)).toBeTruthy();
    expect(isStoreStateFalse).toBeCalledTimes(2);
    expect(isStoreStateFalse).lastCalledWith(someValue);

    expect(checkStoresState(stores, isStoreStateTrue, storesNameNotExist)).toBeTruthy();
    expect(isStoreStateTrue).toBeCalledTimes(2);
    expect(isStoreStateTrue).lastCalledWith(someValue);
  });

  it('isStoreReady', () => {
    const storeEmpty = {};
    const storeFalse = {
      isReady: false,
    };
    const storeTrue = {
      isReady: true,
    };

    expect(isStoreReady(storeEmpty)).toBeTruthy();
    expect(isStoreReady(storeFalse)).toBeFalsy();
    expect(isStoreReady(storeTrue)).toBeTruthy();
  });

  it('findStoreStateInStores', () => {
    const stores = new Map([[someProperty, someValue]]);
    const isStoreStateTrue = jest.fn().mockReturnValue(true);
    const isStoreStateFalse = jest.fn().mockReturnValue(false);

    expect(findStoreStateInStores(stores, isStoreStateFalse)).toBeUndefined();
    expect(isStoreStateFalse).toBeCalledTimes(1);
    expect(isStoreStateFalse).lastCalledWith(someValue);

    expect(findStoreStateInStores(stores, isStoreStateTrue)).toBe(someValue);
    expect(isStoreStateTrue).toBeCalledTimes(1);
    expect(isStoreStateTrue).lastCalledWith(someValue);
  });

  it('isStoreError', () => {
    const storeEmpty = {};
    const storeFalse = {
      isError: false,
    };
    const storeTrue = {
      isError: true,
    };

    expect(isStoreError(storeEmpty)).toBeFalsy();
    expect(isStoreError(storeFalse)).toBeFalsy();
    expect(isStoreError(storeTrue)).toBeTruthy();
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

    expect(directorrStoreWithJSON.fromJSON).toBeCalledTimes(1);
    expect(directorrStoreWithJSON.fromJSON).lastCalledWith(storeState);

    mergeStateToStore(storeState, directorrStoreEmpty);

    expect(directorrStoreEmpty).toStrictEqual({});

    mergeStateToStore(storeState, directorrStore);

    expect(directorrStore).toStrictEqual({
      [someProperty]: someValue,
    });

    mergeStateToStore(storeStateDeep, directorrStoreDeep);

    expect(directorrStoreDeep).toStrictEqual(storeStateDeep);
  });

  it('hydrateStoresToState', () => {
    const directorrStores = new Map([
      [someProperty, someValue],
      [storeName, someValue],
    ]);

    expect(hydrateStoresToState(directorrStores)).toStrictEqual({
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
    const directorr: any = someValue;

    const afterware = createAfterware(afterwareMap);

    afterware({ type: 'type', payload: {} }, dispatch, directorr);

    expect(actionTypePayloadAfterware).toBeCalledTimes(0);
    expect(actionType2PayloadAfterware).toBeCalledTimes(0);

    afterware(action, dispatch, directorr);

    expect(actionTypePayloadAfterware).toBeCalledTimes(1);
    expect(actionTypePayloadAfterware).lastCalledWith(dispatch, action.payload, directorr);

    afterware(actionTwo, dispatch, directorr);

    expect(actionType2PayloadAfterware).toBeCalledTimes(1);
    expect(actionType2PayloadAfterware).lastCalledWith(dispatch, actionTwo.payload, directorr);
  });

  it('isActionHave', () => {
    const otherType = 'otherType';
    const patternWithValueTrue = {
      someValue: jest.fn().mockReturnValue(true),
    };
    const patternWithValueFalse = {
      someValue: jest.fn().mockReturnValue(false),
    };

    expect(isActionHave(action, otherType, {})).toBeFalsy();
    expect(isActionHave({ type: otherType }, otherType, {})).toBeFalsy();
    expect(isActionHave(action, action.type, { ...someValue })).toBeTruthy();
    expect(isActionHave(action, action.type, {})).toBeTruthy();
    expect(isActionHave(action, action.type, { prop: 1 })).toBeFalsy();
    expect(isActionHave(action, action.type, patternWithValueTrue)).toBeTruthy();
    expect(isActionHave(action, action.type, patternWithValueFalse)).toBeFalsy();
  });

  it('createPromiseCancelable when not resolved', async () => {
    const fulfill = jest.fn();
    const reject = jest.fn();
    const whenCancelCallback = jest.fn();
    const notResolvedExecutor = (res: any, rej: any, whenCancel: any) => {
      whenCancel(whenCancelCallback);
    };

    const promise = createPromiseCancelable(notResolvedExecutor);

    promise.then(fulfill).catch(reject);

    await flushPromises();

    expect(fulfill).not.toBeCalled();
    expect(reject).not.toBeCalled();
    expect(whenCancelCallback).not.toBeCalled();

    promise.cancel();

    expect(fulfill).not.toBeCalled();
    expect(reject).not.toBeCalled();
    expect(whenCancelCallback).toBeCalled();
  });

  it('createPromiseCancelable when resolved', async () => {
    const fulfill = jest.fn();
    const reject = jest.fn();
    const whenCancelCallback = jest.fn();
    const resolvedExecutor = (res: any, rej: any, whenCancel: any) => {
      res();
      whenCancel(whenCancelCallback);
    };

    const promise = createPromiseCancelable(resolvedExecutor);

    promise.then(fulfill).catch(reject);

    await flushPromises();

    expect(fulfill).toBeCalledTimes(1);
    expect(reject).not.toBeCalled();
    expect(whenCancelCallback).not.toBeCalled();

    promise.cancel();

    expect(fulfill).toBeCalledTimes(1);
    expect(reject).not.toBeCalled();
    expect(whenCancelCallback).not.toBeCalled();
  });

  it('createPromiseCancelable when rejected', async () => {
    const fulfill = jest.fn();
    const reject = jest.fn();
    const whenCancelCallback = jest.fn();
    const resolvedExecutor = (res: any, rej: any, whenCancel: any) => {
      rej();
      whenCancel(whenCancelCallback);
    };

    const promise = createPromiseCancelable(resolvedExecutor);

    promise.then(fulfill).catch(reject);

    await flushPromises();

    expect(reject).toBeCalledTimes(1);
    expect(fulfill).not.toBeCalled();
    expect(whenCancelCallback).not.toBeCalled();

    promise.cancel();

    expect(reject).toBeCalledTimes(1);
    expect(fulfill).not.toBeCalled();
    expect(whenCancelCallback).not.toBeCalled();
  });

  it('clearTimersEffect', async () => {
    const timer = jest.fn();
    const intimer = jest.fn();
    const timerID = setTimeout(intimer, 0);
    class SomeClass {
      [TIMERS_FIELD_NAME] = [timer, timerID];
      clearTimersEffect = clearTimersEffect;
    }

    const obj = new SomeClass();

    obj.clearTimersEffect({ StoreConstructor: {} as any });

    expect(timer).not.toBeCalled();
    expect(intimer).not.toBeCalled();

    obj.clearTimersEffect({ StoreConstructor: SomeClass as any });

    expect(timer).toBeCalledTimes(1);
    expect(intimer).not.toBeCalled();

    await flushTimeouts();

    expect(timer).toBeCalledTimes(1);
    expect(intimer).not.toBeCalled();
  });
});
