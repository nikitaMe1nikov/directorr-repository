import { Context } from 'react';
import { DirectorrStoreClassConstructor } from '@nimel/directorr';

export type HookToBuild<C = any> = (
  context: Context<any>,
  StoreConstructor: DirectorrStoreClassConstructor<C>,
  initOptions?: any
) => C;

export type MessageFunc = (sourceName: string, arg: any, errorMessage?: any) => string;
