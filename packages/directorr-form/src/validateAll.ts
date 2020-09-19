import {
  createBuilderPropertyDecorator,
  isFunction,
  callWithPropNotEquallFunc,
  isLikeAction,
  EMPTY_OBJECT,
} from '@nimel/directorr';
import { ObjectSchema, ValidationError } from 'yup';
import FormStoreBase from './FormStore';
import { ValidateOptions, SomeFunc, ValidateSchemaAll } from './types';
import { calcValues } from './validate';
import createSchemaContext from './createSchemaContext';
import { useWithEffects } from './messages';

export const MODULE_NAME = 'validateAll';

export function validateSchema(
  payload: any = EMPTY_OBJECT,
  valueFunc: SomeFunc,
  store: any,
  [schema, options, fields]: [ObjectSchema<any>, ValidateOptions, string[]]
) {
  if (isLikeAction(payload)) throw new Error(useWithEffects(MODULE_NAME));

  let resultPayload = payload;
  const values = calcValues(fields, store);

  try {
    schema.validateSync(values, options);

    fields.forEach(prop => (store[prop] as FormStoreBase).changeStatusToValid());
  } catch (validationError) {
    validationError.inner.forEach((e: ValidationError) =>
      (store[e.path] as FormStoreBase).changeStatusToInvalid(e.message)
    );

    resultPayload = { ...resultPayload, validationError };
  }

  return valueFunc(resultPayload);
}

export function initializer(
  initObject: any,
  value: any,
  property: string,
  ctx: any,
  validate: ValidateSchemaAll = validateSchema
) {
  if (!isFunction(value)) throw new Error(callWithPropNotEquallFunc(MODULE_NAME, property));

  return (payload: any) => validate(payload, value, initObject, ctx);
}

const validateAll = createBuilderPropertyDecorator<ObjectSchema, ValidateOptions>(
  MODULE_NAME,
  initializer,
  createSchemaContext
);

export default validateAll;
