import { Middleware as ReduxMiddleware } from 'redux'

export type Resolver<T = any> = (value: T | PromiseLike<T>) => void
export type Rejector = (reason?: any) => void
export type WhenCancel = (callback: () => void) => void
export type Executor<T = any> = (
  resolve: Resolver<T>,
  reject: Rejector,
  whenCancel: WhenCancel,
) => void
export interface PromiseCancelable<T = any> extends Promise<T> {
  cancel: () => void
}

export interface DirectorrStoreClass {
  isStoreStateReady?: boolean | SomeFunction
  isStoreStateError?: boolean
  fromJSON?: (parsedClassInstance: any) => void
  [key: string | symbol]: any
}

export interface DirectorrStoreClassConstructor<I = DirectorrStoreClass, O = any> {
  new (options?: O): I
  storeName?: string
  storeInitOptions?: O
}

export type SomePrimitiveOrObject = string | number | boolean | SomeObject | SomeFunction

export type SomeObject = Record<string, any>

export type SomeActionType =
  | string
  | DirectorrStoreClassConstructor<any>
  | DecoratorValueTypedWithType<any, any, string>

export type ActionType = SomeActionType | SomeActionType[] | ActionType[]

export type DispatcherActionType = DecoratorValueTypedWithType<any, any, string>

export type Payload = Record<string, any>

export type Action<T = string, P extends Payload = Payload> = {
  type: T
  payload: P
  [extraProps: string]: any
}

export type EffectsMap = Map<string, (string | symbol)[]>

export type DispatchEffects = (action: Action) => void

export type HydrateStoresToState = (directorr: DirectorrStores) => DirectorrStoresState

export type MergeStateToStores = (
  state: DirectorrStoreState,
  directorrStore: DirectorrStore,
) => void

export type SetStateToStore = MergeStateToStores

export type DispatchAction<A extends Action = Action> = <T extends A>(action: T) => T

export type GetFunction = () => any

export type SetFunction = (value: any) => void

export type SomeFunction = (...args: any[]) => any

export type BatchFunction = (f: SomeFunction) => SomeFunction

export type CreateActionFunction = <T = string, P = never>(type: T, payload?: P) => Action<T, P>

export type CreateActionTypeFunction = (actionType: ActionType) => string

export type FindNextMiddleware = (nextIndex: number, action: Action) => any

export type ReduxMiddlewareRunner = (action: Action) => any

export type Next = DispatchAction

export type Middleware<A = Action> = (
  action: A,
  next: Next,
  store: DirectorrInterface,
) => unknown | Promise<unknown>

export interface MiddlewareAdapterInterface {
  run(action: Action): void
  next: any
  middleware: ReduxMiddleware | Middleware
}

export interface BabelDescriptor extends PropertyDescriptor {
  initializer?: SomeFunction
}

export type Initializer = (
  initObject: any,
  value: any,
  property: string,
  ctx: any,
  ...args: any[]
) => any

export type Decorator = (
  target: any,
  property: string,
  descriptor?: BabelDescriptor,
  ...args: any[]
) => void

export type DecoratorValueTyped<R = any> = <T extends Record<K, R>, K extends string>(
  target: T,
  property: K,
  descriptor?: BabelDescriptor,
  ...args: any[]
) => void

export interface DecoratorValueTypedWithType<
  P extends Payload = Payload,
  R extends (...args: any) => any = (...args: any) => any,
  C extends string = string,
> extends DecoratorValueTyped<R> {
  type: C
  createAction: (payload: P) => Action<C, P>
  isAction: (action: any) => action is Action<string, P>
  payloadType: P
}

export type SomeAction<A = any> = (...args: any[]) => A | Promise<A>

export type SomeEffect<A = any> = (arg: A) => any

export type CreateDecorator<A1 = any, A2 = any> = (arg1: A1, arg2?: A2) => Decorator

export type CreateDecoratorOneArgOption<A1 = any> = (arg?: A1) => Decorator

export type CreateDecoratorOneArg<A = any, D = Decorator> = (arg: A) => D

export type CreateDecoratorValueTypedEffect<A = any> = <P = any, T extends string = string>(
  arg: A,
) => DecoratorValueTypedWithType<P, SomeEffect<P>, T>

export type CreatePropertyDecoratorFactory<A1 = any, A2 = any, P = any> = (
  arg1: A1,
  arg2?: A2,
) => DecoratorValueTyped<SomeEffect<P>>

export type CreateDecoratorValueTypedWithTypeAction<A = any> = <P = any>(
  arg: A,
) => DecoratorValueTypedWithType<P, SomeAction<P | null>>

export type CreateDecoratorValueTypedWithTypeActionTwoOptions<A1 = any, A2 = any> = <
  P,
  T extends string,
>(
  arg1: A1,
  arg2?: A2,
) => DecoratorValueTypedWithType<P, SomeAction<P | null>, T>

export type CreateContext = (moduleName: string, arg1: any, arg2?: any) => any

export type ConvertDecorator<D = any> = (decorator: D, context: any) => D

export interface InitializerContext {
  actionType: string
  property: string
}

