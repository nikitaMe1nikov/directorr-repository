import { isFunction, RETURN_ARG_FUNC } from './utils';
import { callWithPropNotEquallFunc } from './messages';
import {
  CheckPayload,
  CreateDecorator,
  PayloadChecker,
  ConvertPayloadFunction,
  CheckPayloadFunc,
  CheckObjectPattern,
  SomeFunction,
} from './types';
import decorator from './decorator';
import createBuilderDecorator from './createBuilderDecorator';
import createCheckerContext from './createCheckerContext';

export const MODULE_NAME = 'whenPayload';

export function payloadChecker(
  payload: any,
  valueFunc: SomeFunction,
  [checker, converter = RETURN_ARG_FUNC]: [CheckPayload, ConvertPayloadFunction?]
) {
  if (!payload) return valueFunc(converter(payload));

  if (isFunction(checker))
    return (checker as CheckPayloadFunc)(payload) ? valueFunc(converter(payload)) : undefined;

  for (const prop in checker) {
    const value = (checker as CheckObjectPattern)[prop];

    if (isFunction(value)) {
      if (!(prop in payload) || !value(payload, prop)) return;
    } else if (payload[prop] !== value) {
      return;
    }
  }

  return valueFunc(converter(payload));
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

const whenPayload: CreateDecorator<CheckPayload, ConvertPayloadFunction> = createBuilderDecorator(
  MODULE_NAME,
  decorator,
  initializer,
  createCheckerContext
);

export default whenPayload;
