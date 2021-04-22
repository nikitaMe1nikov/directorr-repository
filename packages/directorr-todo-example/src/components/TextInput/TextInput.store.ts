import { observable, makeObservable } from 'mobx';
import { createActionAndEffect } from '@nimel/directorr';

import { EMPTY_STRING } from 'components/utils';

export interface TextInputChangePayload {
  value: string;
}
export type TextInputComplatePayload = TextInputChangePayload;

export const [actionInputChange, effectInputChange] = createActionAndEffect<TextInputChangePayload>(
  'INPUT.CHANGE'
);
export const [actionInputComplate, effectInputComplate] = createActionAndEffect<
  TextInputComplatePayload
>('INPUT.COMPLATE');
export const [actionInputReset, effectInputReset] = createActionAndEffect<void>('INPUT.RESET');

export default class TextInput {
  constructor() {
    makeObservable(this);
  }

  @observable value = EMPTY_STRING;
  @observable disabled = false;

  @actionInputChange
  onChange = ({ target }: any) => ({ value: target.value });

  @effectInputChange
  toChange = ({ value }: TextInputChangePayload) => {
    this.value = value;
  };

  @actionInputComplate
  onComplate = () => ({ value: this.value });

  @actionInputReset
  reset = () => {};

  @effectInputReset
  toReset = () => {
    this.value = EMPTY_STRING;
  };
}