export type CheckObjectPattern = SomeObject

export type ConvertPayloadFunction = (payload: Action['payload']) => any

export type CheckPayloadFunc = (payload: Action['payload']) => boolean

export type CheckPayloadPropFunc = (payload: Action['payload'], prop: string) => boolean

export type CheckPayload = CheckObjectPattern | CheckPayloadFunc

export type CheckStateFunc = (payload: Action['payload'], store: any) => boolean

export type CheckState = CheckObjectPattern | CheckStateFunc

export type AddToPayload = (payload: Action['payload'], store: any) => any

export type MessageFunc = (sourceName: string, arg?: any, errorMessage?: any) => string

export type RunDispatcher = (
  args: any[],
  actionType: string,
  valueFunc: any,
  store: any,
  addToPayload: AddToPayload,
) => any

export type DispatchProxyAction = (
  action: Action,
  fromStore: any,
  toStore: any,
  property: string,
  actionType?: string,
) => void

export type AddDispatchAction = (
  fromStore: any,
  toStore: any,
  property: string,
  actionType?: string,
  dispatchAction?: DispatchProxyAction,
) => any

export type PayloadChecker = (
  payload: any,
  valueFunc: SomeFunction,
  args: [CheckPayload, ConvertPayloadFunction?],
) => any

export type StateChecker = (
  payload: any,
  valueFunc: SomeFunction,
  store: any,
  args: [CheckState],
) => any

export type ValueSetter = (initObject: any, value: any, payload: any, args: [SomeFunction]) => any

export type Configure = (config: {
  batchFunction?: BatchFunction
  createAction?: CreateActionFunction
  actionTypeDivider?: string
  createActionType?: CreateActionTypeFunction
  dispatchEffects?: DispatchEffects
  hydrateStoresToState?: HydrateStoresToState
  mergeStateToStore?: MergeStateToStores
  setStateToStore?: SetStateToStore
  dispatchSubscribersOnStore?: DispatchSubscribersOnStore
  subscribeOnStore?: SubscribeOnStore
  unsubscribeOnStore?: UnsubscribeOnStore
}) => void

export type DirectorrStores = Map<string, any>
export type DirectorrStore = DirectorrStoreClass

export type JSONLikeData = string | number | boolean | DirectorrStoreState

export interface DirectorrStoreState {
  [key: string]: JSONLikeData
}

export interface DirectorrStoresState {
  [key: string]: DirectorrStoreState
}

export type DepencyName = symbol | SomeObject

export interface DirectorrOptions {
  initState?: DirectorrStoresState
  context?: SomeObject
  middlewares?: Middleware[]
  stores?: DirectorrStoreClassConstructor<any>[]
}

export interface DirectorrInterface {
  stores: DirectorrStores
  addStores(storeConstructors: DirectorrStoreClassConstructor<any>[]): void
  addStore<I>(storeConstructor: DirectorrStoreClassConstructor<I>): I
  removeStore(storeConstructor: DirectorrStoreClassConstructor<any>): void
  addReduxMiddlewares: (middlewares: ReduxMiddleware[]) => void
  addMiddlewares: (middlewares: Middleware[]) => void
  removeMiddleware: (middleware: Middleware) => void
  dispatch: DispatchAction
  dispatchType: <P extends Payload>(type: string, payload?: P) => Action
  getStore<C>(StoreConstructor: DirectorrStoreClassConstructor<C>): C | undefined
  getHydrateStoresState: () => DirectorrStoresState
  mergeStateToStore: (storeState: DirectorrStoresState) => void
  setStateToStore: (storeState: DirectorrStoresState) => void
  waitAllStoresState: (checkStoreState?: CheckStoreState) => PromiseCancelable<any>
  waitStoresState: (
    stores: DirectorrStoreClassConstructor<any>[],
    checkStoreState?: CheckStoreState,
  ) => PromiseCancelable<any>
  findStoreState: (checkStoreState?: CheckStoreState) => PromiseCancelable<any>
  addStoreDependency<I>(
    StoreConstructor: DirectorrStoreClassConstructor<I>,
    depName: DepencyName,
  ): I
  removeStoreDependency(
    StoreConstructor: DirectorrStoreClassConstructor<any>,
    depName: DepencyName,
  ): void
  subscribe: (handler: SubscribeHandler) => UnsubscribeHandler
  unsubscribe: (handler: SubscribeHandler) => void
}

export type SubscribeHandler = (store: DirectorrStores, action: Action<string, any>) => void

export type UnsubscribeHandler = () => void

export type SubscribeObjectHandler = (action: Action<string, any>) => void

// export type SubscribeOnDirectorrStoreHandler = (action: Action<string, any>) => void

export type DispatchSubscribersOnStore = (action: Action) => void

export type SubscribeOnStore = (
  subscribeObjectHandler: SubscribeObjectHandler,
) => UnsubscribeOnStore

export type UnsubscribeOnStore = (subscribeObjectHandler: SubscribeObjectHandler) => void

export type CheckStoreState = (someCalss: DirectorrStoreClass) => boolean

export interface InitPayload {
  store: DirectorrStoreClass
}
