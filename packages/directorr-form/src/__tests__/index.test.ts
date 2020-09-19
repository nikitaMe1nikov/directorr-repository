import { FormStore, validate, validateAll } from '../index';
import {
  actionChangeValue,
  effectChangeValue,
  actionFocus,
  effectFocus,
  actionVisit,
  effectVisit,
  actionChangeStatus,
  effectChangeStatus,
  actionSubmit,
  effectSubmit,
  actionReset,
  effectReset,
} from '../decorators';

describe('index', () => {
  it('check exports', () => {
    expect(FormStore).not.toBeUndefined();
    expect(validate).not.toBeUndefined();
    expect(validateAll).not.toBeUndefined();
    expect(actionChangeValue).not.toBeUndefined();
    expect(effectChangeValue).not.toBeUndefined();
    expect(actionFocus).not.toBeUndefined();
    expect(effectFocus).not.toBeUndefined();
    expect(actionVisit).not.toBeUndefined();
    expect(effectVisit).not.toBeUndefined();
    expect(actionChangeStatus).not.toBeUndefined();
    expect(effectChangeStatus).not.toBeUndefined();
    expect(actionSubmit).not.toBeUndefined();
    expect(effectSubmit).not.toBeUndefined();
    expect(actionReset).not.toBeUndefined();
    expect(effectReset).not.toBeUndefined();
  });
});
