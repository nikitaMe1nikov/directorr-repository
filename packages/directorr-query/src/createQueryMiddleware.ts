import { Action, Next, Middleware, DirectorrInterface } from '@nimel/directorr'
import { actionQuery, actionQueryError, actionQueryLoading, actionQuerySuccess } from './decorators'
import { QueryCache, QueryCacheOptions } from './QueryCache'
import { QueryQueue } from './QueryQueue'
import { QueryRunner } from './QueryRunner'
import { createUniqKey } from './utils'

export type CreateQueryMiddlewareOptions = QueryCacheOptions

export function createQueryMiddleware(
  createOptions: CreateQueryMiddlewareOptions = {},
): Middleware<Action> {
  const cache = new QueryCache(createOptions)
  const queue = new QueryQueue()
  let runner: QueryRunner

  return async function queryMiddleware(
    action: Action,
    next: Next,
    { dispatch }: DirectorrInterface,
  ) {
    next(action)

    if (actionQuery.isAction(action)) {
      if (!runner) runner = new QueryRunner({ dispatch })

      const {
        payload: { query, variables, options },
      } = action

      const key = createUniqKey([query.name, variables])
      const isPending = queue.has(key)

      if (isPending) {
        dispatch(actionQueryLoading.createAction({ query, variables, options }))

        return
      }

      if (cache.has(key)) {
        const data = cache.get(key)

        if (data) {
          if (data instanceof Error)
            return dispatch(
              actionQueryError.createAction({ query, variables, error: data, options }),
            )

          return dispatch(actionQuerySuccess.createAction({ query, variables, data, options }))
        }
      }

      queue.setPending(key)
      dispatch(actionQueryLoading.createAction({ query, variables, options }))

      try {
        const data = await query({ variables, runQuery: runner.runQuery })
        queue.removePending(key)
        dispatch(actionQuerySuccess.createAction({ query, variables, data, options }))
        cache.set(key, data)
        runner.resolve(key, data)
      } catch (error: any) {
        queue.removePending(key)
        dispatch(actionQueryError.createAction({ query, variables, error, options }))
        cache.set(key, error)
        runner.reject(key, error)
      }
    }
  }
}
