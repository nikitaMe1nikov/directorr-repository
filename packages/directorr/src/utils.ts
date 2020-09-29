import {
  Action,
  SomeFunction,
  GetFunction,
  SetFunction,
  BabelDescriptor,
  Initializer,
  ActionType,
  SomeActionType,
  DirectorrStoreClass,
  Decorator,
  DirectorrStores,
  DirectorrStoreState,
  DirectorrStore,
  EffectsMap,
  SomeObject,
  CheckObjectPattern,
  AfterwareMap,
  Afterware,
  DirectorrStoreClassConstructor,
} from './types';
import { notFindStoreName } from './messages';

export const EFFECTS_FIELD_NAME = Symbol.for('dirrector: effects');

export const DISPATCH_ACTION_FIELD_NAME = Symbol.for('dirrector: dispatchAction');

export const DISPATCH_EFFECTS_FIELD_NAME = Symbol.for('dirrector: dispatchEffects');

export const STORES_FIELD_NAME = Symbol.for('dirrector: stores');

export const INJECTED_STORES_FIELD_NAME = Symbol.for('dirrector: injected stores');

export const INJECTED_FROM_FIELD_NAME = Symbol.for('dirrector: injected from stores');

export const DEPENDENCY_FIELD_NAME = Symbol.for('dirrector: external dependency');

export const EMPTY_FUNC = () => {};

export const RETURN_ARG_FUNC = (a: any) => a;

export const EMPTY_STRING = '';

export const EMPTY_OBJECT = Object.freeze({});

export const DIRECTORR_INIT_STORE_ACTION = '@@DIRECTORR.INIT_STORE_ACTION';

export const DIRECTORR_DESTROY_STORE_ACTION = '@@DIRECTORR.DESTROY_STORE_ACTION';

export const DIRECTORR_RELOAD_STORE_ACTION = '@@DIRECTORR.RELOAD_STORE_ACTION';

export const ACTION_TYPE_DIVIDER = '.';

export const TYPEOF = {
  STRING: 'string',
};

export const DESCRIPTOR: PropertyDescriptor = {
  writable: false,
  enumerable: false,
  configurable: true,
  value: null,
};

export const PROPERTY_DESCRIPTOR: PropertyDescriptor = {
  enumerable: false,
  configurable: true,
  get: EMPTY_FUNC,
  set: EMPTY_FUNC,
};

export function createValueDescriptor(value?: any): PropertyDescriptor {
  DESCRIPTOR.value = value;

  return DESCRIPTOR;
}

export function createPropertyDescriptor(
  get: GetFunction = EMPTY_FUNC,
  set: SetFunction = EMPTY_FUNC
): PropertyDescriptor {
  PROPERTY_DESCRIPTOR.get = get;
  PROPERTY_DESCRIPTOR.set = set;

  return PROPERTY_DESCRIPTOR;
}

export const { isArray } = Array;

export const {
  defineProperty,
  keys,
  prototype: { toString, hasOwnProperty: hasOwnPropertyFromPrototype },
} = Object;

const STRING_OBJECT = '[object Object]';

export function isObject(obj: any): boolean {
  return toString.call(obj) === STRING_OBJECT;
}

export function isString(string: any): boolean {
  return typeof string === TYPEOF.STRING;
}

export function isFunction(v: any): boolean {
  return !!(v && v.constructor && v.call && v.apply);
}

export function hasOwnProperty(target: any, prop: string | symbol) {
  return hasOwnPropertyFromPrototype.call(target, prop);
}

export function isLikeActionType(actionType?: ActionType): boolean {
  if (!actionType) return false;

  if (isArray(actionType)) {
    if (!actionType.length) return false;

    for (let i = 0, l = actionType.length, at: any; i < l; ++i) {
      at = actionType[i];

      if (!isString(at) && !isFunction(at) && !isLikeActionType(at)) return false;
    }

    return true;
  }

  return isString(actionType) || isFunction(actionType);
}

export function isLikeAction(action?: any): boolean {
  if (!action) return false;

  return isObject(action) && action.type !== undefined;
}

export function getStoreName(v: DirectorrStoreClassConstructor<any> | SomeObject): string {
  if (isFunction(v)) return v.storeName || v.name;

  if (v.constructor) return getStoreName(v.constructor);

  throw new Error(notFindStoreName());
}

export function calcActionType(someActionType: SomeActionType): string {
  return isFunction(someActionType)
    ? getStoreName(someActionType as DirectorrStoreClassConstructor<any>)
    : (someActionType as string);
}

export function createActionType(actionType: ActionType, divider: string): string {
  if (isArray(actionType)) {
    let result = EMPTY_STRING;

    for (let i = 0, l = actionType.length, action: any, type: any; i < l; ++i) {
      type = actionType[i];

      action = isArray(type) ? createActionType(type, divider) : calcActionType(type);

      result += i > 0 ? divider + action : action;
    }

    return result;
  }

  return calcActionType(actionType);
}

export function batchFunction(f: SomeFunction): SomeFunction {
  return f;
}

export function createAction(type: string, payload?: any): Action {
  return { type, payload };
}

export function isChecker(sample?: any): boolean {
  if (!sample) return false;

  return isFunction(sample) || isObject(sample);
}

