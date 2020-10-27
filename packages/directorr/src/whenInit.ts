import { DirectorrStoreClass, InitPayload, DecoratorValueTyped, SomeEffect } from './types';
import effect from './effect';
import whenState from './whenState';
import whenPayload from './whenPayload';
import { composePropertyDecorators, DIRECTORR_INIT_STORE_ACTION } from './utils';

function pickSameConstructor(store: DirectorrStoreClass, payload: InitPayload) {
  return store.constructor === payload.StoreConstructor;
}

function returnTrue() {
  return true;
}

function returnUndefined() {
  return undefined;
}

export const whenInit: DecoratorValueTyped<SomeEffect<void>> = composePropertyDecorators([
  effect(DIRECTORR_INIT_STORE_ACTION),
  whenState(pickSameConstructor),
  whenPayload(returnTrue, returnUndefined),
]);

export default whenInit;
