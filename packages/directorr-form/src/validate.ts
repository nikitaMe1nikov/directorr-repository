import {
  createPropertyDecoratorFactory,
  isFunction,
  callWithPropNotEquallFunc,
  isLikeAction,
  EMPTY_OBJECT,
  CreatePropertyDecoratorFactory,
} from '@nimel/directorr';
import { ObjectSchema } from 'yup';
import { useWithEffects } from './messages';
import createSchemaContext from './createSchemaContext';
import { ValidateOptions, SomeFunc, ValidateSchema, validatePayload } from './types';
import calcValues from './calcValues';

export const MODULE_NAME = 'validate';

export function validateSchema(
  payload: any = EMPTY_OBJECT,
  valueFunc: SomeFunc,
  store: any,
  [schema, options, fields]: [ObjectSchema<any>, ValidateOptions, string[]]
) {
  if (isLikeAction(payload)) throw new Error(useWithEffects(MODULE_NAME));

  let resultPayload = payload;
  const payloadProp = resultPayload[options.payloadProp];

  if (!payloadProp) return;

  const values = calcValues(MODULE_NAME, fields, store);

  try {
    schema.validateSyncAt(payloadProp, values, options);

    store[payloadProp].changeStatusToValid();
  } catch (validationError) {
    store[payloadProp].changeStatusToInvalid(validationError.errors[0]);

    resultPayload = { ...resultPayload, validationError };
  }

  return valueFunc(resultPayload);
}

export function initializer(
  initObject: any,
  value: any,
  property: string,
  ctx: any,
  validate: ValidateSchema = validateSchema
) {
  if (!isFunction(value)) throw new TypeError(callWithPropNotEquallFunc(MODULE_NAME, property));

  return (payload: any) => validate(payload, value, initObject, ctx);
}

const validate: CreatePropertyDecoratorFactory<
  ObjectSchema,
  ValidateOptions,
  validatePayload
> = createPropertyDecoratorFactory(MODULE_NAME, initializer, createSchemaContext);

export default validate;
