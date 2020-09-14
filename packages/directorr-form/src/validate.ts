import {
  createBuilderPropertyDecorator,
  isFunction,
  callWithPropNotEquallFunc,
  isLikeAction,
} from '@nimel/directorr';
import { ObjectSchema } from 'yup';
import FormStore from './FormStore';
import { ValidateOptions, SomeFunc } from './types';

const MODULE_NAME = 'validate';
const DEFAULT_VALIDATE_OPTIONS = {
  abortEarly: true,
  strict: true,
  payloadProp: 'connectStoreProperty',
};
const VALUE_PROP_NAME = 'value';

export function isLikeFormStore(store: any) {
  return !!(VALUE_PROP_NAME in store && store.changeStatusToInvalid && store.changeStatusToValid);
}

export function isLikeYUPSchema(schema: any) {
  return !!schema?.fields;
}

export function calcValues(fields: string[], store: any) {
  const result: { [keys: string]: any } = {};

  for (let i = 0, l = fields.length, prop: string, formStore: FormStore; i < l; ++i) {
    prop = fields[i];
    formStore = store[prop];

    if (!formStore)
      throw new Error(`${MODULE_NAME}: formStore in prop=${prop} not exist in class=${store}`);

    if (!isLikeFormStore(formStore))
      throw new Error(`${MODULE_NAME}: formStore in prop=${prop} not like FormStore=${formStore}`);

    result[prop] = formStore.value || undefined;
  }

  return result;
}

export function validateSchema(
  payload: any = {},
  valueFunc: SomeFunc,
  store: any,
  [schema, options, fields]: [ObjectSchema<any>, ValidateOptions, string[]]
) {
  if (isLikeAction(payload)) throw new Error(`${MODULE_NAME}: use only with effect decorator`);

  let resultPayload = payload;
  const payloadProp = resultPayload[options.payloadProp];

  if (!payloadProp)
    throw new Error(
      `${MODULE_NAME}: payloadProp=${options.payloadProp} not exist in payload=${payloadProp}`
    );

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

export function initializer(initObject: any, value: any, property: string, ctx: any) {
  if (!isFunction(value)) throw new Error(callWithPropNotEquallFunc(MODULE_NAME, property));

  return (payload: any) => validateSchema(payload, value, initObject, ctx);
}

export function createSchemaContext(moduleName: string, schema: ObjectSchema<any>, options = {}) {
  if (!isLikeYUPSchema(schema))
    throw new Error(`${moduleName}: call with arg=${schema} not like yup ObjectSchema`);

  return [schema, { ...DEFAULT_VALIDATE_OPTIONS, ...options }, Object.keys(schema.fields)];
}

const validate = createBuilderPropertyDecorator<ObjectSchema, ValidateOptions>(
  MODULE_NAME,
  initializer,
  createSchemaContext
);

export default validate;
