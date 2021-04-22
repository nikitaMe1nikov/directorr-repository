import { observable, makeObservable } from 'mobx';
import { Todo } from 'types';

export default class TodoItem {
  id: string;
  text: string;
  @observable checked: boolean;

  constructor({ id, text, checked = false }: Todo) {
    makeObservable(this);
    this.id = id;
    this.text = text;
    this.checked = checked;
  }
}
