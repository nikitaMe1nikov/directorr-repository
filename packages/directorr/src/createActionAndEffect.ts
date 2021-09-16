import action from './action';
import effect from './effect';
import { createActionTypes } from './utils';
import config from './config';
import { DecoratorValueTypedWithType, SomeAction, SomeEffect, ActionType } from './types';

export function createActionAndEffect<P = any, SP = any, EP = { error: Error }, LP = any>(
  actionType: ActionType
): [
  DecoratorValueTypedWithType<P, SomeAction<P | null>>,
  DecoratorValueTypedWithType<P, SomeEffect<P>>,
  DecoratorValueTypedWithType<SP, SomeAction<SP | null>>,
  DecoratorValueTypedWithType<SP, SomeEffect<SP>>,
  DecoratorValueTypedWithType<EP, SomeAction<EP | null>>,
  DecoratorValueTypedWithType<EP, SomeEffect<EP>>,
  DecoratorValueTypedWithType<LP, SomeAction<LP | null>>,
  DecoratorValueTypedWithType<LP, SomeEffect<LP>>
] {
  const { type, typeSuccess, typeError, typeLoading } = createActionTypes(
    config.createActionType(actionType)
  );

  return [
    action<P>(type),
    effect<P>(type),
    action<SP>(typeSuccess),
    effect<SP>(typeSuccess),
    action<EP>(typeError),
    effect<EP>(typeError),
    action<LP>(typeLoading),
    effect<LP>(typeLoading),
  ];
}
