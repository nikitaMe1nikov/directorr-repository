import { createActionAndEffect } from '@nimel/directorr'
import { InitStorePayload, InitStoreErrorPayload, InitStoreSuccessPayload } from './types'

export const [initStoreAction, initStoreEffect] = createActionAndEffect<InitStorePayload>(
  'AppInitStore.INIT_STORES',
)
export const [initStoreErrorAction, initStoreErrorEffect] =
  createActionAndEffect<InitStoreErrorPayload>('AppInitStore.INIT_STORES_ERROR')
export const [initStoreSuccessAction, initStoreSuccessEffect] =
  createActionAndEffect<InitStoreSuccessPayload>('AppInitStore.INIT_STORES_SUCCESS')
