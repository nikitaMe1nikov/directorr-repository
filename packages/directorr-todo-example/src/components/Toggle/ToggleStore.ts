import { observable } from 'mobx';
import { action, effect } from '@nimel/directorr';

export const TOGGLE_CHANGE = 'TOGGLE.CHANGE';

export default class ToggleStore {
  constructor(v = false) {
    this.value = v;
  }

  @observable value: boolean;
  @observable disabled = false;

  @action(TOGGLE_CHANGE)
  onChange = (e: any) => ({ value: e.target.checked });

  @effect(TOGGLE_CHANGE)
  toToggle = ({ value }: any) => {
    this.value = value;
  };
}
