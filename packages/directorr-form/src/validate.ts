import {
  createBuilderPropertyDecorator,
  isFunction,
  callWithPropNotEquallFunc,
  isLikeAction,
  EMPTY_OBJECT,
} from '@nimel/directorr';
import { ObjectSchema } from 'yup';
import FormStore from './FormStore';
import { propNotExistInClass, propInClassNotLikeFormStore, useWithEffects } from './messages';
import createSchemaContext from './createSchemaContext';
import { ValidateOptionsAll, SomeFunc, ValidateSchemaAll } from './types';

export const MODULE_NAME = 'validate';
const VALUE_PROP_NAME = 'value';

export function isLikeFormStore(store: any) {
  return !!(VALUE_PROP_NAME in store && store.changeStatusToInvalid && store.changeStatusToValid);
}

export function calcValues(fields: string[], store: any) {
  const result: { [keys: string]: any } = {};

  for (let i = 0, l = fields.length, prop: string, formStore: FormStore; i < l; ++i) {
    prop = fields[i];
    formStore = store[prop];

    if (!formStore) throw new Error(propNotExistInClass(MODULE_NAME, prop, store));

    if (!isLikeFormStore(formStore))
      throw new TypeError(propInClassNotLikeFormStore(MODULE_NAME, prop, formStore));

    result[prop] = formStore.value || undefined;
  }

  return result;
}

export function validateSchema(
  payload: any = EMPTY_OBJECT,
  valueFunc: SomeFunc,
  store: any,
  [schema, options, fields]: [ObjectSchema<any>, ValidateOptionsAll, string[]]
) {
  if (isLikeAction(payload)) throw new Error(useWithEffects(MODULE_NAME));

  let resultPayload = payload;
  const payloadProp = resultPayload[options.payloadProp];

  if (!payloadProp) return;

  const values = calcValues(fields, store);

  try {
    schema.validateSyncAt(payloadProp, values, options);

    store[payloadProp].changeStatusToValid();
  } catch (validationError) {
    store[payloadProp].changeStatusToInvalid(validationError.message);

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
  if (!isFunction(value)) throw new TypeError(callWithPropNotEquallFunc(MODULE_NAME, property));

  return (payload: any) => validate(payload, value, initObject, ctx);
}

const validate = createBuilderPropertyDecorator<ObjectSchema, ValidateOptionsAll>(
  MODULE_NAME,
  initializer,
  createSchemaContext
);

export default validate;
