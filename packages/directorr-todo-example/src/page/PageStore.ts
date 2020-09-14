import { observable, computed } from 'mobx';
import { action, effect, connectStore, whenInit } from '@nimel/directorr';

import TextInputStore, { COMPLATE } from 'components/TextInput/TextInputStore';
import TodoItemStore from 'page/TodoItem/TodoItemStore';
import TodosStore, { CHANGE_ITEM_TOGGLE } from './TodosStore';
import {
  GET_TODOS_SUCCESS,
  GET_TODOS_ERROR,
  GET_TODOS,
  ADD_TODO,
  ADD_TODO_SUCCESS,
  REMOVE_TODO,
  REMOVE_TODO_SUCCESS,
  LOADING,
  ADD_TODO_ERROR,
  REMOVE_TODO_ERROR,
} from '../sagas';

export const ALL_TODO_COMPLATED = 'ALL_TODO_COMPLATED';
export const ALL_TODO_ACTIVE = 'ALL_TODO_ACTIVE';
export const CLEAR_COMPLATED_TODO = 'CLEAR_COMPLATED_TODO';
export const CHANGE_FILTER = 'CHANGE_FILTER';
export const CHANGE_TODO_TOGGLE = 'CHANGE_TODO_TOGGLE';
export const CHANGE_TODOS_LIST = 'CHANGE_TODOS_LIST';

export const FILTER_TYPE = {
  ALL: 1,
  ACTIVE: 2,
  COMPLATED: 3,
};

export default class PageStore {
  @connectStore() todosStore = new TodosStore();

  @observable filter = FILTER_TYPE.ALL;

  @observable isLoading = false;

  @computed get todos() {
    if (this.filter === FILTER_TYPE.ALL) return this.todosStore.list;

    if (this.filter === FILTER_TYPE.ACTIVE)
      return this.todosStore.list.filter(({ checked }) => !checked);

    return this.todosStore.list.filter(({ checked }) => checked);
  }

  @connectStore() input = new TextInputStore();

  @action(ADD_TODO)
  addTodo = (text: string) => ({
    id: Math.random().toString(),
    text,
  });

  @effect(ADD_TODO_SUCCESS)
  @action(CHANGE_TODOS_LIST)
  toAddTodoToList = (todo: TodoItemStore) => {
    this.input.reset();

    this.todosStore.addTodo(todo);
  };

  @action(REMOVE_TODO)
  removeTodo = ({ id }: TodoItemStore) => ({ id });

  @effect(REMOVE_TODO_SUCCESS)
  @action(CHANGE_TODOS_LIST)
  toRemoveTodoToList = ({ id }: TodoItemStore) => {
    this.todosStore.removeTodo(id);
  };

  @action(ALL_TODO_COMPLATED)
  allTodoComplated = () => {};

  @effect(ALL_TODO_COMPLATED)
  toAllComplated = () => this.todosStore.allTodoComplated();

  @action(ALL_TODO_ACTIVE)
  allTodoActive = () => {};

  @effect(ALL_TODO_ACTIVE)
  toAllActive = () => this.todosStore.allTodoActive();

  @effect([TextInputStore, COMPLATE])
  onComplateInput = ({ value }: any) => {
    if (value && !this.isLoading) this.addTodo(value);
  };

  @effect(CLEAR_COMPLATED_TODO)
  toClearTodos = () => {
    this.todosStore.list.filter(todo => todo.checked).forEach(todo => this.removeTodo(todo));
  };

  @effect(CHANGE_FILTER)
  toChangeFilter = (newFilter: number) => {
    this.filter = newFilter;
  };

  @effect([TodosStore, CHANGE_ITEM_TOGGLE])
  @action(CHANGE_TODO_TOGGLE)
  whenChangeToggle = () => {};

  @whenInit
  init = () => {
    this.getTodos();
  };

  @action(GET_TODOS)
  getTodos = () => {};

  @effect(GET_TODOS_SUCCESS)
  @action(CHANGE_TODOS_LIST)
  setTodos = (todos: TodoItemStore[]) => {
    if (todos) todos.forEach(todo => this.todosStore.addTodo(todo));
  };

  @effect(LOADING)
  toisLoading = () => {
    this.isLoading = true;
  };

  @effect(GET_TODOS_SUCCESS)
  @effect(GET_TODOS_ERROR)
  @effect(ADD_TODO_SUCCESS)
  @effect(ADD_TODO_ERROR)
  @effect(REMOVE_TODO_SUCCESS)
  @effect(REMOVE_TODO_ERROR)
  toDisableisLoading = () => {
    this.isLoading = false;
  };
}
