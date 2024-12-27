import { Query, QueryOptions, UniqKey, Variables } from '../types'
import { createMessage } from '../utils'

export const MODULE_NAME = 'QueryStore'

export type QueryStoreOptions = {
  ttl?: number
}

export type QueryStoreDefaultOptions = QueryStoreOptions & typeof DEFAULT_OPTIONS

export type QueryState = QueryStoreDefaultOptions &
  Pick<QueryOptions, 'retry' | 'retryDelay'> & {
    query?: Query
    variables?: Variables
    data?: unknown
    error?: Error
    timestamp?: number
    abortController?: AbortController
    promise?: Promise<any>
    errorCount: number
    retryCount?: number
    errorCountDelay?: number
  }

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

export class QueryStore {
  options: QueryStoreDefaultOptions

  states = new Map<string, QueryState>()

  constructor(options: QueryStoreOptions = DEFAULT_OPTIONS) {
    this.options = mergeDefaultOptions(options)
  }

  // has(cacheKey: UniqKey) {
  //   return !!this.get(cacheKey)
  // }

  setLoading(
    cacheKey: UniqKey,
    setState: (
      state: QueryState,
    ) => Pick<QueryState, 'query' | 'promise' | 'variables' | 'abortController'>,
  ) {
    // const currentState = this.states.get(cacheKey) || { ...this.options }

    // return this.states.set(cacheKey, { ...currentState, ...setState(currentState) })
    return this.updateState(cacheKey, setState, { ...this.options } as any)
  }

  updateState(
    cacheKey: UniqKey,
    setState: (state: QueryState) => Partial<QueryState> | undefined,
    defaultState?: QueryState,
  ) {
    const currentState = this.states.get(cacheKey) || defaultState

    if (!currentState) throw new Error(createMessage(MODULE_NAME, 'current state not found'))

    const nextState = { ...currentState, ...setState(currentState) }

    this.states.set(cacheKey, nextState)

    return nextState
  }

  setSuccess(
    cacheKey: UniqKey,
    setState: (
      state: QueryState,
    ) => Pick<QueryState, 'data' | 'abortController' | 'promise'> | undefined,
  ) {
    return this.updateState(cacheKey, state => ({ ...setState(state), timestamp: Date.now() }))
  }

  setError(
    cacheKey: UniqKey,
    setState: (
      state: QueryState,
    ) => Pick<QueryState, 'error' | 'abortController' | 'promise' | 'retryDelay'> | undefined,
  ) {
    return this.updateState(cacheKey, state => ({ ...setState(state), timestamp: Date.now() }))
  }

  setCancel(
    cacheKey: UniqKey,
    setState: (
      state: QueryState,
    ) => Pick<QueryState, 'abortController' | 'promise' | 'retry'> | undefined,
  ) {
    return this.updateState(cacheKey, setState)
  }

  get(cacheKey: UniqKey) {
    const state = this.states.get(cacheKey)

    if (
      state &&
      !this.isPending(cacheKey) &&
      !this.isRetrying(cacheKey) &&
      this.isStale(cacheKey)
    ) {
      this.states.delete(cacheKey)

      return
    }

    return state

    // const state = this.isStaleState(cacheKey)

    // if (state) {
    //   this.updateState(cacheKey, {
    //     ...state,
    //     data: undefined,
    //     error: undefined,
    //     timestamp: undefined,
    //     abortController: undefined,
    //     promise: undefined,
    //   })

    //   return
    // }

    // return this.states.get(cacheKey)
  }

  isStale(cacheKey: UniqKey) {
    const state = this.states.get(cacheKey)

    if (state?.timestamp && Date.now() - state.timestamp > state.ttl) {
      return state
    }
  }

  isPending(cacheKey: UniqKey) {
    const state = this.states.get(cacheKey)

    if (state?.abortController) {
      return state
    }
  }

  isRetrying(cacheKey: UniqKey) {
    const state = this.states.get(cacheKey)

    if (state?.retryCount && state?.errorCountDelay) {
      return state
    }
  }

  tryRetrying(cacheKey: UniqKey) {
    const state = this.isRetrying(cacheKey)

    if (state) {
      this.updateState(cacheKey, ({ errorCount, retry, retryCount, retryDelay, error }) => {
        if (error) {
          const nextErrorCount = errorCount + 1

          if (retryCount !== undefined && nextErrorCount > retryCount) {
            return {
              retryCount: undefined,
              errorCountDelay: undefined,
              errorCount: 0,
            }
          }

          if (retry && retryDelay) {
            return {
              retryCount: retry(error, nextErrorCount),
              errorCountDelay: retryDelay(error, nextErrorCount),
            }
          }
        }

        return {
          errorCount: 0,
          retryCount: undefined,
          errorCountDelay: undefined,
        }
      })

      return this.isRetrying(cacheKey)
    }
  }
}
