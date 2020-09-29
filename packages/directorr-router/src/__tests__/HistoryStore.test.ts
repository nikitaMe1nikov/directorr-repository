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

    expect(store.toHistoryPush({})).toStrictEqual({});
    expect(store).toMatchObject({
      path: undefined,
      queryObject: undefined,
      state: undefined,
      action: undefined,
    });

    expect(store.toHistoryPush(payload)).toBe(payload);
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

    expect(store.toHistoryPop(payload)).toBe(payload);
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

    expect(store.toHistoryReplace({})).toStrictEqual({});
    expect(store).toMatchObject({
      path: undefined,
      queryObject: undefined,
      state: undefined,
      action: undefined,
    });

    expect(store.toHistoryReplace(payload)).toBe(payload);
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

    expect(store.push(path)).toStrictEqual({ path, queryObject: undefined, state: undefined });
    expect(history.push).toBeCalledTimes(1);
    expect(history.push).lastCalledWith(path, undefined);

    expect(store.push(path, queryObject, state)).toStrictEqual({ path, queryObject, state });
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

    expect(store.replace(path)).toStrictEqual({ path, queryObject: undefined, state: undefined });
    expect(history.replace).toBeCalledTimes(1);
    expect(history.replace).lastCalledWith(path, undefined);

    expect(store.replace(path, queryObject, state)).toStrictEqual({ path, queryObject, state });
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

    expect(store.goTo(index)).toStrictEqual({ index });
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

    expect(store.block(blocker)).toStrictEqual({ blocker });
    expect(store.blockState).toStrictEqual([blocker, blocker]);
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

    expect(store.block(blocker)).toStrictEqual({ blocker });
    expect(store.blockState).toStrictEqual([blocker, blocker]);
    expect(blocker).toBeCalledTimes(0);

    expect(store.cancelBlock(someFunc)).toStrictEqual({ blocker: someFunc });
    expect(blocker).toBeCalledTimes(0);

    expect(store.cancelBlock(blocker)).toStrictEqual({ blocker });
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
    const taskPop = {
      location: {
        pathname: path,
        search: '',
        state: {},
      },
      action: Action.POP,
    };
    const taskPush = {
      location: {
        pathname: path,
        search: '',
        state: {},
      },
      action: Action.PUSH,
    };
    const taskReplace = {
      location: {
        pathname: path,
        search: '',
        state: {},
      },
      action: Action.REPLACE,
    };
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);

    store.subscribe(handler);
    store.dispatchAction(taskPop);

    expect(handler).toBeCalledTimes(1);
    expect(handler).lastCalledWith(taskPop);

    store.dispatchAction(taskPush);

    expect(handler).toBeCalledTimes(2);
    expect(handler).lastCalledWith(taskPush);

    store.dispatchAction(taskReplace);

    expect(handler).toBeCalledTimes(3);
    expect(handler).lastCalledWith(taskReplace);

    store.unsubscribe(handler);

    store.dispatchAction(taskPop);

    expect(handler).toBeCalledTimes(3);
  });

  it('unsubscribe when subscribe handler call', () => {
    const taskPop = {
      location: {
        pathname: '/path',
        search: '',
        state: {},
      },
      action: Action.POP,
    };
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);
    const handlerUnsub = jest.fn().mockImplementation(() => store.unsubscribe(handlerUnsub));
    const handler = jest.fn();

    store.subscribe(handlerUnsub);
    store.subscribe(handler);
    store.dispatchAction(taskPop);

    expect(handlerUnsub).toBeCalledTimes(1);
    expect(handlerUnsub).lastCalledWith(taskPop);
    expect(handler).toBeCalledTimes(1);
    expect(handler).lastCalledWith(taskPop);
  });

  it('toJSON', () => {
    const history = createMemoryHistory();
    const store: any = new HistoryStore(history);

    expect(store.toJSON()).toBeUndefined();
  });
});
