import { DirectorrStoreClass, InitPayload } from './types';
import effect from './effect';
import whenState from './whenState';
import { composePropertyDecorators, DIRECTORR_DESTROY_STORE_ACTION } from './utils';

export const whenDestroy = composePropertyDecorators([
  effect(DIRECTORR_DESTROY_STORE_ACTION),
  whenState(
    (store: DirectorrStoreClass, payload: InitPayload) =>
      store.constructor === payload.StoreConstructor
  ),
]);

export default whenDestroy;
