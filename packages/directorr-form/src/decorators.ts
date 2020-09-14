import { createActionAndEffect } from '@nimel/directorr';
import { FormValuePayload, FormFocusPayload, FormChangeStatusPayload } from './types';
import { FORM_ACTIONS } from './actionTypes';

export const [actionChangeValue, effectChangeValue] = createActionAndEffect<FormValuePayload>(
  FORM_ACTIONS.CHANGE_VALUE
);
export const [actionFocus, effectFocus] = createActionAndEffect<FormFocusPayload>(
  FORM_ACTIONS.FOCUS
);
export const [actionVisit, effectVisit] = createActionAndEffect<void>(FORM_ACTIONS.VISIT);
export const [actionChangeStatus, effectChangeStatus] = createActionAndEffect<
  FormChangeStatusPayload
>(FORM_ACTIONS.CHANGE_STATUS);
export const [actionSubmit, effectSubmit] = createActionAndEffect<void>(FORM_ACTIONS.SUBMIT);
export const [actionReset, effectReset] = createActionAndEffect<void>(FORM_ACTIONS.RESET);
