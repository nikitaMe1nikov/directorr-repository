import { Directorr } from '@nimel/directorr'
import { createUniqKey } from './utils'
import { actionQuery } from './decorators'
import { Query, QueryOptions, ReturnTypeQuery, UniqKey } from './types'

export type Callbacks = { resolve: any; reject: any }

export type QueryRunnerOptions = {
  dispatch: Directorr['dispatch']
}

export class QueryRunner {
  dispatch: Directorr['dispatch']

  constructor({ dispatch }: QueryRunnerOptions) {
    this.dispatch = dispatch
  }

  runnerMap = new Map<string, Callbacks>()

  resolve(uniqKey: UniqKey, data: any) {
    const runners = this.runnerMap.get(uniqKey)

    if (runners) runners.resolve(data)

    this.removeQuery(uniqKey)
  }

  reject(uniqKey: UniqKey, error: any) {
    const runners = this.runnerMap.get(uniqKey)

    if (runners) runners.resolve(error)

    this.removeQuery(uniqKey)
  }

  private removeQuery(uniqKey: UniqKey) {
    return this.runnerMap.delete(uniqKey)
  }

  runQuery = <
    Q extends Query,
    V extends Parameters<Q>[0]['variables'] = Parameters<Q>[0]['variables'],
    R = ReturnTypeQuery<Q>,
  >(
    query: Q,
    variables?: V,
    options?: QueryOptions,
  ): Promise<R> => {
    const key = createUniqKey([query.name, variables])
    let resolve: any
    let reject: any
    // eslint-disable-next-line promise/param-names
    const promise = new Promise<R>((res, rej) => {
      resolve = res
      reject = rej
    })

    this.runnerMap.set(key, { resolve, reject })

    this.dispatch(actionQuery.createAction({ query, variables, options }))

    return promise
  }
}
