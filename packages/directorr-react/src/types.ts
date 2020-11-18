import { IAnyModelType, Instance } from 'mobx-state-tree';
import { DirectorrStoreClassConstructor } from '@nimel/directorr';

export type UseStoreHook = (<C extends IAnyModelType>(modelType: C) => Instance<C>) &
  (<I>(StoreConstructor: DirectorrStoreClassConstructor<I>) => I);
