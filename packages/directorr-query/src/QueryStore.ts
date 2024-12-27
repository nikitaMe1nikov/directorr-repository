import {
  actionCancel,
  actionOptions,
  actionQuery,
  // actionNetworkStatus,
  // actionQuery,
  actionQueryError,
  actionQueryLoading,
  actionQuerySuccess,
  effectCancel,
  effectNetworkStatus,
  effectOptions,
  // effectQuery,
  effectWindowStatus,
} from './decorators'
// import { EventEmitter } from 'tseep'
import {
  // NetworkStatusPayload,
  Query,
  QueryOptions,
  QueryOptionsInStore,
  QueryPayload,
  QueryState,
  // QueryStatus,
  ReturnTypeQuery,
  // ReturnTypeQuery,
  // RunQuery,
  UniqKey,
  VariablesFromQuery,
  // WindowStatusPayload,
  WithRequiredProperty,
} from './types'
import { createMessage, createUniqKey } from './utils'
import { connectStore, DispatchAction, injectDispatch } from '@nimel/directorr'
import merge from 'lodash/merge'
import pick from 'lodash/pick'
import { NetworkStatus } from './NetworkStatus'
import { WindowStatus } from './WindowStatus'

export const MODULE_NAME = 'QueryStore'

export const EMPTY_FUNC = () => undefined

export type QueryStoreOptions = WithRequiredProperty<QueryOptions, 'ttl'> & {
  // ttl?: number
  // errorCount?: number
}

// export type QueryOptionsInStore = {
//   // pollingInterval?: number
//   ttl: number
//   cancel?: { reason?: string }
//   // networkMode: 'online' | 'always' | 'offlineFirst'

//   // the query will be retried on mount if it contains an error
//   getStatus: (
//     state: QueryState,
//     network: NetworkStatusPayload['status'],
//     focus: WindowStatusPayload['status'],
//   ) => QueryStatus

//   retry: (state: QueryState) => number
//   retryDelay: (state: QueryState) => number
// }

// export type QueryState<Q extends Query = Query> = {
//   query?: Q
//   variables?: VariablesFromQuery<Q>
//   data?: ReturnTypeQuery<Q>
//   error?: Error
//   options: QueryOptionsInStore
//   timestamp?: number
//   abortController?: AbortController
//   promise?: Promise<ReturnTypeQuery<Q>>
//   errorCount: number
//   // retryCount?: number
//   errorCountDelay?: number
//   status: QueryStatus
// }

export type SetState<RS> = (state: QueryState) => RS | undefined

// export const DEFAULT_TTL = 0
// export const DEFAULT_STATE: Partial<QueryState> = {
//   ttl: 0,
// }
export const DEFAULT_OPTIONS: QueryOptionsInStore = {
  ttl: 1000,
  retry: ({ errorCount }) => errorCount - 3,
  retryDelay: () => 3000,
  // getStatus: ({ status }, network, focus) => {
  //   if (status !== 'loading') return status

  //   if (!network || !focus) return 'paused'

  //   return 'loading'
  // },
  getStatus: ({ status }) => status,
}

export const DEFAULT_LOADING_STATE: QueryState = {
  // ttl: 0,
  errorCount: 0,
  options: DEFAULT_OPTIONS,
  status: 'loading',
}

// export function mergeDefaultState(state?: QueryState) {
//   if (!state) return DEFAULT_STATE

//   if (state === DEFAULT_STATE) return state

//   return Object.assign(
//     {},
//     DEFAULT_STATE,
//     // { abortController: new AbortController() } as UseQueryOptions,
//     state,
//   )
// }

export function mergeDefaultOptions(options: QueryStoreOptions): QueryStoreOptions {
  if (!options) return DEFAULT_OPTIONS

  if (options === DEFAULT_OPTIONS) return options

  return merge({ ...DEFAULT_OPTIONS }, options)
}

export const DEFAULT_QUERY_OPTIONS = pick(DEFAULT_OPTIONS, 'ttl', 'retry', 'retryDelay')

// export function mergeDefaultQueryOptions(options: QueryOptions): QueryOptions {
//   if (!options) return DEFAULT_QUERY_OPTIONS

//   if (options === DEFAULT_QUERY_OPTIONS) return options

