import action from './action';
import effect from './effect';
import {
  DecoratorValueTypedForAction,
  DecoratorValueTyped,
  SomeAction,
  SomeEffect,
  ActionType,
} from './types';

export default function createActionAndEffect<P = any>(
  type: ActionType
): [DecoratorValueTypedForAction<SomeAction<P>>, DecoratorValueTyped<SomeEffect<P>>] {
  return [action<P>(type), effect<P>(type)];
}
