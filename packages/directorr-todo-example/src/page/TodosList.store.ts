import { observable, makeObservable } from 'mobx';

import TodoItemStore from 'page/TodoItem/TodoItem.store';
import { actionChangeTodoToggle, effectChangeTodoToggle } from 'decorators';
import { Todo, ChangeTodoTogglePayload } from 'types';

export default class Todos {
  constructor() {
    makeObservable(this);
  }

  @observable list: TodoItemStore[] = [];

  addTodo = (todo: Todo) => {
    this.list.push(new TodoItemStore(todo));
  };

  replaceTodos = (todos: Todo[]) => {
    this.list = [];

    todos.forEach(todo => this.list.push(new TodoItemStore(todo)));
  };

  @actionChangeTodoToggle
  changeTodoToggle = (id: string, checked: boolean) => ({
    id,
    checked,
  });

  @effectChangeTodoToggle
  toChangeTodoToggle = ({ id, checked }: ChangeTodoTogglePayload) => {
    const todo = this.list.find(todo => todo.id === id);

    if (todo) {
      todo.checked = checked;
    }
  };

  removeTodo = (id: string) => {
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
