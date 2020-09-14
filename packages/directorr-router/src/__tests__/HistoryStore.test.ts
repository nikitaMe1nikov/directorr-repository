import { ROUTER_STORE_ACTIONS } from '@nimel/directorr-router';
import {
  createAction,
  DISPATCH_EFFECTS_FIELD_NAME,
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
} from '@nimel/directorr';
import { createMemoryHistory } from 'history';
import qs from 'query-string';
import { Action } from '../types';
import HistoryStore from '../HistoryStore';

describe('HistoryStore', () => {
  it('constructor', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    jest.spyOn(history, 'listen');
    const { pathname: path, search, state } = history.location;
    const store = new HistoryStore(history);

    expect(history.listen).toHaveBeenCalledTimes(1);
    expect(history.listen).toHaveBeenLastCalledWith(store.dispatchAction);
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
    const history = createMemoryHistory({ initialEntries: ['/'] });
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
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const store: any = new HistoryStore(history);
    jest.spyOn(store, 'unsubHistory');

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(DIRECTORR_DESTROY_STORE_ACTION, { StoreConstructor: HistoryStore })
    );

    expect(store.unsubHistory).toHaveBeenCalledTimes(1);
  });

  it('set state', () => {
    const path = '/';
    const queryObject = {};
    const state = {};
    const history = createMemoryHistory({ initialEntries: [{ key: path, state }] });
    const store: any = new HistoryStore(history);

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(ROUTER_STORE_ACTIONS.STATE, { StoreConstructor: HistoryStore })
    );

    expect(store.state).toEqual(state);
    expect(store.path).toEqual(path);
    expect(store.queryObject).toEqual(queryObject);

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(ROUTER_STORE_ACTIONS.STATE, {
        StoreConstructor: HistoryStore,
        initOptions: { path, queryObject, state },
      })
    );

    expect(store).toMatchObject({ path, queryObject, state });
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

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(task);

    store.unsubscribe(handler);

    store.dispatchAction(task);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(task);
  });

  it('toJSON', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const store: any = new HistoryStore(history);

    expect(store.toJSON()).toBeUndefined();
  });
});
