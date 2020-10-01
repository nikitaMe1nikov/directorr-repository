import { action, createActionAndEffect } from '@nimel/directorr';
import {
  ChangeFilterPayload,
  TodosSuccessPayload,
  AddTodoPayload,
  AddTodoSuccessPayload,
  RemoveTodoPayload,
  RemoveTodoSuccessPayload,
  ChangeTodoTogglePayload,
} from 'types';

export const [actionAllTodoComplated, effectAllTodoComplated] = createActionAndEffect<void>(
  'ALL_TODO_COMPLATED'
);
export const [actionAllTodoActive, effectAllTodoActive] = createActionAndEffect<void>(
  'ALL_TODO_ACTIVE'
);
export const [actionClearComplatedTodo, effectClearComplatedTodo] = createActionAndEffect<void>(
  'CLEAR_COMPLATED_TODO'
);
export const [actionChangeFilter, effectChangeFilter] = createActionAndEffect<ChangeFilterPayload>(
  'CHANGE_FILTER'
);
export const [actionChangeTodoToggle, effectChangeTodoToggle] = createActionAndEffect<
  ChangeTodoTogglePayload
>('CHANGE_TODO_TOGGLE');
export const [actionChangeTodosList, effectChangeTodosList] = createActionAndEffect<void>(
  'CHANGE_TODOS_LIST'
);
export const actionGetTodos = action<void>('GET_TODOS');
export const [actionLoading, effectLoading] = createActionAndEffect<void>('LOADING');
export const [actionGetTodosSuccess, effectGetTodosSuccess] = createActionAndEffect<
  TodosSuccessPayload
>('GET_TODOS_SUCCESS');
export const [actionGetTodosError, effectGetTodosError] = createActionAndEffect<void>(
  'GET_TODOS_ERROR'
);
export const actionAddTodo = action<AddTodoPayload>('ADD_TODO');
export const [actionAddTodoSuccess, effectAddTodoSuccess] = createActionAndEffect<
  AddTodoSuccessPayload
>('ADD_TODO_SUCCESS');
export const [actionAddTodoError, effectAddTodoError] = createActionAndEffect<void>(
  'ADD_TODO_ERROR'
);
export const actionRemoveTodo = action<RemoveTodoPayload>('REMOVE_TODO');
export const [actionRemoveTodoSuccess, effectRemoveTodoSuccess] = createActionAndEffect<
  RemoveTodoSuccessPayload
>('REMOVE_TODO_SUCCESS');
export const [actionRemoveTodoError, effectRemoveTodoError] = createActionAndEffect<void>(
  'REMOVE_TODO_ERROR'
);
