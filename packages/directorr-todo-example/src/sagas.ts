import { put, takeEvery, delay } from 'redux-saga/effects';
import { Action } from '@nimel/directorr';
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
import { AddTodoPayload, RemoveTodoPayload, Todo } from 'types';

localforage.config({ name: 'directorr-todo' });

const DELAY = 600;

function* getTodos() {
  yield put(actionLoading.createAction());

  try {
    yield delay(DELAY);
    const length: number = yield localforage.length();
    let todos: Todo[] = [];
    todos = yield localforage.iterate((data: string, id, idx) => {
      todos.push({ id, ...JSON.parse(data) });

      if (idx === length) return todos;
    });
    yield put(actionGetTodosSuccess.createAction({ todos }));
  } catch (e) {
    yield put(actionGetTodosError.createAction());
  }
}

function* addTodo({ payload }: Action<string, AddTodoPayload>) {
  yield put(actionLoading.createAction());
  try {
    yield delay(DELAY);
    yield localforage.setItem(
      payload.id,
      JSON.stringify({ text: payload.text, checked: payload.checked })
    );
    yield put(actionAddTodoSuccess.createAction(payload));
  } catch (e) {
    yield put(actionAddTodoError.createAction());
  }
}

function* removeTodo({ payload }: Action<string, RemoveTodoPayload>) {
  yield put(actionLoading.createAction());
  try {
    yield delay(DELAY);
    yield localforage.removeItem(payload.id);
    yield put(actionRemoveTodoSuccess.createAction(payload));
  } catch (e) {
    yield put(actionRemoveTodoError.createAction());
  }
}

function* sagas() {
  yield takeEvery(actionGetTodos.type, getTodos);
  yield takeEvery(actionAddTodo.type, addTodo);
  yield takeEvery(actionRemoveTodo.type, removeTodo);
}

export default sagas;
