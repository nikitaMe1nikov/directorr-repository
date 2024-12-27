import {
  actionNetworkStatus,
  actionQuery,
  actionQueryError,
  actionQueryLoading,
  actionQuerySuccess,
} from '../decorators'
import { EventEmitter } from 'tseep'
import {
  Query,
  QueryOptions,
  // ReturnTypeQuery,
  // RunQuery,
  // UniqKey,
  Variables,
  // WithRequiredProperty,
} from '../types'
// import { createMessage, createUniqKey } from './utils'

export const MODULE_NAME = 'QueryStore'

export const EMPTY_FUNC = () => undefined

export type QueryStoreOptions = {
  ttl?: number
}

export type QueryStoreDefaultOptions = QueryStoreOptions & typeof DEFAULT_OPTIONS

export type QueryState = QueryStoreDefaultOptions & {
  query?: Query
  variables?: Variables
  data?: unknown
  error?: Error
  options: QueryOptions
  timestamp?: number
  abortController?: AbortController
  promise?: Promise<any>
  // resolve?: PromiseConstructor['resolve']
  // reject?: PromiseConstructor['reject']
  errorCount: number
  retryCount?: number
  errorCountDelay?: number
}

export type SetState<RS> = (state: QueryState) => RS | undefined
// export const DEFAULT_TTL = 0
// export const DEFAULT_STATE: Partial<QueryState> = {
//   ttl: 0,
// }
export const DEFAULT_OPTIONS = {
  ttl: 0,
  errorCount: 0,
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

export function mergeDefaultOptions(options: QueryStoreOptions): QueryStoreDefaultOptions {
  if (!options) return DEFAULT_OPTIONS

  if (options === DEFAULT_OPTIONS) return options as typeof DEFAULT_OPTIONS

  return Object.assign(
    {},
    DEFAULT_OPTIONS,
    // { abortController: new AbortController() } as UseQueryOptions,
    options,
  )
}

export type EventsMap = {
  [actionQuery.type]: (payload: typeof actionQuery.payloadType) => void
  [actionQuerySuccess.type]: (payload: typeof actionQuerySuccess.payloadType) => void
  [actionQueryError.type]: (payload: typeof actionQueryError.payloadType) => void
  [actionQueryLoading.type]: (payload: typeof actionQueryLoading.payloadType) => void
  [actionNetworkStatus.type]: (payload: typeof actionNetworkStatus.payloadType) => void
}

export class QueryStore extends EventEmitter<EventsMap> {
  options: QueryStoreDefaultOptions

  states = new Map<string, QueryState>()

  // constructor(options: QueryStoreOptions = DEFAULT_OPTIONS) {
  //   super()
  //   this.options = mergeDefaultOptions(options)
  //   this.addListener(actionQuery.type, this.handleQuery)
  // }

  // handleQuery: EventsMap[typeof actionQuery.type] = payload => {
  //   void this.runQuery(payload)
  // }

  // runQuery = ({ query, variables, options }: typeof actionQuery.payload) => {
  //   const { cancel, retry, retryDelay, retryOnError } = options
  //   const key = createUniqKey([query.name, variables])

  //   const isPendingState = this.isPending(key)

  //   if (isPendingState) {
  //     if (cancel) {
  //       if (isPendingState?.abortController) {
  //         isPendingState.abortController.abort(cancel.reason)

  //         this.setCancel(key)

  //         return isPendingState.promise
  //       }

  //       return isPendingState.promise
  //     }

  //     this.emit(actionQueryLoading.type, { query, variables, options })

  //     return isPendingState.promise
  //   }

  //   const currentState = this.get(key)

  //   if (retryOnError && currentState && !currentState.error && currentState.promise) {
  //     return currentState.promise
  //   }

  //   const abortController = new AbortController()

  //   const promise = Promise.all([
  //     query({
  //       variables,
  //       runQuery: this.runQuery as any,
  //       signal: abortController.signal,
  //     }),
  //   ])
  //     .then(this.querySuccess(key))
  //     .catch(this.queryError(key))

  //   this.setLoading(key, { abortController, promise, query, variables, options })
  //   this.emit(actionQueryLoading.type, { query, variables, options })

  //   return promise
  // }

  // querySuccess =
  //   (key: string) =>
  //   ([data]: [unknown]) => {
  //     const { query, variables, options, errorCount } = this.setSuccess(key, { data })
  //     this.emit(actionQuerySuccess.type, {
  //       query,
  //       variables,
  //       data,
  //       options,
  //       status: { errorCount },
  //     })

  //     return data
  //   }

  // queryError =
  //   (key: string) =>
  //   ([error]: [Error]) => {
  //     const { query, variables, options, errorCount } = this.setError(key, { error })
  //     this.emit(actionQueryError.type, {
  //       query,
  //       variables,
  //       error,
  //       options,
  //       status: { errorCount },
  //     })

  //     throw error
  //   }

  // setLoading(
  //   cacheKey: UniqKey,
  //   newState: Pick<QueryState, 'query' | 'promise' | 'variables' | 'abortController' | 'options'>,
  // ) {
  //   // const currentState = this.states.get(cacheKey) || { ...this.options }

  //   // return this.states.set(cacheKey, { ...currentState, ...setState(currentState) })
  //   return this.updateState(cacheKey, () => ({ ...newState }), { ...this.options })
  // }

  // updateState(
  //   cacheKey: UniqKey,
  //   setState: (state: QueryState) => Partial<QueryState> | undefined,
  //   defaultState?: QueryState,
  // ) {
  //   const currentState = this.states.get(cacheKey) || defaultState

  //   if (!currentState) throw new Error(createMessage(MODULE_NAME, 'current state not found'))

  //   const nextState = { ...currentState, ...setState(currentState) }

  //   this.states.set(cacheKey, nextState)

  //   return nextState
  // }

  // setSuccess(cacheKey: UniqKey, newState: Pick<QueryState, 'data'> = {}) {
  //   return this.updateState(cacheKey, () => ({
  //     ...newState,
  //     timestamp: Date.now(),
  //     promise: undefined,
  //     abortController: undefined,
  //   })) as WithRequiredProperty<QueryState, 'data' | 'query' | 'variables'>
  // }

  // setError(cacheKey: UniqKey, newState: Pick<QueryState, 'error'>) {
  //   return this.updateState(cacheKey, () => ({
  //     ...newState,
  //     timestamp: Date.now(),
  //     promise: undefined,
  //     abortController: undefined,
  //   })) as WithRequiredProperty<QueryState, 'error' | 'query' | 'variables'>
  // }

  // setCancel(cacheKey: UniqKey, newState: Pick<QueryState, 'abortController' | 'promise'> = {}) {
  //   return this.updateState(cacheKey, () => ({
  //     promise: undefined,
  //     abortController: undefined,
  //     retry: undefined,
  //     retryDelay: undefined,
  //     ...newState,
  //   }))
  // }

  // get(cacheKey: UniqKey) {
  //   const state = this.states.get(cacheKey)

  //   if (
  //     state &&
  //     !this.isPending(cacheKey) &&
  //     !this.isRetrying(cacheKey) &&
  //     this.isStale(cacheKey)
  //   ) {
  //     this.states.delete(cacheKey)

  //     return
  //   }

  //   return state
  // }

  // isStale(cacheKey: UniqKey) {
  //   const state = this.states.get(cacheKey)

  //   if (state?.timestamp && Date.now() - state.timestamp > state.ttl) {
  //     return state
  //   }
  // }

  // isPending(cacheKey: UniqKey) {
  //   const state = this.states.get(cacheKey)

  //   if (state?.abortController) {
  //     return state as WithRequiredProperty<QueryState, 'promise'>
  //   }
  // }

  // isRetrying(cacheKey: UniqKey) {
  //   const state = this.states.get(cacheKey)

  //   if (state?.retryCount && state?.errorCountDelay) {
  //     return state
  //   }
  // }

  // tryRetrying(cacheKey: UniqKey) {
  //   const state = this.isRetrying(cacheKey)

  //   if (state) {
  //     this.updateState(cacheKey, ({ errorCount, retry, retryCount, retryDelay, error }) => {
  //       if (error) {
  //         const nextErrorCount = errorCount + 1

  //         if (retryCount !== undefined && nextErrorCount > retryCount) {
  //           return {
  //             retryCount: undefined,
  //             errorCountDelay: undefined,
  //             errorCount: 0,
  //           }
  //         }

  //         if (retry && retryDelay) {
  //           return {
  //             retryCount: retry(error, nextErrorCount),
  //             errorCountDelay: retryDelay(error, nextErrorCount),
  //           }
  //         }
  //       }

  //       return {
  //         errorCount: 0,
  //         retryCount: undefined,
  //         errorCountDelay: undefined,
  //       }
  //     })

  //     return this.isRetrying(cacheKey)
  //   }
  // }
}
