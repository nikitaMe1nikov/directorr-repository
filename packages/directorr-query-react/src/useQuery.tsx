import { useContext, useEffect, useState } from 'react'
import { DirectorrContext } from '@nimel/directorr-react'
import {
  actionQuery,
  Query,
  Variables,
  QueryOptions,
  actionQuerySuccess,
  actionQueryError,
  actionQueryLoading,
  ReturnTypeQuery,
} from '@nimel/directorr-query'
import isEqual from 'lodash/fp/isEqual'
import packageMeta from '../package.json'

export const DEFAULT_OPTIONS = {}

type UseQueryOptions = QueryOptions

type State<Q, V extends Variables, S, E extends Error = Error> = {
  query: Q
  variables?: V
  options?: UseQueryOptions
  fetch: (variables: V, options?: UseQueryOptions) => unknown
  refetch: (...args: unknown[]) => unknown
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  isLoaded: boolean
  isStale: boolean
  data?: S
  error?: E
}

export const useQuery = <V extends Variables, Q extends Query<V, any>>(
  query: Q,
  variables?: V,
  options: UseQueryOptions = DEFAULT_OPTIONS,
) => {
  const dir = useContext(DirectorrContext)

  if (!dir)
    throw new Error(`${packageMeta.name}: dont found directorr(@nimel/directorr-react) context`)

  const [state, setState] = useState<State<Q, V, ReturnTypeQuery<V, Q>>>(
    () =>
      ({
        query,
        variables,
        options,
        isSuccess: false,
        isError: false,
        isLoaded: false,
        isStale: false,
        isLoading: !!variables,
        refetch: () => setState(prev => ({ ...prev, options: { ...prev.options } })),
        fetch: (variables: V, options: UseQueryOptions = DEFAULT_OPTIONS) =>
          setState(prev => ({ ...prev, variables, options: { ...prev.options, ...options } })),
      } as any),
  )

  useEffect(() => {
    if (!isEqual(variables, state.variables)) {
      setState(prev => ({
        ...prev,
        variables,
      }))
    }
  }, [query])

  useEffect(() => {
    if (!isEqual(options, state.options)) {
      setState(prev => ({
        ...prev,
        options,
      }))
    }
  }, [variables])

  useEffect(() => {
    if (query !== state.query) {
      setState(prev => ({
        ...prev,
        query,
      }))
    }
  }, [options])

  useEffect(() => {
    const { query, variables } = state

    return dir.subscribe((_, { payload, type }) => {
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
    })
  }, [dir, state.query, state.variables])

  useEffect(() => {
    const { query, variables, options } = state

    if (variables !== undefined)
      dir.dispatch(actionQuery.createAction({ query, variables, options }))
  }, [dir, state.variables, state.options])

  return state
}
