import { observable } from 'mobx';
import { action, effect } from '@nimel/directorr';

import TodoItemStore from 'page/TodoItem/TodoItemStore';

export const CHANGE_ITEM_TOGGLE = 'TODOS.CHANGE_ITEM_TOGGLE';

export default class TodosStore {
  @observable list: TodoItemStore[] = [];

  addTodo = (todo: TodoItemStore) => {
    this.list.push(new TodoItemStore(todo));
  };

  @action(CHANGE_ITEM_TOGGLE)
  changeTodoToggle = (id: number, checked: boolean) => ({
    id,
    checked,
  });

  @effect(CHANGE_ITEM_TOGGLE)
  toChangeTodoToggle = ({ id, checked }: any) => {
    const todo = this.list.find(todo => todo.id === id);

    if (todo) todo.checked = checked;
  };

  removeTodo = (id: number) => {
    const index = this.list.findIndex(todo => todo.id === id);

    this.list.splice(index, 1);
  };

  allTodoComplated = () => {
    this.list.forEach(item => {
      item.checked = true;
    });
  };

  allTodoActive = () => {
    this.list.forEach(item => {
      item.checked = false;
    });
  };
}
