import { DirectorrStoreClassConstructor } from '@nimel/directorr'

export type UseStoreHook = <I>(StoreConstructor: DirectorrStoreClassConstructor<I>) => I