export function isConverter(func?: any): boolean {
  return isFunction(func);
}

export function dispatchEffects(this: any, action: Action): void {
  const effectsForActionType = (this[EFFECTS_FIELD_NAME] as EffectsMap).get(action.type);

  if (effectsForActionType) {
    for (let i = 0, l = effectsForActionType.length; i < l; ++i) {
      this[effectsForActionType[i]](action.payload);
    }
  }
}

export function isLikePropertyDecorator(decorator?: BabelDescriptor): boolean {
  return !!decorator?.value;
}

export function createTypescriptDescriptor(
  descriptor: BabelDescriptor = EMPTY_OBJECT,
  property: string,
  initializer: SomeFunction,
  ctx: any
): BabelDescriptor {
  const key = Symbol.for(property);
  const { set, get } = descriptor;

  function newSet(this: any, newValue: any) {
    let value: any;

    if (set && get) {
      set.call(this, newValue);

      value = get.call(this);
    } else {
      value = newValue;
    }

    defineProperty(this, key, createValueDescriptor(initializer(this, value, property, ctx)));
  }

  function newGet(this: any) {
    return this[key];
  }

  return createPropertyDescriptor(newGet, newSet);
}

export function isBabelDecorator(decorator?: BabelDescriptor): boolean {
  return !!(decorator && decorator.initializer !== undefined);
}

export function isTypescriptDecorator(decorator?: BabelDescriptor): boolean {
  return !!(decorator && !isBabelDecorator(decorator));
}

export function createBabelDescriptor(
  descriptor: BabelDescriptor,
  property: string,
  initializer: Initializer,
  ctx: any
): BabelDescriptor {
  descriptor.writable = false;
  // descriptor.enumerable = false;

  const oldInitializer = descriptor.initializer;

  descriptor.initializer = function initializerDirectorr() {
    return initializer(this, oldInitializer && oldInitializer.call(this), property, ctx);
  };

  return descriptor;
}

export function createDescriptor(
  d: BabelDescriptor | undefined,
  property: string,
  init: Initializer,
  ctx: any
): BabelDescriptor {
  return d && isBabelDecorator(d)
    ? createBabelDescriptor(d, property, init, ctx)
    : createTypescriptDescriptor(d, property, init, ctx);
}

export function composePropertyDecorators(decorators: Decorator[]): Decorator {
  return (target: any, property: string, descriptor?: BabelDescriptor) => {
    let resultDescriptor: any = descriptor;

    for (let i = decorators.length - 1; i >= 0; --i) {
      resultDescriptor = decorators[i](target, property, resultDescriptor);
    }

    return resultDescriptor;
  };
}

export function isStoreReady(store: DirectorrStoreClass): boolean {
  return store.isReady === undefined || store.isReady;
}

export function checkStoresState(
  directorrStores: DirectorrStores,
  isStoreState: (store: any) => boolean,
  storesNames?: string[]
) {
  if (storesNames) {
    for (let i = 0, l = storesNames.length, store; i < l; ++i) {
      store = directorrStores.get(storesNames[i]);

      if (!store) continue;

      if (!isStoreState(store)) return false;
    }
  } else {
    for (const store of directorrStores.values()) {
      if (!isStoreState(store)) return false;
    }
  }

  return true;
}

export function isStoreError(store: DirectorrStoreClass): boolean {
  return store.isError !== undefined && store.isError;
}

export function findStoreStateInStores(
  directorrStores: DirectorrStores,
  isStoreState: (store: any) => boolean
) {
  for (const store of directorrStores.values()) {
    if (isStoreState(store)) return store;
  }
}

export function mergeStateToStore(storeState: DirectorrStoreState, directorrStore: DirectorrStore) {
  if (directorrStore.fromJSON) {
    directorrStore.fromJSON(storeState);
  } else {
    for (const prop in storeState) {
      if (prop in directorrStore) {
        const store = storeState[prop];

        if (isObject(store) && directorrStore[prop]) {
          mergeStateToStore(store as DirectorrStoreState, directorrStore[prop]);
        } else {
          directorrStore[prop] = store;
        }
      }
    }
  }
}

export function hydrateStoresToState(directorrStores: DirectorrStores) {
  const obj: any = {};

  for (const [storeName, store] of directorrStores.entries()) {
    obj[storeName] = store;
  }

  return JSON.parse(JSON.stringify(obj));
}

export function createAfterware(afterwareMap: AfterwareMap): Afterware {
  return (action, dispatch) => {
    const payloadAfterware = afterwareMap[action.type];

    if (payloadAfterware) payloadAfterware(dispatch, action.payload);
  };
}

export function compareObjectWithPattern(
  objectPattern: CheckObjectPattern,
  obj?: SomeObject
): boolean {
  if (!obj) return false;

  for (const prop in objectPattern) {
    const value = objectPattern[prop];

    if (isFunction(value)) {
      if (!value(obj[prop])) return false;
    } else if (obj[prop] !== value) {
      return false;
    }
  }

  return true;
}

export function isActionHave(
  { type, payload }: Action,
  someType: string,
  checkPattern: CheckObjectPattern
): boolean {
  if (type === someType) {
    return compareObjectWithPattern(checkPattern, payload);
  }

  return false;
}
