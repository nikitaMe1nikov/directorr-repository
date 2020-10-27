import { observable, computed } from 'mobx';
import { EMPTY_OBJECT, EMPTY_STRING } from '@nimel/directorr';
import {
  Status,
  FormStoreOptions,
  FormValuePayload,
  FormFocusPayload,
  FormChangeStatusPayload,
} from './types';
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
  actionFormReset,
  effectFormReset,
} from './decorators';

export class FormStore {
  defaultValue: string;
  defaultMessage?: string;
  @observable value: string;
  @observable message?: string;
  @observable status: Status;
  @observable isChanged = false;
  @observable isVisited = false;
  @observable isFocused = false;

  constructor({
    value = EMPTY_STRING,
    status = Status.default,
    message,
  }: FormStoreOptions = EMPTY_OBJECT) {
    this.defaultValue = value;
    this.defaultMessage = message;

    this.value = value;
    this.status = status;
    this.message = message;
  }

  @computed get isDefault() {
    return this.status === Status.default;
  }

  @computed get isValid() {
    return this.status === Status.valid;
  }

  @computed get isInvalid() {
    return this.status === Status.invalid;
  }

  @actionFormChangeValue
  changeValue = (value: string) => ({ value });

  @effectFormChangeValue
  toChangeValue = ({ value }: FormValuePayload) => {
    this.isChanged = true;

    this.value = value;
  };

  @actionFormFocus
  focus = () => {
    this.visit();

    return { focus: true };
  };

  @actionFormFocus
  blur = () => ({ focus: false });

  @effectFormFocus
  toFocus = ({ focus }: FormFocusPayload) => {
    this.isFocused = focus;
  };

  @actionFormVisit
  visit = () => (this.isVisited ? null : undefined);

  @effectFormVisit
  toVisit = () => {
    this.isVisited = true;
  };

  @actionFormChangeStatus
  changeStatusToInvalid = (message: string) => ({ status: Status.invalid, message });

  @actionFormChangeStatus
  changeStatusToValid = () => ({ status: Status.valid });

  @effectFormChangeStatus
  toChangeStatus = ({ status, message }: FormChangeStatusPayload) => {
    this.status = status;
    this.message = message;
  };

  @actionFormSubmit
  submit = () => {};

  @actionFormReset
  reset = () => {};

  @effectFormReset
  toReset = () => {
    this.value = this.defaultValue;
    this.message = this.defaultMessage;
    this.status = Status.default;
  };
}

export default FormStore;
