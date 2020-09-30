import { Middleware as ReduxMiddleware } from 'redux';

export interface DirectorrStoreClass<I = any, O = any> {
  storeName?: string;
  storeInitOptions?: O;
  isReady?: boolean;
  isError?: boolean;
  afterware?: Afterware;
  fromJSON?: (classInstance: I) => void;
}

export interface DirectorrStoreClassConstructor<I = DirectorrStoreClass, O = any>
  extends DirectorrStoreClass<I, O> {
  new (options?: O): I;
}

export interface SomeObject {
  [key: string]: any;
}

export type SomeActionType =
  | string
  | DirectorrStoreClassConstructor<any>
  | DecoratorValueTypedForAction<any, string>;

export type ActionType = SomeActionType | SomeActionType[] | ActionType[];

export interface Action<T = string, P = any> {
  type: T;
  payload?: P;
  [extraProps: string]: any;
}

export type EffectsMap = Map<string, string[]>;

export type DispatchEffects = (action: Action) => void;

export type HydrateStoresToState = (directorr: DirectorrStores) => DirectorrStoresState;

export type MergeStateToStores = (
  state: DirectorrStoreState,
  directorrStore: DirectorrStore
) => void;

export type DispatchAction<A extends Action = Action> = <T extends A>(action: T) => T;

export type GetFunction = () => any;

export type SetFunction = (value: any) => void;

export type SomeFunction = (...args: any[]) => any;

export type BatchFunction = (f: SomeFunction) => SomeFunction;

export type CreateActionFunction = (type: string, payload?: any) => Action;

export type CreateActionTypeFunction = (actionType: ActionType) => string;

export type FindNextMiddleware = (nextIndex: number, action: Action) => any;

export type ReduxMiddlewareRunner = (action: Action) => any;

export type Next = (action: Action) => void;

export type Middleware = (action: Action, next: Next, store: DirectorrInterface) => void;

export type Afterware = (action: Action, dispatchType: DirectorrInterface['dispatchType']) => void;

export type PayloadAfterware = (
  dispatchType: DirectorrInterface['dispatchType'],
  payload: Action['payload']
) => void;

export interface AfterwareMap {
  [key: string]: PayloadAfterware;
}

export interface MiddlewareAdapterInterface {
  run(action: Action): void;
  next: any;
  middleware: ReduxMiddleware | Middleware;
}

export interface BabelDescriptor extends PropertyDescriptor {
  initializer?: SomeFunction;
}

export type Initializer = (
  initObject: any,
  value: any,
  property: string,
  ctx: any,
  ...args: any[]
) => any;

export type Decorator = (
  target: any,
  property: string,
  descriptor?: BabelDescriptor,
  ...args: any[]
) => void;

export type DecoratorValueTyped<R = any> = <T extends Record<K, R>, K extends string>(
  target: T,
  property: K,
  descriptor?: BabelDescriptor,
  ...args: any[]
) => void;

export interface DecoratorValueTypedForAction<R = any, C = any> extends DecoratorValueTyped<R> {
  type: C;
}

export type SomeAction<A = any> = (...args: any[]) => A;

export type SomeEffect<A = any> = (arg: A) => any;

export type CreateDecorator<A1 = any, A2 = any> = (arg1: A1, arg2?: A2) => Decorator;

export type CreateDecoratorOneArgOption<A1 = any> = (arg?: A1) => Decorator;

export type CreateDecoratorOneArg<A = any, D = Decorator> = (arg: A) => D;

export type CreateDecoratorValueTypedEffect<A = any> = <P = any>(
  arg: A
) => DecoratorValueTyped<SomeEffect<P>>;

export type CreateDecoratorValueTypedWithTypeAction<A = any> = <P = any>(
  arg: A
) => DecoratorValueTypedForAction<SomeAction<P | null>>;

export type CreateContext = (moduleName: string, arg1: any, arg2?: any) => any;

export type ConvertDecorator<D = any> = (decorator: D, context: any) => D;

export interface InitializerContext {
  actionType: string;
  property: string;
}

export type CheckObjectPattern = SomeObject;

