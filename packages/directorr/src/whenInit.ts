import effect from './effect';
import whenState from './whenState';
import { composePropertyDecorators, DIRECTORR_INIT_STORE_ACTION, pickSameStore } from './utils';
import { DecoratorValueTyped, SomeEffect, InitPayload } from './types';

export const whenInit: DecoratorValueTyped<SomeEffect<InitPayload>> = composePropertyDecorators([
  effect(DIRECTORR_INIT_STORE_ACTION),
  whenState(pickSameStore),
]);

export default whenInit;
