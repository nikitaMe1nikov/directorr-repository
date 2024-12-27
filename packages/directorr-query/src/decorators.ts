import {
  createActionAndEffect,
  // action,
  // effect,
  // createActionTypes,
  // config,
  // DecoratorValueTypedWithType,
  // SomeAction,
  // SomeEffect,
} from '@nimel/directorr'
import {
  NetworkStatusPayload,
  QueryCancelPayload,
  QueryPayload,
  QueryPayloadError,
  QueryPayloadLoading,
  QueryPayloadSuccess,
  WindowStatusPayload,
} from './types'

// export function createActionAndEffect<
//   P extends any,
//   SP extends any,
//   EP extends { error: Error },
//   LP extends any,
//   T extends string = string,
// >(
//   actionType: T,
// ): [
//   DecoratorValueTypedWithType<P, SomeAction<P | null>, T>,
//   DecoratorValueTypedWithType<P, SomeEffect<P>, T>,
//   DecoratorValueTypedWithType<SP, SomeAction<SP | null>, T>,
//   DecoratorValueTypedWithType<SP, SomeEffect<SP>, T>,
//   DecoratorValueTypedWithType<EP, SomeAction<EP | null>, T>,
//   DecoratorValueTypedWithType<EP, SomeEffect<EP>, T>,
//   DecoratorValueTypedWithType<LP, SomeAction<LP | null>, T>,
//   DecoratorValueTypedWithType<LP, SomeEffect<LP>, T>,
// ] {
//   const { type, typeSuccess, typeError, typeLoading } = createActionTypes(
//     config.createActionType(actionType as unknown as string),
//   )

//   return [
//     action<P, T>(type),
//     effect<P, T>(type),
//     action<SP, T>(typeSuccess),
//     effect<SP, T>(typeSuccess),
//     action<EP, T>(typeError),
//     effect<EP, T>(typeError),
//     action<LP, T>(typeLoading),
//     effect<LP, T>(typeLoading),
//   ]
// }

export const [
  actionQuery,
  effectQuery,
  actionQuerySuccess,
  effectQuerySuccess,
  actionQueryError,
  effectQueryError,
  actionQueryLoading,
  effectQueryLoading,
] = createActionAndEffect<
  QueryPayload,
  QueryPayloadSuccess,
  QueryPayloadError,
  QueryPayloadLoading,
  'QUERY'
>('QUERY')

export const [actionNetworkStatus, effectNetworkStatus] = createActionAndEffect<
  NetworkStatusPayload,
  NetworkStatusPayload,
  NetworkStatusPayload,
  NetworkStatusPayload,
  'QUERY_NETWORK'
>('QUERY_NETWORK')

export const [actionWindowStatus, effectWindowStatus] = createActionAndEffect<
  WindowStatusPayload,
  WindowStatusPayload,
  WindowStatusPayload,
  WindowStatusPayload,
  'QUERY_WINDOW'
>('QUERY_WINDOW')

export const [actionCancel, effectCancel] =
  createActionAndEffect<QueryCancelPayload>('QUERY_CANCEL')
export const [actionOptions, effectOptions] = createActionAndEffect<QueryPayload>('QUERY_OTIONS')
