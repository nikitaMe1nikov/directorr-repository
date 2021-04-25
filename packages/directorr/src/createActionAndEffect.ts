import action from './action';
import effect from './effect';
import { createActionTypes } from './utils';
import config from './config';
import { DecoratorValueTypedWithType, SomeAction, SomeEffect, ActionType } from './types';

export function createActionAndEffect<P = any, SP = any, EP = any, LP = any>(
  actionType: ActionType
): [
  DecoratorValueTypedWithType<SomeAction<P | null>>,
  DecoratorValueTypedWithType<SomeEffect<P>>,
  DecoratorValueTypedWithType<SomeAction<SP | null>>,
  DecoratorValueTypedWithType<SomeEffect<SP>>,
  DecoratorValueTypedWithType<SomeAction<EP | null>>,
  DecoratorValueTypedWithType<SomeEffect<EP>>,
  DecoratorValueTypedWithType<SomeAction<LP | null>>,
  DecoratorValueTypedWithType<SomeEffect<LP>>
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
