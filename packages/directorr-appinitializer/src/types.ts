export interface SomeClassConstructor<I = any, O = any> {
  new (options?: O): I;
}

export type InitOptions = SomeClassConstructor[];

export interface InitStorePayload {
  stores: SomeClassConstructor[];
}

export interface InitStoreErrorPayload {
  store: SomeClassConstructor;
  stores: SomeClassConstructor[];
}

export type InitStoreSuccessPayload = InitStorePayload;
