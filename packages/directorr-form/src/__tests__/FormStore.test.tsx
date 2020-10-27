import FormStore from '../FormStore';
import { EMPTY_STRING } from '@nimel/directorr';
import { someProperty } from '../__mocks__/mocks';
import { Status } from '../types';
import {
  effectFormSubmit,
  effectFormChangeStatus,
  effectFormVisit,
  effectFormFocus,
  effectFormChangeValue,
  effectFormReset,
} from '../decorators';

describe('FormStore', () => {
  it('constructor', () => {
    const value = someProperty;
    const status = Status.default;
    const message = 'message';

    expect(() => new FormStore()).not.toThrowError();

    const store = new FormStore({ value, status, message });

    expect(store).toMatchObject({
      value,
      status,
      message,
      defaultValue: value,
      defaultMessage: message,
      isDefault: true,
      isValid: false,
      isInvalid: false,
      isChanged: false,
      isVisited: false,
      isFocused: false,
    });
  });

  it('change value', () => {
    const value = 'value';
    class FormChange extends FormStore {
      @effectFormChangeValue
      effect = jest.fn();
    }
    const store = new FormChange();

    expect(store).toMatchObject({
      isChanged: false,
    });

    store.changeValue(value);

    expect(store).toMatchObject({
      value,
      isChanged: true,
    });
    expect(store.effect).toBeCalledTimes(1);
    expect(store.effect).lastCalledWith({ value });
  });

  it('focus', () => {
    class FormFocus extends FormStore {
      @effectFormFocus
      effectFocus = jest.fn();

      @effectFormVisit
      effectVisit = jest.fn();
    }
    const store = new FormFocus();

    store.focus();

    expect(store).toMatchObject({
      isFocused: true,
      isVisited: true,
    });
    expect(store.effectFocus).toBeCalledTimes(1);
    expect(store.effectFocus).lastCalledWith({ focus: true });
    expect(store.effectVisit).toBeCalledTimes(1);
    expect(store.effectVisit).lastCalledWith(undefined);

    store.blur();

    expect(store).toMatchObject({
      isFocused: false,
      isVisited: true,
    });
    expect(store.effectFocus).toBeCalledTimes(2);
    expect(store.effectFocus).lastCalledWith({ focus: false });
    expect(store.effectVisit).toBeCalledTimes(1);
    expect(store.effectVisit).lastCalledWith(undefined);
  });

  it('visit', () => {
    class FormVisit extends FormStore {
      @effectFormVisit
      effect = jest.fn();
    }
    const store = new FormVisit();

    store.visit();

    expect(store).toMatchObject({
      isVisited: true,
    });
    expect(store.effect).toBeCalledTimes(1);
    expect(store.effect).lastCalledWith(undefined);

    store.visit();

    expect(store).toMatchObject({
      isVisited: true,
    });
    expect(store.effect).toBeCalledTimes(1);
  });

  it('change status', () => {
    const message = 'message';
    class FormStatus extends FormStore {
      @effectFormChangeStatus
      effect = jest.fn();
    }
    const store = new FormStatus();

    store.changeStatusToValid();

    expect(store).toMatchObject({
      status: Status.valid,
      isDefault: false,
      isValid: true,
      isInvalid: false,
      message: undefined,
    });
    expect(store.effect).toBeCalledTimes(1);
    expect(store.effect).lastCalledWith({ status: Status.valid });

    store.changeStatusToInvalid(message);

    expect(store).toMatchObject({
      status: Status.invalid,
      isDefault: false,
      isValid: false,
      isInvalid: true,
      message,
    });
    expect(store.effect).toBeCalledTimes(2);
    expect(store.effect).lastCalledWith({ status: Status.invalid, message });
  });

  it('submit', () => {
    class FormSubmit extends FormStore {
      @effectFormSubmit
      effect = jest.fn();
    }
    const store = new FormSubmit();

    store.submit();

    expect(store.effect).toBeCalledTimes(1);
    expect(store.effect).lastCalledWith(undefined);
  });

  it('reset', () => {
    class FormReset extends FormStore {
      @effectFormReset
      effect = jest.fn();
    }
    const store = new FormReset();

    store.reset();

    expect(store).toMatchObject({
      value: EMPTY_STRING,
      status: Status.default,
      message: undefined,
    });
    expect(store.effect).toBeCalledTimes(1);
    expect(store.effect).lastCalledWith(undefined);
  });
});