//   return Object.assign(
//     {},
//     DEFAULT_QUERY_OPTIONS,
//     // { abortController: new AbortController() } as UseQueryOptions,
//     options,
//   )
// }

// export const DEFAULT_QUERY_OPTIONS: QueryOptions = {
//   // retryOnError: true,
//   ttl: 0,
//   retry: (_, count) => count - 3,
//   retryDelay: () => 3000,
// }

// export function mergeOptionsWithQueryOptions(
//   options: QueryOptions,
//   storeOptions: QueryStoreOptions,
// ): QueryOptions {
//   // if (!options) return DEFAULT_QUERY_OPTIONS

//   // if (options === DEFAULT_QUERY_OPTIONS) return options
//   console.log('storeOptions', storeOptions)

//   return Object.assign(
//     {},
//     DEFAULT_QUERY_OPTIONS,
//     // { abortController: new AbortController() } as UseQueryOptions,
//     options,
//   )
// }

export function createQueryOptions(
  options: QueryOptions,
  { retry, retryDelay, ttl }: QueryStoreOptions,
  initOptions?: QueryOptionsInStore,
): QueryOptionsInStore {
  return merge({ retry, retryDelay, ttl }, initOptions, options)
}

// export type EventsMap = {
//   [actionQuery.type]: (payload: typeof actionQuery.payload) => void
//   [actionQuerySuccess.type]: (payload: typeof actionQuerySuccess.payload) => void
//   [actionQueryError.type]: (payload: typeof actionQueryError.payload) => void
//   [actionQueryLoading.type]: (payload: typeof actionQueryLoading.payload) => void
//   [actionNetworkStatus.type]: (payload: typeof actionNetworkStatus.payload) => void
// }

export class QueryStore {
  @connectStore()
  networkStatus = new NetworkStatus()

  @connectStore()
  windowStatus = new WindowStatus()

  options: QueryStoreOptions

  states = new Map<string, QueryState>()

  @injectDispatch
  dispatch: DispatchAction

  constructor(options: QueryStoreOptions = DEFAULT_OPTIONS) {
    // super()
    this.options = mergeDefaultOptions(options)
    // this.addListener(actionQuery.type, this.handleQuery)
  }

  @effectNetworkStatus
  @effectWindowStatus
  whenChangeStatus = ({ status }: typeof effectNetworkStatus.payloadType) => {
    for (const key of this.states.keys()) {
      if (status) {
        const pausedState = this.isPaused(key)

        if (pausedState)
          void this.runQuery(pausedState.query, pausedState.variables, pausedState.options)
      } else {
        const loadingState = this.isLoading(key)

        if (loadingState) this.setPaused(key)
      }
    }
    // if (status) {
    //   for (const state of this.states.values()) {
    //     if (state.status === 'loading') state.status = 'paused'
    //   }
    // } else {

    // }
    // console.log('rerun query')
  }

  // handleQuery: EventsMap[typeof actionQuery.type] = payload => {
  //   void this.runQuery(payload)
  // }

  private runQuery = <Q extends Query>(
    query: Q,
    variables?: VariablesFromQuery<Q>,
    options: QueryOptions = DEFAULT_QUERY_OPTIONS,
  ): Promise<ReturnTypeQuery<Q>> => {
    const key = createUniqKey(query, variables)

    // const pausingState = this.isPaused(key)

    // if (pausingState) return pausingState.promise

    const loadingState = this.isLoading(key)

    if (loadingState) {
      const { promise, status } = this.setLoading(key, { query, variables, options })

      this.dispatch(actionQueryLoading.createAction({ query, variables, options, status }))

      return promise
    }

    // if (this.isError(key))

    // const currentState = this.get(key)

    // if (retryOnError && currentState && !currentState.error && currentState.promise) {
    //   return currentState.promise
    // }

    const abortController = new AbortController()

    const promise = Promise.all([
      query({
        variables,
        runQuery: this.runQuery,
        signal: abortController.signal,
      }),
    ])
      .then(this.querySuccess(key))
      .catch(this.queryError(key))
      .finally(this.queryFinally(key))

    this.queryLoading(key, { abortController, promise, query, variables, options })

    return promise as Promise<ReturnTypeQuery<Q>>
  }

  // @actionQuery
  fetchQuery = (payload: typeof actionQuery.payloadType) => {
    this.dispatch(actionQuery.createAction(payload))

    return this.runQuery(payload.query, payload.variables, payload.options)
  }

