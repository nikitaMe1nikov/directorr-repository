import { DirectorrStoreClass, InitPayload } from './types';
import effect from './effect';
import whenState from './whenState';
import whenPayload from './whenPayload';
import { composePropertyDecorators, DIRECTORR_INIT_STORE_ACTION } from './utils';

function returnTrue() {
  return true;
}

const whenInit = composePropertyDecorators([
  effect(DIRECTORR_INIT_STORE_ACTION),
  whenState(
    (store: DirectorrStoreClass, payload: InitPayload) =>
      store.constructor === payload.StoreConstructor
  ),
  whenPayload(returnTrue, (payload: InitPayload) => payload.initOptions),
]);

export default whenInit;
