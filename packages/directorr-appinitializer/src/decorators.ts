import { action, createActionAndEffect } from '@nimel/directorr';
import { InitStorePayload, InitStoreErrorPayload, InitStoreSuccessPayload } from './types';

export const initStoreAction = action<InitStorePayload>('AppInitStore.INIT_STORES');
export const [initStoreErrorAction, initStoreErrorEffect] = createActionAndEffect<
  InitStoreErrorPayload
>('AppInitStore.INIT_STORES_ERROR');
export const [initStoreSuccessAction, initStoreSuccessEffect] = createActionAndEffect<
  InitStoreSuccessPayload
>('AppInitStore.INIT_STORES_SUCCESS');
export const [isReadyAction, isReadyEffect] = createActionAndEffect<void>('AppInitStore.IS_READY');
