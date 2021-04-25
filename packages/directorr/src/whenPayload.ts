import { isFunction, RETURN_ARG_FUNC, isPayloadChecked } from './utils';
import { callWithPropNotEquallFunc } from './messages';
import {
  CheckPayload,
  CreateDecorator,
  PayloadChecker,
  ConvertPayloadFunction,
  SomeFunction,
} from './types';
import decorator from './decorator';
import createDecoratorFactory from './createDecoratorFactory';
import createCheckerContext from './createCheckerContext';

export const MODULE_NAME = 'whenPayload';

export function payloadChecker(
  payload: any,
  valueFunc: SomeFunction,
  [checker, converter = RETURN_ARG_FUNC]: [CheckPayload, ConvertPayloadFunction?]
) {
  if (!payload) return valueFunc(converter(payload));

  if (isPayloadChecked(payload, checker)) return valueFunc(converter(payload));
}

export function initializer(
  initObject: any,
  value: any,
  property: string,
  args: any,
  payloadCheckerFunc: PayloadChecker = payloadChecker
) {
  if (!isFunction(value)) throw new Error(callWithPropNotEquallFunc(MODULE_NAME, property));

  return (payload: any) => payloadCheckerFunc(payload, value, args);
}

export const whenPayload: CreateDecorator<
  CheckPayload,
  ConvertPayloadFunction
> = createDecoratorFactory(MODULE_NAME, decorator, initializer, createCheckerContext);

export default whenPayload;
