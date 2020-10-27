import action from './action';
import effect from './effect';
import {
  DecoratorValueTypedForAction,
  DecoratorValueTyped,
  SomeAction,
  SomeEffect,
  ActionType,
} from './types';

export function createActionAndEffect<P = any>(
  type: ActionType
): [DecoratorValueTypedForAction<SomeAction<P | null>>, DecoratorValueTyped<SomeEffect<P>>] {
  return [action<P>(type), effect<P>(type)];
}
