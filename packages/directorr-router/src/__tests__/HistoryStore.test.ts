import {
  createAction,
  DISPATCH_EFFECTS_FIELD_NAME,
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
} from '@nimel/directorr';
import { createMemoryHistory } from 'history';
import qs from 'query-string';
import { Action } from '../types';
import { ROUTER_STORE_ACTIONS } from '../actionTypes';
import HistoryStore from '../HistoryStore';
import { reloadWindow } from '../utils';

jest.mock('../utils', () => {
  const originalModule = jest.requireActual('../utils');

  return {
    ...originalModule,
    reloadWindow: jest.fn(),
  };
});

describe('HistoryStore', () => {
  it('constructor', () => {
    const history = createMemoryHistory();
    jest.spyOn(history, 'listen');
    const { pathname: path, search, state } = history.location;
    const store = new HistoryStore(history);

    expect(history.listen).toBeCalledTimes(1);
    expect(history.listen).lastCalledWith(store.dispatchAction);
    expect(store).toMatchObject({
      path,
      state,
      queryObject: qs.parse(search),
    });
  });

  it('init', () => {
    const path = 'path';
    const queryObject = {};
    const state = {};
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(DIRECTORR_INIT_STORE_ACTION, { StoreConstructor: HistoryStore })
    );

    expect(store).toMatchObject({});

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        StoreConstructor: HistoryStore,
        initOptions: { path, queryObject, state },
      })
    );

    expect(store).toMatchObject({ state, path, queryObject });
  });

  it('destroy', () => {
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);
    jest.spyOn(store, 'unsubHistory');

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(DIRECTORR_DESTROY_STORE_ACTION, { StoreConstructor: HistoryStore })
    );

    expect(store.unsubHistory).toBeCalledTimes(1);
  });

  it('set state', () => {
    const path = '/path';
    const queryObject = {};
    const state = {};
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(ROUTER_STORE_ACTIONS.STATE, { StoreConstructor: HistoryStore })
    );

    expect(store).toMatchObject({ path: '/', queryObject, state: null });

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(ROUTER_STORE_ACTIONS.STATE, {
        StoreConstructor: HistoryStore,
        initOptions: { path, queryObject, state },
      })
    );

    expect(store).toMatchObject({ path, queryObject, state });
  });

  it('history push', () => {
    const path = '/path';
    const id = 12;
    const queryObject = { id };
    const state = {};
    const action = Action.POP;
    const payload = {
      path,
      queryObject,
      state,
      action,
    };
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);

    expect(store.toHistoryPush({})).toEqual({});
    expect(store).toMatchObject({
      path: undefined,
      queryObject: undefined,
      state: undefined,
      action: undefined,
    });

    expect(store.toHistoryPush(payload)).toEqual(payload);
    expect(store).toMatchObject(payload);
  });

  it('history pop', () => {
    const path = '/path';
    const id = 12;
    const queryObject = { id };
    const state = {};
    const action = Action.POP;
    const payload = {
      path,
      queryObject,
      state,
      action,
    };
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);

    expect(store.toHistoryPop({})).toEqual({});
    expect(store).toMatchObject({
      path: undefined,
      queryObject: undefined,
      state: undefined,
      action: undefined,
    });

    expect(store.toHistoryPop(payload)).toEqual(payload);
    expect(store).toMatchObject(payload);
  });

  it('history replace', () => {
    const path = '/path';
    const id = 12;
    const queryObject = { id };
    const state = {};
    const action = Action.POP;
    const payload = {
      path,
      queryObject,
      state,
      action,
    };
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);

    expect(store.toHistoryReplace({})).toEqual({});
    expect(store).toMatchObject({
      path: undefined,
      queryObject: undefined,
      state: undefined,
      action: undefined,
    });

    expect(store.toHistoryReplace(payload)).toEqual(payload);
    expect(store).toMatchObject(payload);
  });

  it('router push', () => {
    const path = '/path';
    const id = 12;
    const queryObject = { id };
    const state = {};
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);
    jest.spyOn(history, 'push');

    expect(store.push(path)).toEqual({ path, queryObject: undefined, state: undefined });
    expect(history.push).toBeCalledTimes(1);
    expect(history.push).lastCalledWith(path, undefined);

    expect(store.push(path, queryObject, state)).toEqual({ path, queryObject, state });
    expect(history.push).toBeCalledTimes(2);
    expect(history.push).lastCalledWith(`${path}?id=${id}`, state);
  });

  it('router replace', () => {
    const path = '/path';
    const id = 12;
    const queryObject = { id };
    const state = {};
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);
    jest.spyOn(history, 'replace');

    expect(store.replace(path)).toEqual({ path, queryObject: undefined, state: undefined });
    expect(history.replace).toBeCalledTimes(1);
    expect(history.replace).lastCalledWith(path, undefined);

    expect(store.replace(path, queryObject, state)).toEqual({ path, queryObject, state });
    expect(history.replace).toBeCalledTimes(2);
    expect(history.replace).lastCalledWith(`${path}?id=${id}`, state);
  });

  it('router back', () => {
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);
    jest.spyOn(history, 'back');

    expect(store.back()).toBeUndefined();
    expect(history.back).toBeCalledTimes(1);
    expect(history.back).lastCalledWith();
  });

  it('router forward', () => {
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);
    jest.spyOn(history, 'forward');

    expect(store.forward()).toBeUndefined();
    expect(history.forward).toBeCalledTimes(1);
    expect(history.forward).lastCalledWith();
  });

  it('router go', () => {
    const index = 5;
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);
    jest.spyOn(history, 'go');

    expect(store.goTo(index)).toEqual({ index });
    expect(history.go).toBeCalledTimes(1);
    expect(history.go).lastCalledWith(index);
  });

  it('router reload', () => {
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);

    expect(store.reload()).toBeUndefined();
    expect(reloadWindow).toBeCalledTimes(1);
  });

  it('router block', () => {
    const blocker = jest.fn();
    const handler = jest.fn().mockImplementation(v => v);
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);
    jest.spyOn(history, 'block').mockImplementation(handler);

    expect(store.block(blocker)).toEqual({ blocker });
    expect(store.blockState).toEqual([blocker, blocker]);
    expect(history.block).toBeCalledTimes(1);
    expect(history.block).lastCalledWith(blocker);
  });

  it('router cancel block', () => {
    const blocker = jest.fn();
    const someFunc = jest.fn();
    const handler = jest.fn().mockImplementation(v => v);
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);
    jest.spyOn(history, 'block').mockImplementation(handler);

    expect(store.block(blocker)).toEqual({ blocker });
    expect(store.blockState).toEqual([blocker, blocker]);
    expect(blocker).toBeCalledTimes(0);

    expect(store.cancelBlock(someFunc)).toEqual({ blocker: someFunc });
    expect(blocker).toBeCalledTimes(0);

    expect(store.cancelBlock(blocker)).toEqual({ blocker });
    expect(blocker).toBeCalledTimes(1);
  });

  it('dispatchAction', () => {
    const path = '/';
    const queryObject = {};
    const state = {};
    const history = createMemoryHistory({ initialEntries: [{ key: path, state }] });
    const store: any = new HistoryStore(history);

    store.dispatchAction({
      location: {
        pathname: path,
        search: '',
        state,
      },
      action: Action.POP,
    });

    expect(store).toMatchObject({
      path,
      queryObject,
      state,
    });
  });

  it('subscribe logic', () => {
    const handler = jest.fn();
    const path = '/';
    const task = {
      location: {
        pathname: path,
        search: '',
        state: {},
      },
      action: Action.POP,
    };
    const history = createMemoryHistory({ initialEntries: [path] });
    const store: any = new HistoryStore(history);

    store.subscribe(handler);
    store.dispatchAction(task);

    expect(handler).toBeCalledTimes(1);
    expect(handler).lastCalledWith(task);

    store.unsubscribe(handler);

    store.dispatchAction(task);

    expect(handler).toBeCalledTimes(1);
    expect(handler).lastCalledWith(task);
  });

  it('toJSON', () => {
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);

    expect(store.toJSON()).toBeUndefined();
  });
});
