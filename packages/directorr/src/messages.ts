import { MessageFunc } from './types';

export const errorWhenWrongEnv = () =>
  "Directorr requires Symbol and Map objects. If your environment doesn't support, magic won`t work.";

export const notFindStoreName = () => 'Store name not found';

export const notObserver = () => 'Expected the observer to be an object';

export const callWithArg: MessageFunc = (moduleName, arg, errorMessage) =>
  `${moduleName}: call decorator with arg=${arg} ${errorMessage}`;

export const callDecoratorWithNotActionType: MessageFunc = (moduleName, arg) =>
  callWithArg(moduleName, arg, 'not equal to string or array of strings');

export const callDecoratorWithNotConsrtactorType: MessageFunc = (moduleName, arg) =>
  callWithArg(moduleName, arg, 'not constuctor');

export const callDecoratorWithNotActionChecker: MessageFunc = (moduleName, checker) =>
  callWithArg(moduleName, checker, 'not like object or function');

export const callDecoratorWithNotConvertPayload: MessageFunc = (moduleName, converter) =>
  callWithArg(moduleName, converter, 'not like function');

export const useForNotPropDecorator: MessageFunc = (moduleName, property) =>
  `${moduleName}: use for property=${property} not like property decorator`;

export const callWithPropNotEquallFunc: MessageFunc = (moduleName, property) =>
  `${moduleName}: use decorator for prop=${property} equal func`;

export const useForPropNotEquallObject: MessageFunc = (moduleName, property) =>
  `${moduleName}: use decorator for prop=${property} equal object like value`;

export const notFoundDirectorrStore: MessageFunc = (moduleName, StoreConstructor) =>
  `${moduleName}: store with constuctor=${StoreConstructor.name} not add to Dirrector`;

export const notFoundStoreInDirectorrStore: MessageFunc = (
  moduleName,
  StoreConstructor,
  currentStore
) =>
  `${moduleName}: for some reason, not found store with constuctor=${StoreConstructor.name}, may be worth adding storage=${StoreConstructor.name} earlier than the current=${currentStore.name}`;

export const callWithNotAction: MessageFunc = (moduleName, action) =>
  `${moduleName}: call with action=${JSON.stringify(action)} not like action type`;

export const dontUseWithAnotherDecorator: MessageFunc = moduleName =>
  `${moduleName}: dont use with another decorators`;

export const haveCycleInjectedStore: MessageFunc = moduleName =>
  `${moduleName}: call stack out of range, this usually happens with cyclical dependency of injected stores`;
