import action from './action'
import effect from './effect'
import { createActionTypes } from './utils'
import config from './config'
import { DecoratorValueTypedWithType, SomeAction, SomeEffect } from './types'

export function createActionAndEffect<
  P = any,
  SP = any,
  EP = { error: Error },
  LP = any,
  T = string,
>(
  actionType: T,
): [
  DecoratorValueTypedWithType<P, SomeAction<P | null>, T>,
  DecoratorValueTypedWithType<P, SomeEffect<P>, T>,
  DecoratorValueTypedWithType<SP, SomeAction<SP | null>, T>,
  DecoratorValueTypedWithType<SP, SomeEffect<SP>, T>,
  DecoratorValueTypedWithType<EP, SomeAction<EP | null>, T>,
  DecoratorValueTypedWithType<EP, SomeEffect<EP>, T>,
  DecoratorValueTypedWithType<LP, SomeAction<LP | null>, T>,
  DecoratorValueTypedWithType<LP, SomeEffect<LP>, T>,
] {
  const { type, typeSuccess, typeError, typeLoading } = createActionTypes(
    config.createActionType(actionType as unknown as string),
  )

  return [
    action<P, T>(type),
    effect<P, T>(type),
    action<SP, T>(typeSuccess),
    effect<SP, T>(typeSuccess),
    action<EP, T>(typeError),
    effect<EP, T>(typeError),
    action<LP, T>(typeLoading),
    effect<LP, T>(typeLoading),
  ]
}
