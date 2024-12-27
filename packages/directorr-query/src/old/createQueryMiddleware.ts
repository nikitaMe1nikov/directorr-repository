import { Action, Next, Middleware, DirectorrInterface } from '@nimel/directorr'
import {
  actionNetworkStatus,
  actionQuery,
  actionQueryError,
  actionQueryLoading,
  actionQuerySuccess,
} from './decorators'
import { QueryStore, QueryStoreOptions } from './QueryStoreOld'
// import { QueryQueue } from './QueryQueue'
import isFunction from 'lodash/fp/isFunction'
// import { QueryRunner } from './QueryRunnerOld'
import { createUniqKey } from './utils'
import { NetworkStatus } from './NetworkStatus'
import { QueryRunner } from './old/QueryRunnerOld'

export type CreateQueryMiddlewareOptions = QueryStoreOptions

export function createQueryMiddleware(
  createOptions: CreateQueryMiddlewareOptions = {},
): Middleware<Action> {
  const store = new QueryStore(createOptions)
  const networkStatus = new NetworkStatus()
  let runner: QueryRunner

  return function queryMiddleware(action: Action, next: Next, { dispatch }: DirectorrInterface) {
    if (!runner) {
      runner = new QueryRunner({ dispatch })
      networkStatus.addEventListener(status =>
        dispatch(actionNetworkStatus.createAction({ status })),
      )
    }

    next(action)

    if (actionQuery.isAction(action)) {
      const {
        payload: { query, variables, options },
      } = action
      const { cancel, retry, retryDelay, retryOnError } = options
      const key = createUniqKey([query.name, variables])

      const isPendingState = store.isPending(key)

      if (isPendingState) {
        if (cancel) {
          if (isPendingState?.abortController) {
            isPendingState.abortController.abort(cancel.reason)

            return store.setCancel(key, () => ({
              promise: undefined,
              abortController: undefined,
              retry: undefined,
            }))
          }

          return
        }

        return dispatch(actionQueryLoading.createAction({ query, variables, options }))
      }

      const currentState = store.get(key)

      if (currentState && retry && retryOnError && !currentState.error) {
        return
      }

      // const lastState = store.get(key)

      // if (lastState) {
      //   if (retry) {
      //     if ()
      //   }
      //   // if (lastSata) {
      //   //   if (lastSata instanceof Error)
      //   //     return dispatch(
      //   //       actionQueryError.createAction({ query, variables, error: data, options }),
      //   //     )
      //   //   return dispatch(actionQuerySuccess.createAction({ query, variables, data, options }))
      //   // }
      // }

      // queue.setPending(key)
      const abortController = new AbortController()

      const promise = Promise.all([
        query({
          variables,
          runQuery: runner.runQuery,
          signal: abortController.signal,
        }),
      ])
        .then(([data]: unknown[]) => {
          store.setSuccess(key, () => ({ data, promise: undefined, abortController: undefined }))
          dispatch(actionQuerySuccess.createAction({ query, variables, data, options }))
          runner.resolve(key, data)
        })
        .catch(([error]: Error[]) => {
          store.setError(key, () => ({ error, promise: undefined, abortController: undefined }))
          dispatch(actionQueryError.createAction({ query, variables, error, options }))
          runner.reject(key, error)

          const retryingState = store.tryRetrying(key)

          // if (retryingState && retryingState.errorCountDelay) {
          //   setTimeout(retryingState.errorCountDelay, () => )
          // }
        })

      store.setLoading(key, () => ({ abortController, promise, query, variables, ...options }))
      dispatch(actionQueryLoading.createAction({ query, variables, options }))

      // try {
      //   const data = await query({ variables, runQuery: runner.runQuery })
      //   queue.removePending(key)
      //   dispatch(actionQuerySuccess.createAction({ query, variables, data, options }))
      //   store.set(key, data)
      //   runner.resolve(key, data)
      // } catch (error: any) {
      //   queue.removePending(key)
      //   dispatch(actionQueryError.createAction({ query, variables, error, options }))
      //   store.set(key, error)
      //   runner.reject(key, error)
      // }
    }
  }
}
