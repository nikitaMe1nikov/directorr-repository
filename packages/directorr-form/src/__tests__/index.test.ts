import { FormStore, validate, validateAll } from '../index'
import {
  actionFormChangeValue,
  effectFormChangeValue,
  actionFormFocus,
  effectFormFocus,
  actionFormVisit,
  effectFormVisit,
  actionFormChangeStatus,
  effectFormChangeStatus,
  actionFormSubmit,
  effectFormSubmit,
  actionFormReset,
  effectFormReset,
} from '../decorators'

describe('index', () => {
  it('check exports', () => {
    expect(FormStore).not.toBeUndefined()
    expect(validate).not.toBeUndefined()
    expect(validateAll).not.toBeUndefined()
    expect(actionFormChangeValue).not.toBeUndefined()
    expect(effectFormChangeValue).not.toBeUndefined()
    expect(actionFormFocus).not.toBeUndefined()
    expect(effectFormFocus).not.toBeUndefined()
    expect(actionFormVisit).not.toBeUndefined()
    expect(effectFormVisit).not.toBeUndefined()
    expect(actionFormChangeStatus).not.toBeUndefined()
    expect(effectFormChangeStatus).not.toBeUndefined()
    expect(actionFormSubmit).not.toBeUndefined()
    expect(effectFormSubmit).not.toBeUndefined()
    expect(actionFormReset).not.toBeUndefined()
    expect(effectFormReset).not.toBeUndefined()
  })
})
