import { isFunction } from './utils';
import { callWithPropNotEquallFunc } from './messages';
import {
  CheckState,
  StateChecker,
  CheckStateFunc,
  CheckObjectPattern,
  SomeFunction,
  CreateDecoratorOneArg,
} from './types';
import decorator from './decorator';
import createDecoratorFactory from './createrDecoratorFactory';
import createCheckerContext from './createCheckerContext';

export const MODULE_NAME = 'whenState';

export function stateChecker(
  payload: any,
  valueFunc: SomeFunction,
  store: any,
  [checker]: [CheckState]
) {
  if (isFunction(checker))
    return (checker as CheckStateFunc)(store, payload) ? valueFunc(payload) : undefined;

  for (const prop in checker) {
    const value = (checker as CheckObjectPattern)[prop];

    if (isFunction(value)) {
      if (!(prop in store) || !value(store, payload, prop)) return;
    } else if (store[prop] !== value) {
      return;
    }
  }

  return valueFunc(payload);
}

export function initializer(
  initObject: any,
  value: any,
  property: string,
  checker: any,
  stateCheckFunc: StateChecker = stateChecker
) {
  if (!isFunction(value)) throw new Error(callWithPropNotEquallFunc(MODULE_NAME, property));

  return (payload: any) => stateCheckFunc(payload, value, initObject, checker);
}

const whenState: CreateDecoratorOneArg<CheckState> = createDecoratorFactory(
  MODULE_NAME,
  decorator,
  initializer,
  createCheckerContext
);

export default whenState;