  // @effectQuery
  // whenFetchQuery = ({ query, variables, options }: typeof effectQuery.payloadType) =>
  //   this.runQuery(query, variables, options)

  @actionCancel
  cancelQuery = (payload: typeof actionCancel.payloadType) => payload

  @effectCancel
  whenCancelQuery = ({
    query,
    variables,
    // options: { cancel },
    cancel,
  }: typeof effectCancel.payloadType) => {
    const key = createUniqKey(query, variables)
    const loadingState = this.isLoading(key)

    if (loadingState) {
      const { abortController, status } = loadingState

      if (status === 'paused') return

      abortController.abort(cancel.reason)

      this.setCancel(key)
    }
  }

  @actionOptions
  setQueryOptions = (payload: typeof actionOptions.payloadType) => payload

  @effectOptions
  whenChangeQueryOptions = ({ query, variables, options }: typeof actionOptions.payloadType) => {
    const key = createUniqKey(query, variables)

    this.changeOptions(key, { options })
  }

  private queryLoading = (key: string, state: Parameters<typeof this.setLoading>[1]) => {
    const { query, variables, options, status } = this.setLoading(key, state)

    this.dispatch(actionQueryLoading.createAction({ query, variables, options, status }))
  }

  private querySuccess = (key: string) => (newData: [unknown]) => {
    const { query, variables, options, status, data } = this.setSuccess(key, { data: newData[0] })
    this.dispatch(
      actionQuerySuccess.createAction({
        query,
        variables,
        data,
        options,
        status,
      }),
    )

    return data
  }

  private queryError = (key: string) => (newErrors: Error) => {
    // console.log('queryError', { error: newErrors })
    const { query, variables, options, status, error } = this.setError(key, { error: newErrors })
    this.dispatch(
      actionQueryError.createAction({
        query,
        variables,
        error,
        options,
        status,
      }),
    )
    // console.log('throw error', error)
    throw error
  }

  private queryFinally = (key: string) => () => {
    const retryingState = this.tryRetrying(key)

    if (retryingState) {
      const { query, variables, options, errorCountDelay } = retryingState
      setTimeout(() => this.runQuery(query, variables, options), errorCountDelay)
    }
  }

  updateState(
    cacheKey: UniqKey,
    setState: (state: QueryState) => Partial<QueryState>,
    defaultState?: QueryState,
  ) {
    const currentState = this.getState(cacheKey) || defaultState

    if (!currentState) throw new Error(createMessage(MODULE_NAME, 'current state not found'))

    const newState = setState(currentState)

    const nextState = {
      ...currentState,
      ...newState,
      options: { ...currentState.options, ...newState.options },
    }

    this.states.set(cacheKey, nextState)

    return nextState
  }

  setLoading(
    cacheKey: UniqKey,
    newState: WithRequiredProperty<
      Omit<Pick<QueryState, 'query' | 'promise' | 'variables' | 'abortController'>, 'options'>,
      'query'
    > &
      Pick<QueryPayload, 'options'>,
  ) {
    return this.updateState(
      cacheKey,
      prevState => {
        if (prevState.status === 'paused') {
          return prevState
        }

        return {
          ...newState,
          options: createQueryOptions(newState.options, this.options, prevState.options),
          status: 'loading',
        }
      },
      DEFAULT_LOADING_STATE,
    ) as WithRequiredProperty<QueryState, 'query' | 'options' | 'promise'>
  }

  changeOptions(cacheKey: UniqKey, newState: Pick<QueryPayload, 'options'>) {
    return this.updateState(cacheKey, prevState => ({
      ...newState,
      options: createQueryOptions(newState.options, this.options, prevState.options),
    })) as WithRequiredProperty<QueryState, 'options'>
  }

  setSuccess(cacheKey: UniqKey, newState: Pick<QueryState, 'data'> = {}) {
    return this.updateState(cacheKey, prevState => {
      if (prevState.status === 'paused') {
        return prevState
      }

      return {
        ...newState,
        timestamp: Date.now(),
        promise: undefined,
        abortController: undefined,
        errorCount: 0,
        status: 'success',
      }
    }) as WithRequiredProperty<QueryState, 'data' | 'query' | 'variables'>
  }