export type ConvertPayloadFunction = (arg?: any) => any;

export type CheckPayloadFunc = (payload: Action['payload']) => boolean;

export type CheckPayloadPropFunc = (payload: Action['payload'], prop: string) => boolean;

export type CheckPayload = CheckObjectPattern | CheckPayloadFunc;

export type CheckStateFunc = (store: DirectorrStoreClass, payload: Action['payload']) => boolean;

export type CheckState = CheckObjectPattern | CheckPayloadFunc;

export type MessageFunc = (sourceName: string, arg?: any, errorMessage?: any) => string;

export type RunDispatcher = (args: any[], actionType: string, valueFunc: any, store: any) => any;

export type DispatchProxyAction = (
  action: Action,
  fromStore: any,
  toStore: any,
  property: string,
  actionType?: string
) => void;

export type AddDispatchAction = (
  fromStore: any,
  toStore: any,
  property: string,
  actionType?: string,
  dispatchAction?: DispatchProxyAction
) => any;

export type PayloadChecker = (
  payload: any,
  valueFunc: SomeFunction,
  args: [CheckPayload, ConvertPayloadFunction?]
) => any;

export type StateChecker = (
  payload: any,
  valueFunc: SomeFunction,
  store: any,
  args: [CheckState]
) => any;

export type ValueSetter = (initObject: any, value: any, payload: any, args: [SomeFunction]) => any;

export type Configure = (config: {
  batchFunction?: BatchFunction;
  createAction?: CreateActionFunction;
  actionTypeDivider?: string;
  createActionType?: CreateActionTypeFunction;
  dispatchEffects?: DispatchEffects;
  hydrateStoresToState?: HydrateStoresToState;
  mergeStateToStore?: MergeStateToStores;
}) => void;

export interface DirectorrStore {
  [key: string]: any;
}

export type DirectorrStores = Map<string, any>;

export type JSONLikeData = string | number | boolean | DirectorrStoreState;

export interface DirectorrStoreState {
  [key: string]: JSONLikeData;
}

export interface DirectorrStoresState {
  [key: string]: DirectorrStoreState;
}

export type Depency = symbol | SomeObject;

export interface DirectorrInterface {
  addInitState: (initStoreState: DirectorrStoresState) => void;
  addStores: (...storeClasses: DirectorrStoreClassConstructor[]) => void;
  addStore: <I extends DirectorrStore>(
    StoreConstructor: DirectorrStoreClassConstructor<I>,
    initStoreOptions?: SomeObject
  ) => I;
  removeStore: (StoreConstructor: DirectorrStoreClassConstructor) => void;
  addReduxMiddlewares: (...middlewares: ReduxMiddleware[]) => void;
  addMiddlewares: (...middlewares: Middleware[]) => void;
  dispatch: DispatchAction;
  dispatchType: (type: string, payload?: any) => Action;
  getStore: <I>(StoreConstructor: DirectorrStoreClassConstructor<I, any>) => I | undefined;
  getHydrateStoresState: () => DirectorrStoresState;
  mergeStateToStore: (storeState: DirectorrStoresState) => void;
  waitAllStoresState: (checkStoreState?: CheckStoreState) => Promise<any>;
  waitStoresState: (
    stores: DirectorrStoreClassConstructor<any>[],
    checkStoreState?: CheckStoreState
  ) => Promise<any>;
  findStoreState: (checkStoreState?: CheckStoreState) => Promise<any>;
  addStoreDependency: <I>(
    StoreConstructor: DirectorrStoreClassConstructor<any>,
    depName: Depency,
    initStoreOptions?: SomeObject
  ) => I;
  removeStoreDependency: (
    StoreConstructor: DirectorrStoreClassConstructor<any>,
    depName: Depency
  ) => void;
}

export type SubscribeHandler = (store: DirectorrStores) => void;

export type UnsubscribeHandler = () => void;

export type CheckStoreState = (someCalss: DirectorrStoreClass) => boolean;

export interface InitPayload {
  StoreConstructor: DirectorrStoreClass;
  initOptions?: any;
}
