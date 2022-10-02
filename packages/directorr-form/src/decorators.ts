import { createActionAndEffect } from '@nimel/directorr'
import { FormValuePayload, FormFocusPayload, FormChangeStatusPayload } from './types'

export const [actionFormChangeValue, effectFormChangeValue] =
  createActionAndEffect<FormValuePayload>('FORM.CHANGE_VALUE')
export const [actionFormFocus, effectFormFocus] =
  createActionAndEffect<FormFocusPayload>('FORM.FOCUS')
export const [actionFormVisit, effectFormVisit] = createActionAndEffect<void>('FORM.VISIT')
export const [actionFormChangeStatus, effectFormChangeStatus] =
  createActionAndEffect<FormChangeStatusPayload>('FORM.CHANGE_STATUS')
export const [actionFormSubmit, effectFormSubmit] = createActionAndEffect<void>('FORM.SUBMIT')
export const [actionFormReset, effectFormReset] = createActionAndEffect<void>('FORM.RESET')
