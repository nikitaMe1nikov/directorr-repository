import action from './action'
import effect from './effect'
import { createActionTypes } from '../Directorr/directorrUtils'
import config from '../config'
import { DecoratorValueTypedWithType, SomeAction, SomeEffect } from '../types'

export function createActionAndEffect<
  P = any,
  SP = any,
  EP = { error: Error },
  LP = any,
  T extends string = string,
>(
  actionType: T,
): [
  DecoratorValueTypedWithType<P, SomeAction<P | null>, T>,
  DecoratorValueTypedWithType<P, SomeEffect<P>, T>,
  DecoratorValueTypedWithType<SP, SomeAction<SP | null>, `${T}_SUCCESS`>,
  DecoratorValueTypedWithType<SP, SomeEffect<SP>, `${T}_SUCCESS`>,
  DecoratorValueTypedWithType<EP, SomeAction<EP | null>, `${T}_ERROR`>,
  DecoratorValueTypedWithType<EP, SomeEffect<EP>, `${T}_ERROR`>,
  DecoratorValueTypedWithType<LP, SomeAction<LP | null>, `${T}_LOADING`>,
  DecoratorValueTypedWithType<LP, SomeEffect<LP>, `${T}_LOADING`>,
] {
  const [type, typeSuccess, typeError, typeLoading] = createActionTypes<T>(
    config.createActionType(actionType) as T,
  )

  return [
    action<P, typeof type>(type),
    effect<P, typeof type>(type),
    action<SP, typeof typeSuccess>(typeSuccess),
    effect<SP, typeof typeSuccess>(typeSuccess),
    action<EP, typeof typeError>(typeError),
    effect<EP, typeof typeError>(typeError),
    action<LP, typeof typeLoading>(typeLoading),
    effect<LP, typeof typeLoading>(typeLoading),
  ]
}

export default createActionAndEffect

// const [actionD, effectD, actonS] = createActionAndEffect<
//   { some: '1' },
//   { some: '1' },
//   { some: '1' },
//   { some: '1' },
//   'some1'
// >('some1')
// const t = actionD.type
// const d = effectD.payload
// const ts = actonS.type

// function foo<A extends string, B extends number>(x: A): A {
//   return x
// }

// const test0 = foo('word')
// `A` inferred : ['e', 2, true, {f: ['g']}]
// const act = {}

// if (actionD.isAction(act)) {
//   act.payload.
// }
