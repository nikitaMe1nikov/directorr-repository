import {
  DirectorrStoreClass,
  OptionsPayload,
  DecoratorValueTyped,
  SomeEffect,
  Action,
} from './types';
import effect from './effect';
import whenState from './whenState';
import whenPayload from './whenPayload';
import { composePropertyDecorators, DIRECTORR_OPTIONS_STORE_ACTION } from './utils';

function pickSameConstructor(store: DirectorrStoreClass, payload: OptionsPayload) {
  return store.constructor === payload.StoreConstructor;
}

function hasInitOptions(payload: Action['payload']) {
  return !!payload.initOptions;
}

function pickInitOptions(payload: OptionsPayload) {
  return payload.initOptions;
}

export const whenOptions: DecoratorValueTyped<SomeEffect> = composePropertyDecorators([
  effect(DIRECTORR_OPTIONS_STORE_ACTION),
  whenState(pickSameConstructor),
  whenPayload(hasInitOptions, pickInitOptions),
]);

export default whenOptions;
