import { ValidateOptions as ValidateOptionsYup } from 'yup';

export type ValidateOptions = ValidateOptionsYup & {
  payloadProp: string;
};

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
