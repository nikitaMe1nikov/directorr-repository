import action from './action';
import effect from './effect';
import { DecoratorValueTyped, SomeAction, SomeEffect } from './types';

export default function createActionAndEffect<P = any>(
  type: string
): [DecoratorValueTyped<SomeAction<P>>, DecoratorValueTyped<SomeEffect<P>>] {
  return [action(type), effect(type)];
}
