import { isFunction, DISPATCH_ACTION_FIELD_NAME, RETURN_ARG_FUNC, isPromise } from './utils';
import config from './config';
import { callWithPropNotEquallFunc } from './messages';
import {
  RunDispatcher,
  ActionType,
  CreateDecoratorValueTypedWithTypeActionTwoOptions,
  DecoratorValueTypedWithType,
  AddToPayload,
} from './types';
import decorator from './decorator';
import createDecoratorFactory from './createDecoratorFactory';
import createActionTypeContext from './createActionTypeContext';
import addInitFields from './initFields';

export const MODULE_NAME = 'action';

export function runDispatcher(
  args: any[],
  actionType: string,
  valueFunc: any,
  store: any,
  addToPayload: AddToPayload
) {
  const result = valueFunc(...args);

  if (result !== null) {
    if (isPromise(result)) {
      result.then(data => {
        if (data !== null) {
          store[DISPATCH_ACTION_FIELD_NAME](
            config.createAction(actionType, addToPayload(data, store))
          );
        }
      });
    } else {
      store[DISPATCH_ACTION_FIELD_NAME](
        config.createAction(actionType, addToPayload(result, store))
      );
    }
  }

  return result;
}

export function initializer(
  initObject: any,
  value: any,
  property: string,
  [actionType, addToPayload = RETURN_ARG_FUNC]: [string, AddToPayload],
  dispatcher: RunDispatcher = runDispatcher,
  addFields = addInitFields
) {
  if (!isFunction(value)) throw new Error(callWithPropNotEquallFunc(MODULE_NAME, property));

  addFields(initObject);

  return (...args: any[]) => dispatcher(args, actionType, value, initObject, addToPayload);
}

export function addTypeToDecorator(
  decorator: DecoratorValueTypedWithType,
  context: [string, AddToPayload]
) {
  decorator.type = context[0];
  decorator.createAction = payload => config.createAction(context[0], payload);

  return decorator;
}

export const action: CreateDecoratorValueTypedWithTypeActionTwoOptions<
  ActionType,
  AddToPayload
> = createDecoratorFactory(
  MODULE_NAME,
  decorator,
  initializer,
  createActionTypeContext,
  addTypeToDecorator
);

export default action;
