import { observable, computed, makeObservable } from 'mobx';
import { connectStore, injectStore, whenInit, createDispatcher } from '@nimel/directorr';

import TextInputStore, {
  effectInputComplate,
  TextInputComplatePayload,
} from 'components/TextInput/TextInput.store';
import TodoItemStore from 'page/TodoItem/TodoItem.store';
import TodosStore from './TodosList.store';
import {
  actionAllTodoComplated,
  effectAllTodoComplated,
  actionAllTodoActive,
  effectAllTodoActive,
  effectClearComplatedTodo,
  effectChangeFilter,
  actionChangeTodosList,
  actionGetTodos,
  effectLoading,
  effectGetTodosSuccess,
  effectGetTodosError,
  actionAddTodo,
  effectAddTodoSuccess,
  effectAddTodoError,
  actionRemoveTodo,
  effectRemoveTodoSuccess,
  effectRemoveTodoError,
} from 'decorators';
import {
  ChangeFilterPayload,
  FilterType,
  TodosSuccessPayload,
  AddTodoSuccessPayload,
  RemoveTodoSuccessPayload,
} from 'types';

function wait() {
  return new Promise(res => setTimeout(res, 3000));
}

export default class Page {
  constructor() {
    makeObservable(this);
  }

  @injectStore(TodosStore) todosStore: TodosStore;
  @connectStore() input = new TextInputStore();
  @observable filter = FilterType.ALL;
  @observable isLoading = false;
  dispatcher = createDispatcher(this);

  @computed get todos() {
    if (this.filter === FilterType.ALL) return this.todosStore.list;

    if (this.filter === FilterType.ACTIVE)
      return this.todosStore.list.filter(({ checked }) => !checked);

    return this.todosStore.list.filter(({ checked }) => checked);
  }

  @actionAddTodo
  addTodo = (text: string) => ({
    id: Math.random().toString(),
    text,
    checked: false,
  });

  @effectAddTodoSuccess
  @actionChangeTodosList
  toAddTodoToList = (todo: AddTodoSuccessPayload) => {
    this.input.reset();

    this.todosStore.addTodo(todo);
  };

  @actionRemoveTodo
  removeTodo = ({ id }: TodoItemStore) => ({ id });

  @effectRemoveTodoSuccess
  @actionChangeTodosList
  toRemoveTodoToList = ({ id }: RemoveTodoSuccessPayload) => {
    this.todosStore.removeTodo(id);
  };

  @actionAllTodoComplated
  allTodoComplated = () => {};

  @effectAllTodoComplated
  toAllComplated = () => this.todosStore.allTodoComplated();

  @actionAllTodoActive
  allTodoActive = () => {};

  @effectAllTodoActive
  toAllActive = () => this.todosStore.allTodoActive();

  @effectInputComplate
  onComplateInput = ({ value }: TextInputComplatePayload) => {
    if (value && !this.isLoading) this.addTodo(value);
  };

  @effectClearComplatedTodo
  toClearTodos = () => {
    this.todosStore.list.filter(todo => todo.checked).forEach(todo => this.removeTodo(todo));
  };

  @effectChangeFilter
  toChangeFilter = ({ filter }: ChangeFilterPayload) => {
    this.filter = filter;
  };

  @whenInit
  init = () => {
    this.getTodos();
    // this.test();
  };

  test = async () => {
    await wait();
    const { payload } = await this.dispatcher([actionAddTodo], {
      id: 'string',
      text: 'string',
      checked: false,
    });
    console.log('result', payload);
  };

  @actionGetTodos
  getTodos = () => {};

  @effectGetTodosSuccess
  @actionChangeTodosList
  setTodos = ({ todos }: TodosSuccessPayload) => {
    if (todos) this.todosStore.replaceTodos(todos);
  };

  @effectLoading
  toisLoading = () => {
    this.isLoading = true;
  };

  @effectGetTodosSuccess
  @effectGetTodosError
  @effectAddTodoSuccess
  @effectAddTodoError
  @effectRemoveTodoSuccess
  @effectRemoveTodoError
  toDisableisLoading = () => {
    this.isLoading = false;
  };
}
