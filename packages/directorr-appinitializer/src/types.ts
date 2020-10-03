import { DirectorrStoreClassConstructor } from '@nimel/directorr';

export type InitOptions = DirectorrStoreClassConstructor[];

export interface InitStorePayload {
  stores: DirectorrStoreClassConstructor[];
}

export interface InitStoreErrorPayload {
  store: DirectorrStoreClassConstructor;
  stores: DirectorrStoreClassConstructor[];
}

export type InitStoreSuccessPayload = InitStorePayload;
