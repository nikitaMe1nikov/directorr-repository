import { Middleware as ReduxMiddleware } from 'redux';
import { IModelType, Instance, IStateTreeNode, IAnyType } from 'mobx-state-tree';

export type MSTInstance<T> = Instance<T>;
export type AnyMSTModelType = IModelType<
  {
    [key: string]: IAnyType;
  },
  {
    [key: string]: any;
  }
>;
export type MTSStateTreeNode = IStateTreeNode;
export type Resolver<T = any> = (value?: T | PromiseLike<T>) => void;
export type Rejector = (reason?: any) => void;
export type WhenCancel = (callback: () => void) => void;
export type Executor<T = any> = (
  resolve: Resolver<T>,
  reject: Rejector,
  whenCancel: WhenCancel
) => void;
export interface PromiseCancelable<T = any> extends Promise<T> {
  cancel: () => void;
}

export interface DirectorrStoreClass {
  isReady?: boolean | SomeFunction;
  isError?: boolean;
  fromJSON?: (parsedClassInstance: any) => void;
  [key: string]: any;
}

export interface DirectorrStoreClassConstructor<I = DirectorrStoreClass, O = any> {
  new (options?: O): I;
  storeName?: string;
  storeInitOptions?: O;
  afterware?: Afterware;
}

export type SomeObject = Record<string, any>;

export type SomeActionType =
  | string
  | DirectorrStoreClassConstructor<any>
  | DecoratorValueTypedWithType<any, string>
  | AnyMSTModelType;

export type ActionType = SomeActionType | SomeActionType[] | ActionType[];

export interface Action<T = string, P = any> {
  type: T;
  payload?: P;
  [extraProps: string]: any;
}

export type EffectsMap = Map<string, (string | symbol)[]>;

export type DispatchEffects = (action: Action) => void;

export type HydrateStoresToState = (directorr: DirectorrStores) => DirectorrStoresState;

export type MergeStateToStores = (
  state: DirectorrStoreState,
  directorrStore: DirectorrStore
) => void;

export type SetStateToStore = MergeStateToStores;

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

export type Afterware = (
  action: Action,
  dispatchType: DirectorrInterface['dispatchType'],
  directorr: DirectorrInterface
) => void;

export type PayloadAfterware = (
  dispatchType: DirectorrInterface['dispatchType'],
  payload: Action['payload'],
  directorr: DirectorrInterface
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

export interface DecoratorValueTypedWithType<R = any, C = any> extends DecoratorValueTyped<R> {
  type: C;
}

export type SomeAction<A = any> = (...args: any[]) => A;

export type SomeEffect<A = any> = (arg: A) => any;

export type CreateDecorator<A1 = any, A2 = any> = (arg1: A1, arg2?: A2) => Decorator;

export type CreateDecoratorOneArgOption<A1 = any> = (arg?: A1) => Decorator;

export type CreateDecoratorOneArg<A = any, D = Decorator> = (arg: A) => D;

export type CreateDecoratorValueTypedEffect<A = any> = <P = any>(
  arg: A
) => DecoratorValueTypedWithType<SomeEffect<P>>;

export type CreateDecoratorValueTypedWithEffectPayload<A1 = any, A2 = any, P = any> = (
  arg1: A1,
  arg2?: A2
) => DecoratorValueTypedWithType<SomeEffect<P>>;

export type CreateDecoratorValueTypedWithTypeAction<A = any> = <P = any>(
  arg: A
) => DecoratorValueTypedWithType<SomeAction<P | null>>;

export type CreateDecoratorValueTypedWithTypeActionTwoOptions<A1 = any, A2 = any> = <P = any>(
  arg1: A1,
  arg2?: A2
) => DecoratorValueTypedWithType<SomeAction<P | null>>;

export type CreateContext = (moduleName: string, arg1: any, arg2?: any) => any;

export type ConvertDecorator<D = any> = (decorator: D, context: any) => D;

export interface InitializerContext {
  actionType: string;
  property: string;
}

export type CheckObjectPattern = SomeObject;

export type ConvertPayloadFunction = (payload: Action['payload']) => any;

export type CheckPayloadFunc = (payload: Action['payload']) => boolean;

export type CheckPayloadPropFunc = (payload: Action['payload'], prop: string) => boolean;

export type CheckPayload = CheckObjectPattern | CheckPayloadFunc;

export type CheckStateFunc = (payload: Action['payload'], store: any) => boolean;

export type CheckState = CheckObjectPattern | CheckStateFunc;

export type AddToPayload = (payload: Action['payload'], store: any) => any;

export type MessageFunc = (sourceName: string, arg?: any, errorMessage?: any) => string;

export type RunDispatcher = (
  args: any[],
  actionType: string,
  valueFunc: any,
  store: any,
  addToPayload: AddToPayload
) => any;

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
  setStateToStore?: SetStateToStore;
}) => void;

