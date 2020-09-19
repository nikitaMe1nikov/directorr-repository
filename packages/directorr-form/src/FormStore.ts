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
  actionChangeValue,
  effectChangeValue,
  actionFocus,
  effectFocus,
  actionVisit,
  effectVisit,
  actionChangeStatus,
  effectChangeStatus,
  actionSubmit,
  actionReset,
  effectReset,
} from './decorators';

export default class FormStore {
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

  @actionChangeValue
  changeValue = (value: string) => ({ value });

  @effectChangeValue
  toChangeValue = ({ value }: FormValuePayload) => {
    if (!this.isChanged) this.isChanged = true;

    this.value = value;
  };

  @actionFocus
  focus = () => {
    this.visit();

    return { focus: true };
  };

  @actionFocus
  blur = () => ({ focus: false });

  @effectFocus
  toFocus = ({ focus }: FormFocusPayload) => {
    this.isFocused = focus;
  };

  @actionVisit
  visit = () => (this.isVisited ? null : undefined);

  @effectVisit
  toVisit = () => {
    this.isVisited = true;
  };

  @actionChangeStatus
  changeStatusToInvalid = (message: string) => ({ status: Status.invalid, message });

  @actionChangeStatus
  changeStatusToValid = () => ({ status: Status.valid });

  @effectChangeStatus
  toChangeStatus = ({ status, message }: FormChangeStatusPayload) => {
    this.status = status;
    this.message = message;
  };

  @actionSubmit
  submit = () => {};

  @actionReset
  reset = () => {};

  @effectReset
  toReset = () => {
    this.value = this.defaultValue;
    this.message = this.defaultMessage;
    this.status = Status.default;
  };
}
