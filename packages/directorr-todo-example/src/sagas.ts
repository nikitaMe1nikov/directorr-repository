import { put, takeEvery, delay } from 'redux-saga/effects';
import { config } from '@nimel/directorr';
import localforage from 'localforage';

localforage.config({ name: 'directorr-todo' });

export const GET_TODOS = 'GET_TODOS';
export const LOADING = 'LOADING';
export const GET_TODOS_SUCCESS = 'GET_TODOS_SUCCESS';
export const GET_TODOS_ERROR = 'GET_TODOS_ERROR';
export const ADD_TODO = 'ADD_TODOS';
export const ADD_TODO_SUCCESS = 'ADD_TODOS_SUCCESS';
export const ADD_TODO_ERROR = 'ADD_TODOS_ERROR';
export const REMOVE_TODO = 'REMOVE_TODO';
export const REMOVE_TODO_SUCCESS = 'REMOVE_TODO_SUCCESS';
export const REMOVE_TODO_ERROR = 'REMOVE_TODO_ERROR';
const { createAction } = config;

const DELAY = 600;

function* getTodos() {
  yield put(createAction(LOADING));

  try {
    yield delay(DELAY);
    const length = yield localforage.length();
    let todos: any[] = [];
    todos = yield localforage.iterate((text, id, idx) => {
      todos.push({ id, text });

      if (idx === length) return todos;
    });
    yield put(createAction(GET_TODOS_SUCCESS, todos));
  } catch (e) {
    yield put(createAction(GET_TODOS_ERROR));
  }
}

function* addTodo({ payload }: any) {
  yield put(createAction(LOADING));
  try {
    yield delay(DELAY);
    yield localforage.setItem(payload.id, payload.text);
    yield put(createAction(ADD_TODO_SUCCESS, payload));
  } catch (e) {
    yield put(createAction(ADD_TODO_ERROR));
  }
}

function* removeTodo({ payload }: any) {
  yield put(createAction(LOADING));
  try {
    yield delay(DELAY);
    yield localforage.removeItem(payload.id);
    yield put(createAction(REMOVE_TODO_SUCCESS, payload));
  } catch (e) {
    yield put(createAction(REMOVE_TODO_ERROR));
  }
}

function* sagas() {
  yield takeEvery(GET_TODOS, getTodos);
  yield takeEvery(ADD_TODO, addTodo);
  yield takeEvery(REMOVE_TODO, removeTodo);
}

export default sagas;
