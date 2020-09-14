import { MessageFunc } from './types';

export const whenNotFoundStore: MessageFunc = (moduleName, StoreConstructor) =>
  `${moduleName}: for some reason, not found store with constuctor=${StoreConstructor.name}`;

export const whenContextNotLikeDirrector: MessageFunc = (moduleName, context) =>
  `${moduleName}: for some reason, context=${context} not like Dirrector instance`;

export const whenNotReactContext: MessageFunc = (moduleName, context) =>
  `${moduleName}: call with arg=${context} not like react context`;

export const whenNotStoreConstructor: MessageFunc = (moduleName, StoreConstructor) =>
  `${moduleName}: call with arg=${StoreConstructor} not like object constuctor`;
