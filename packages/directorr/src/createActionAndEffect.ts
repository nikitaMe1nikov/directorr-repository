import action from './action';
import effect from './effect';
import { DecoratorValueTypedWithType, SomeAction, SomeEffect, ActionType } from './types';

export function createActionAndEffect<P = any>(
  type: ActionType
): [DecoratorValueTypedWithType<SomeAction<P | null>>, DecoratorValueTypedWithType<SomeEffect<P>>] {
  return [action<P>(type), effect<P>(type)];
}
