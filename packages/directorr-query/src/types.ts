export type ReturnPromiseType<T> = T extends PromiseLike<infer U> ? U : T

export type Key = (string | number | Record<string, string | number> | any)[]
export type UniqKey = string

export type Variables = any

export type QueryArg<V extends Variables = Variables> = {
  variables: V
  runQuery: RunQuery<Query>
}

export type Query<V extends Variables = Variables, R = any> = ({
  variables,
  runQuery,
}: QueryArg<V>) => Promise<R> | R

export type RunQuery<
  Q extends Query,
  V extends Parameters<Q>[0]['variables'] = Parameters<Q>[0]['variables'],
  R = ReturnTypeQuery<V, Q>,
> = (query: Q, variables?: V, options?: QueryOptions) => Promise<R>

export type ReturnTypeQuery<V extends Variables, Q extends Query<V> = Query<V>> = ReturnPromiseType<
  ReturnType<Q>
>

export type QueryOptions = {
  pollingInterval?: number
}

export interface QueryPayload<Q extends Query = Query, V = any> {
  query: Q
  variables?: V
  options?: QueryOptions
}

export interface QueryPayloadSuccess<Q extends Query = Query, V = any> extends QueryPayload<Q, V> {
  data: ReturnPromiseType<ReturnType<Q>>
}

export interface QueryPayloadError<Q extends Query = Query, V = any> extends QueryPayload<Q, V> {
  error: Error
}
