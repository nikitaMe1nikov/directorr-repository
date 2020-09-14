import { isFunction, DISPATCH_ACTION_FIELD_NAME } from './utils';
import config from './config';
import { callWithPropNotEquallFunc } from './messages';
import { RunDispatcher, ActionType, CreateDecoratorOneArg } from './types';
import decorator from './decorator';
import createBuilderDecorator from './createBuilderDecorator';
import createActionTypeContext from './createActionTypeContext';
import addInitFields from './initFields';

export const MODULE_NAME = 'action';

export function runDispatcher(args: any[], actionType: string, valueFunc: any, store: any) {
  const result = valueFunc(...args);

  if (result !== null) store[DISPATCH_ACTION_FIELD_NAME](config.createAction(actionType, result));

  return result;
}

export function initializer(
  initObject: any,
  value: any,
  property: string,
  actionType: string,
  dispatcher: RunDispatcher = runDispatcher,
  addFields = addInitFields
) {
  if (!isFunction(value)) throw new Error(callWithPropNotEquallFunc(MODULE_NAME, property));

  addFields(initObject);

  return (...args: any[]) => dispatcher(args, actionType, value, initObject);
}

const action: CreateDecoratorOneArg<ActionType> = createBuilderDecorator(
  MODULE_NAME,
  decorator,
  initializer,
  createActionTypeContext
);

export default action;