  setError(cacheKey: UniqKey, newState: Pick<QueryState, 'error'>) {
    return this.updateState(cacheKey, prevState => {
      if (prevState.status === 'paused') {
        return prevState
      }

      return {
        ...newState,
        timestamp: Date.now(),
        promise: undefined,
        abortController: undefined,
        errorCount: prevState.errorCount + 1,
        status: 'error',
      }
    }) as WithRequiredProperty<QueryState, 'error' | 'query' | 'variables'>
  }

  setCancel(cacheKey: UniqKey, newState: Pick<QueryState, 'abortController' | 'promise'> = {}) {
    return this.updateState(cacheKey, state => ({
      promise: undefined,
      abortController: undefined,
      ...newState,
      status: state.data ? 'success' : state.error ? 'error' : 'idle',
    }))
  }

  setPaused(cacheKey: UniqKey) {
    return this.updateState(cacheKey, () => ({
      status: 'paused',
    }))
  }

  getState(cacheKey: UniqKey) {
    let state = this.states.get(cacheKey)

    if (state && state.timestamp && Date.now() - state.timestamp > state.options.ttl) {
      state = {
        ...state,
        data: undefined,
        error: undefined,
        timestamp: undefined,
        status: state.status === 'success' || state.status === 'error' ? 'idle' : state.status,
      }

      this.states.set(cacheKey, state)
    }

    return state
  }

  getStatus(state?: QueryState<Query<any, any>>) {
    if (!state) return

    return state.options.getStatus(state, this.networkStatus.online, this.windowStatus.focus)
  }

  getQueryState<Q extends Query>(
    query: Q,
    variables?: VariablesFromQuery<Q>,
  ): QueryState<Q> | undefined {
    const key = createUniqKey(query, variables)

    return this.getState(key) as QueryState<Q>
  }

  isStale(cacheKey: UniqKey) {
    const state = this.getState(cacheKey)

    if (state && state.timestamp && Date.now() - state.timestamp > state.options.ttl) {
      return state
    }
  }

  isLoading(cacheKey: UniqKey) {
    const state = this.getState(cacheKey)
    const status = this.getStatus(state)

    if (status === 'loading' && state?.abortController && state?.promise) {
      return state as WithRequiredProperty<
        QueryState,
        'promise' | 'abortController' | 'query' | 'variables' | 'options'
      >
    }
  }

  isRetrying(cacheKey: UniqKey) {
    const state = this.getState(cacheKey)

    if (state?.errorCountDelay !== undefined && state?.query !== undefined) {
      return state as WithRequiredProperty<QueryState, 'query' | 'variables' | 'errorCountDelay'>
    }
  }

  tryRetrying(cacheKey: UniqKey) {
    const state = this.getState(cacheKey)

    if (state) {
      this.updateState(cacheKey, ({ errorCount, options: { retry, retryDelay } }) => {
        const retryCount = retry(state)

        if (retryCount > errorCount) {
          return {
            errorCountDelay: retryDelay(state),
          }
        }

        return {
          errorCountDelay: undefined,
        }
      })

      return this.isRetrying(cacheKey)
    }
  }

  isError(cacheKey: UniqKey) {
    const state = this.getState(cacheKey)
    const status = this.getStatus(state)

    if (status === 'error' && state?.error && state?.query !== undefined) {
      return state as WithRequiredProperty<QueryState, 'query' | 'variables' | 'error' | 'status'>
    }
  }

  isPaused(cacheKey: UniqKey) {
    const state = this.getState(cacheKey)
    const status = this.getStatus(state)

    if (status === 'paused') {
      return state as WithRequiredProperty<QueryState, 'query' | 'variables' | 'promise' | 'status'>
    }
  }

  isSuccess(cacheKey: UniqKey) {
    const state = this.getState(cacheKey)
    const status = this.getStatus(state)

    if (status === 'success' && state?.data) {
      return state as WithRequiredProperty<
        QueryState,
        'errorCount' | 'timestamp' | 'query' | 'variables' | 'options' | 'status'
      >
    }
  }

  // tryCancel(query: Query, variables: any, options) {
  //   if (cancel) {
  //     const isPendingState = this.isPending(key)

  //     if (isPendingState) {
  //       const { abortController } = isPendingState
  //       abortController.abort(cancel.reason)

  //       return this.setCancel(key)
  //     }
  //   }
  // }
}