export type DirectorrStores = Map<string, any>;
export type DirectorrStore = Instance<AnyMSTModelType> | DirectorrStoreClass;

export type JSONLikeData = string | number | boolean | DirectorrStoreState;

export interface DirectorrStoreState {
  [key: string]: JSONLikeData;
}

export interface DirectorrStoresState {
  [key: string]: DirectorrStoreState;
}

export type DepencyName = symbol | SomeObject;

export interface DirectorrOptions {
  initState?: DirectorrStoresState;
  context?: SomeObject;
}

export interface DirectorrInterface {
  addStores(models: AnyMSTModelType[]): void;
  addStores(storeConstructors: DirectorrStoreClassConstructor<any>[]): void;
  addStore<I>(storeConstructor: DirectorrStoreClassConstructor<I>): I;
  addStore<I extends AnyMSTModelType>(modelType: I): I;
  removeStore(storeConstructor: DirectorrStoreClassConstructor<any>): void;
  removeStore(modelType: AnyMSTModelType): void;
  addReduxMiddlewares: (middlewares: ReduxMiddleware[]) => void;
  addMiddlewares: (middlewares: Middleware[]) => void;
  removeMiddleware: (middleware: Middleware) => void;
  dispatch: DispatchAction;
  dispatchType: (type: string, payload?: any) => Action;
  getStore<C>(StoreConstructor: DirectorrStoreClassConstructor<C>): C | undefined;
  getStore<C extends AnyMSTModelType>(modelType: C): MSTInstance<C> | undefined;
  getStore<C>(StoreConstructor: DirectorrStoreClassConstructor<C>): C | undefined;
  getStore<C extends AnyMSTModelType>(modelType: C): MSTInstance<C> | undefined;
  getHydrateStoresState: () => DirectorrStoresState;
  mergeStateToStore: (storeState: DirectorrStoresState) => void;
  setStateToStore: (storeState: DirectorrStoresState) => void;
  waitAllStoresState: (checkStoreState?: CheckStoreState) => PromiseCancelable<any>;
  waitStoresState: (
    stores: DirectorrStoreClassConstructor<any>[],
    checkStoreState?: CheckStoreState
  ) => PromiseCancelable<any>;
  findStoreState: (checkStoreState?: CheckStoreState) => PromiseCancelable<any>;
  addStoreDependency<I>(
    StoreConstructor: DirectorrStoreClassConstructor<I>,
    depName: DepencyName
  ): I;
  addStoreDependency<I extends AnyMSTModelType>(modelType: I, depName: DepencyName): I;
  removeStoreDependency(
    StoreConstructor: DirectorrStoreClassConstructor<any>,
    depName: DepencyName
  ): void;
  removeStoreDependency(modelType: AnyMSTModelType, depName: DepencyName): void;
}

export type SubscribeHandler = (store: DirectorrStores) => void;

export type UnsubscribeHandler = () => void;

export type CheckStoreState = (someCalss: DirectorrStoreClass) => boolean;

export interface InitPayload {
  store: DirectorrStoreClass;
}
