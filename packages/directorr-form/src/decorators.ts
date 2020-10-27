import { createActionAndEffect } from '@nimel/directorr';
import { FormValuePayload, FormFocusPayload, FormChangeStatusPayload } from './types';

export const [actionChangeValue, effectChangeValue] = createActionAndEffect<FormValuePayload>(
  'FORM.CHANGE_VALUE'
);
export const [actionFocus, effectFocus] = createActionAndEffect<FormFocusPayload>('FORM.FOCUS');
export const [actionVisit, effectVisit] = createActionAndEffect<void>('FORM.VISIT');
export const [actionChangeStatus, effectChangeStatus] = createActionAndEffect<
  FormChangeStatusPayload
>('FORM.CHANGE_STATUS');
export const [actionSubmit, effectSubmit] = createActionAndEffect<void>('FORM.SUBMIT');
export const [actionReset, effectReset] = createActionAndEffect<void>('FORM.RESET');
