import {
  createBuilderPropertyDecorator,
  isFunction,
  callWithPropNotEquallFunc,
  isLikeAction,
} from '@nimel/directorr';
import { ObjectSchema, ValidationError } from 'yup';
import FormStoreBase from './FormStore';
import { ValidateOptions, SomeFunc } from './types';
import { isLikeYUPSchema, calcValues } from './validate';

const MODULE_NAME = 'validateAll';
const DEFAULT_VALIDATE_OPTIONS = { strict: true, abortEarly: false };

export function validateSchema(
  payload: any = {},
  valueFunc: SomeFunc,
  store: any,
  [schema, options, fields]: [ObjectSchema<any>, ValidateOptions, string[]]
) {
  if (isLikeAction(payload)) throw new Error(`${MODULE_NAME}: use only with effect decorator`);

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

export function initializer(initObject: any, value: any, property: string, ctx: any) {
  if (!isFunction(value)) throw new Error(callWithPropNotEquallFunc(MODULE_NAME, property));

  return (payload: any) => validateSchema(payload, value, initObject, ctx);
}

export function createSchemaContext(moduleName: string, schema: ObjectSchema<any>, options = {}) {
  if (!isLikeYUPSchema(schema))
    throw new Error(`${moduleName}: call with arg=${schema} not like yup - ObjectSchema`);

  return [schema, { ...DEFAULT_VALIDATE_OPTIONS, ...options }, Object.keys(schema.fields)];
}

const validateAll = createBuilderPropertyDecorator<ObjectSchema, ValidateOptions>(
  MODULE_NAME,
  initializer,
  createSchemaContext
);

export default validateAll;
