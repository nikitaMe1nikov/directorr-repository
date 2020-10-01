import { put, takeEvery, delay } from 'redux-saga/effects';
import { createActionFactory } from '@nimel/directorr';
import localforage from 'localforage';

import {
  actionGetTodos,
  actionAddTodo,
  actionRemoveTodo,
  actionLoading,
  actionGetTodosSuccess,
  actionAddTodoSuccess,
  actionGetTodosError,
  actionAddTodoError,
  actionRemoveTodoSuccess,
  actionRemoveTodoError,
} from 'decorators';
import {
  TodosSuccessPayload,
  AddTodoSuccessPayload,
  RemoveTodoSuccessPayload,
  AddTodoPayload,
  RemoveTodoPayload,
  Todo,
} from 'types';

localforage.config({ name: 'directorr-todo' });

export const createActionLoading = createActionFactory<void>(actionLoading.type);
export const createActionGetTodosSuccess = createActionFactory<TodosSuccessPayload>(
  actionGetTodosSuccess.type
);
export const createGetTodosError = createActionFactory<void>(actionGetTodosError.type);
export const createActionAddTodoSuccess = createActionFactory<AddTodoSuccessPayload>(
  actionAddTodoSuccess.type
);
export const createActionAddTodoError = createActionFactory<void>(actionAddTodoError.type);
export const createActionRemoveTodoSuccess = createActionFactory<RemoveTodoSuccessPayload>(
  actionRemoveTodoSuccess.type
);
export const createActionRemoveTodoError = createActionFactory<void>(actionRemoveTodoError.type);

const DELAY = 600;

function* getTodos() {
  yield put(createActionLoading());

  try {
    yield delay(DELAY);
    const length = yield localforage.length();
    let todos: Todo[] = [];
    todos = yield localforage.iterate((data: string, id, idx) => {
      todos.push({ id, ...JSON.parse(data) });

      if (idx === length) return todos;
    });
    yield put(createActionGetTodosSuccess({ todos }));
  } catch (e) {
    yield put(createGetTodosError());
  }
}

function* addTodo({ payload }: { payload: AddTodoPayload }) {
  yield put(createActionLoading());
  try {
    yield delay(DELAY);
    yield localforage.setItem(
      payload.id,
      JSON.stringify({ text: payload.text, checked: payload.checked })
    );
    yield put(createActionAddTodoSuccess(payload));
  } catch (e) {
    yield put(createActionAddTodoError());
  }
}

function* removeTodo({ payload }: { payload: RemoveTodoPayload }) {
  yield put(createActionLoading());
  try {
    yield delay(DELAY);
    yield localforage.removeItem(payload.id);
    yield put(createActionRemoveTodoSuccess(payload));
  } catch (e) {
    yield put(createActionRemoveTodoError());
  }
}

function* sagas() {
  yield takeEvery(actionGetTodos.type, getTodos);
  yield takeEvery(actionAddTodo.type, addTodo);
  yield takeEvery(actionRemoveTodo.type, removeTodo);
}

export default sagas;
