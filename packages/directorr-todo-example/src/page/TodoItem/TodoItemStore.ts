import { observable } from 'mobx';

import { Todo } from 'types';

export default class TodoItemStore {
  id: string;
  text: string;
  @observable checked: boolean;

  constructor({ id, text, checked = false }: Todo) {
    this.id = id;
    this.text = text;
    this.checked = checked;
  }
}
