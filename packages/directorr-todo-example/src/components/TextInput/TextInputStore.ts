import { observable } from 'mobx';
import { action, effect } from '@nimel/directorr';

import { EMPTY_STRING } from 'components/utils';

export const CHANGE = 'INPUT.CHANGE';
export const COMPLATE = 'INPUT.COMPLATE';
export const RESET = 'INPUT.RESET';

export default class TextInputStore {
  @observable value = EMPTY_STRING;
  @observable disabled = false;

  @action(CHANGE)
  onChange = ({ target }: any) => ({ value: target.value });

  @effect(CHANGE)
  toChange = ({ value }: any) => {
    this.value = value;
  };

  @action(COMPLATE)
  onComplate = () => ({ value: this.value });

  @action(RESET)
  reset = () => {};

  @effect(RESET)
  toReset = () => {
    this.value = EMPTY_STRING;
  };
}
