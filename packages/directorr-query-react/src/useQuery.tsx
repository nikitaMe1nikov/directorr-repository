import { useCallback, useContext, useEffect, useState } from 'react'
// import { DirectorrContext } from '@nimel/directorr-react'
import {
  // actionQuery,
  Query,
  Variables,
  QueryOptions,
  actionQuerySuccess,
  actionQueryError,
  actionQueryLoading,
  ReturnTypeQuery,
  QueryPayload,
  QueryPayloadSuccess,
  QueryPayloadError,
} from '@nimel/directorr-query'
import isEqual from 'lodash/fp/isEqual'
// import assign from 'lodash/fp/assign'
import packageMeta from '../package.json'
import { Action, subscribeOnDirectorrStore } from '@nimel/directorr'
import { QueryStoreContext } from './context'

const DEFAULT_OPTIONS = {
  cancelWhenChangeVariables: false,
}
// const EMPTY_FUNC = () => {}

function mergeDefaultOptions(options: UseQueryOptions) {
  return options === DEFAULT_OPTIONS
    ? options
    : Object.assign(
        {},
        DEFAULT_OPTIONS,
        // { abortController: new AbortController() } as UseQueryOptions,
        options,
      )
}

type UseQueryOptions = QueryOptions & {
  networkMode?: 'online' | 'always'
  cancelWhenChangeVariables?: boolean
}

type State<Q, V extends Variables, S, E extends Error = Error> = {
  query: Q
  variables?: V
  options: UseQueryOptions
  // fetch: (variables: V, options?: UseQueryOptions) => unknown
  // refetch: () => void
  // cancel: () => void
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  isLoaded: boolean
  isStale: boolean
  // isUpdated: boolean
  needFetch: boolean
  needUpdateOptions: boolean
  data?: S
  error?: E
  // job?: () => void
}

export const useQuery = <V extends Variables, Q extends Query<any, any>>(
  query: Q,
  variables?: V | undefined,
  options: UseQueryOptions = DEFAULT_OPTIONS,
) => {
  const queryStore = useContext(QueryStoreContext)

  if (!queryStore)
    throw new Error(
      `${packageMeta.name}: not found react context=QueryStoreContext, probably forgotten QueryStoreProvider`,
    )

  const [state, setState] = useState<State<Q, V, ReturnTypeQuery<V, Q>>>(
    () =>
      ({
        query,
        variables,
        options: mergeDefaultOptions(options),
        isSuccess: false,
        isError: false,
        isLoaded: false,
        isStale: false,
        isLoading: !!variables,
        needFetch: false,
        needUpdateOptions: false,
        // isUpdated: false,
        // cancel: (reason?: string) =>
        //   queryStore.cancelQuery({
        //     query: state.query,
        //     variables: state.variables,
        //     options: state.options,
        //     cancel: { reason },
        //   }),
        // refetch: () =>
        //   queryStore.fetchQuery({
        //     query: state.query,
        //     variables: state.variables,
        //     options: state.options,
        //   }),
        // fetch: (variables: V, options: UseQueryOptions = DEFAULT_OPTIONS) =>
        //   setState(prev => ({
        //     ...prev,
        //     variables,
        //     options: { ...prev.options, ...mergeDefaultOptions(options) },
        //   })),
      } as any),
  )

  const cancel = useCallback(
    (reason?: string) =>
      queryStore.cancelQuery({
        query: state.query,
        variables: state.variables,
        options: state.options,
        cancel: { reason },
      }),
    [queryStore, state],
  )

  const refetch = useCallback(
    () =>
      queryStore.fetchQuery({
        query: state.query,
        variables: state.variables,
        options: state.options,
      }),
    [queryStore, state],
  )

  const fetch = useCallback(
    (variables: V, options: UseQueryOptions = DEFAULT_OPTIONS) =>
      setState(prev => ({
        ...prev,
        variables,
        options: { ...prev.options, ...mergeDefaultOptions(options) },
      })),
    [],
  )

  // const fetchQuery = useCallback(() => {
  //   const { query, variables, options } = state

  //   if (variables !== undefined) {
  //     if (options.cancelWhenChangeVariables) {
  //       cancel()
  //     }
  //     // const { signal, abort } = options.abortController || new AbortController()
  //     // const newOptions = { ...options, signal }
  //     // setState(prev => ({
  //     //   ...prev,
  //     //   cancel: abort,
  //     //   options: newOptions,
  //     // }))

  //     queryStore.fetchQuery({ query, variables, options })
  //   }
  // }, [cancel, state])

  useEffect(() => {
    if (!isEqual(variables, state.variables)) {
      setState(prev => ({
        ...prev,
        variables,
        options: { ...prev.options, ...mergeDefaultOptions(options) },
        needFetch: variables !== undefined,
      }))
    }
  }, [variables])

  useEffect(() => {
    if (!isEqual(options, state.options)) {
      setState(prev => ({
        ...prev,
        options: { ...state.options, ...mergeDefaultOptions(options) },
        needUpdateOptions: true,
      }))
    }
  }, [options])

  // useEffect(() => {
  //   if (query !== state.query) {
  //     setState(prev => ({
  //       ...prev,
  //       query,
  //     }))
  //   }
  // }, [query])

  useEffect(() => {
    const { query, variables } = state

    return subscribeOnDirectorrStore(
      queryStore,
      ({
        payload,
        type,
      }: Action<string, QueryPayload & QueryPayloadSuccess & QueryPayloadError>) => {
        if (payload?.query === query && isEqual(payload?.variables, variables)) {
          switch (type) {
            case actionQueryLoading.type:
              return setState(prev => ({
                ...prev,
                isLoading: true,
                isStale: prev.isLoaded,
                isSuccess: false,
                isError: false,
              }))
            case actionQuerySuccess.type:
              return setState(prev => ({
                ...prev,
                isLoading: false,
                isLoaded: true,
                isStale: false,
                isSuccess: true,
                isError: false,
                data: payload.data,
              }))
            case actionQueryError.type:
              return setState(prev => ({
                ...prev,
                isLoading: false,
                isLoaded: true,
                isStale: false,
                isSuccess: false,
                isError: true,
                error: payload.error,
              }))
          }
        }
      },
    )
  }, [queryStore, state])

  useEffect(() => {
    const { query, variables, options, needFetch, needUpdateOptions } = state

    if (needFetch && needUpdateOptions) {
      if (options.cancelWhenChangeVariables) {
        cancel()
      }
      // const { signal, abort } = options.abortController || new AbortController()
      // const newOptions = { ...options, signal }
      // setState(prev => ({
      //   ...prev,
      //   cancel: abort,
      //   options: newOptions,
      // }))

      queryStore.fetchQuery({ query, variables, options })

      setState(prev => ({ ...prev, needFetch: false, needUpdateOptions: false }))
    } else if (needUpdateOptions) {
      queryStore.setQueryOptions({ query, variables, options })

      setState(prev => ({ ...prev, needFetch: false, needUpdateOptions: false }))
    }
  }, [queryStore, state, cancel])

  // useEffect(() => {
  //   const { query, variables, options } = state

  //   if (variables !== undefined && isEqual(variables, state.variables)) {
  //     queryStore.setQueryOptions({ query, variables, options })
  //   }
  // }, [queryStore, state.options])

  return { ...state, cancel, refetch, fetch }
}
