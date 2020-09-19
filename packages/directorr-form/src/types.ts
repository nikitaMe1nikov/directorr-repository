import { ValidateOptions as ValidateOptionsYup, ObjectSchema } from 'yup';

export type ValidateOptions = ValidateOptionsYup;

export type ValidateOptionsAll = ValidateOptions & {
  payloadProp: string;
};

export type ValidateSchemaAll = (
  payload: any,
  valueFunc: SomeFunc,
  store: any,
  [schema, options, fields]: [ObjectSchema<any>, ValidateOptionsAll, string[]]
) => any;

export const enum Status {
  default,
  valid,
  invalid,
}

export interface FormStoreOptions {
  value?: string;
  status?: Status;
  message?: string;
}

export interface FormValuePayload {
  value: string;
}

export interface FormFocusPayload {
  focus: boolean;
}

export interface FormChangeStatusPayload {
  status: Status;
  message?: string;
}

export type SomeFunc = (arg: any) => any;
