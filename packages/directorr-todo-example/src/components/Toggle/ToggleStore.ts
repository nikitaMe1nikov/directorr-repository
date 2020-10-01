import { observable } from 'mobx';
import { createActionAndEffect } from '@nimel/directorr';

export interface TogglePayload {
  value: boolean;
}

export const [actionToggle, effectToggle] = createActionAndEffect<TogglePayload>('TOGGLE.CHANGE');

export default class ToggleStore {
  @observable value: boolean;
  @observable disabled = false;

  constructor(v = false) {
    this.value = v;
  }

  @actionToggle
  onChange = (e: any) => ({ value: e.target.checked });

  @effectToggle
  toToggle = ({ value }: TogglePayload) => {
    this.value = value;
  };
}
