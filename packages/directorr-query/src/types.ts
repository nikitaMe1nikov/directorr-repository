export type QueryOptionsInStore = {
  // pollingInterval?: number
  ttl: number
  // cancel?: { reason?: string }
  // networkMode: 'online' | 'always' | 'offlineFirst'

  // the query will be retried on mount if it contains an error
  getStatus: (
    state: QueryState,
    network: NetworkStatusPayload['status'],
    focus: WindowStatusPayload['status'],
  ) => QueryStatus

  retry: (state: QueryState) => number
  retryDelay: (state: QueryState) => number
}

export type QueryState<Q extends Query = Query> = {
  query?: Q
  variables?: VariablesFromQuery<Q>
  data?: ReturnTypeQuery<Q>
  error?: Error
  options: QueryOptionsInStore
  timestamp?: number
  abortController?: AbortController
  promise?: Promise<ReturnTypeQuery<Q>>
  errorCount: number
  // retryCount?: number
  errorCountDelay?: number
  status: QueryStatus
}

export type ReturnPromiseType<T> = T extends PromiseLike<infer U> ? U : T

export type Key = (string | number | Record<string, string | number> | any)[]
export type UniqKey = string

export type Variables = any

export type QueryArg<V extends Variables = Variables> = {
  variables: V
  runQuery: RunQuery<Query>
  signal: AbortSignal
}

export type Query<V extends Variables = Variables, R = any> = ({
  variables,
  runQuery,
}: QueryArg<V>) => Promise<R> | R

export type VariablesFromQuery<Q extends Query> = Parameters<Q>[0]['variables']

export type RunQuery<
  Q extends Query,
  V extends Parameters<Q>[0]['variables'] = Parameters<Q>[0]['variables'],
  R = ReturnTypeQuery<V, Q>,
> = (query: Q, variables?: V, options?: QueryOptions) => Promise<R>

export type ReturnTypeQuery<V extends Variables, Q extends Query<V> = Query<V>> = ReturnPromiseType<
  ReturnType<Q>
>

export type QueryOptions = Partial<QueryOptionsInStore>

// export type FetchStatus = 'fetching' | 'paused' | 'idle'

// export type NetworkStatus = 'online' | 'always' | 'offlineFirst'

export type QueryStatus = 'loading' | 'paused' | 'success' | 'error' | 'idle'

export interface QueryPayload<Q extends Query = Query, V = any> {
  query: Q
  variables?: V
  options: QueryOptions
}

export interface QueryPayloadLoading<Q extends Query = Query, V = any> extends QueryPayload<Q, V> {
  status: QueryStatus
}

export interface QueryPayloadSuccess<Q extends Query = Query, V = any>
  extends QueryPayloadLoading<Q, V> {
  data: ReturnPromiseType<ReturnType<Q>>
}

export interface QueryPayloadError<Q extends Query = Query, V = any>
  extends QueryPayloadLoading<Q, V> {
  error: Error
}

export interface NetworkStatusPayload {
  status: boolean
}

export interface WindowStatusPayload {
  status: boolean
}

export type QueryCancelPayload = QueryPayload & {
  cancel: { reason?: string }
}

export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property]
}
