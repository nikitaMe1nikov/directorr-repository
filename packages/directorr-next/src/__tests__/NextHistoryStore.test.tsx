import { ROUTER_STORE_ACTIONS } from '@nimel/directorr-router';
import {
  createAction,
  DISPATCH_EFFECTS_FIELD_NAME,
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
} from '@nimel/directorr';
import { SingletonRouter } from 'next/router';
import NextHistoryStore, { ROUTER_EVENT } from '../NextHistoryStore';
import { reloadWindow } from '../utils';

jest.mock('../utils');

class RouterMock {
  asPath: string;
  query: any;
  pathname: string;
  events = {
    on: jest.fn(),
    off: jest.fn(),
  };
  router = {
    asPath: 'asPath',
    query: {},
    pathname: 'pathname',
  };

  push = jest.fn();
  replace = jest.fn();
  back = jest.fn();
}

describe('NextHistoryStore', () => {
  it('constructor', () => {
    const router = (new RouterMock() as unknown) as SingletonRouter;
    const store = new NextHistoryStore(router);

    expect(router.events.on).toHaveBeenCalledTimes(1);
    expect(router.events.on).toHaveBeenLastCalledWith(ROUTER_EVENT, store.dispatchAction);
    expect(store).toMatchObject({
      path: router.router?.asPath,
      pattern: router.router?.pathname,
      queryObject: router.router?.query,
    });
  });

  it('init', () => {
    const path = 'path';
    const queryObject = {};
    const pattern = 'pattern';
    const router = (new RouterMock() as unknown) as SingletonRouter;
    const store: any = new NextHistoryStore(router);

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(DIRECTORR_INIT_STORE_ACTION, { StoreConstructor: NextHistoryStore })
    );

    expect(store).toMatchObject({});

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(DIRECTORR_INIT_STORE_ACTION, {
        StoreConstructor: NextHistoryStore,
        initOptions: { pattern, path, queryObject },
      })
    );

    expect(store).toMatchObject({ pattern, path, queryObject });
  });

  it('destroy', () => {
    const router = (new RouterMock() as unknown) as SingletonRouter;
    const store: any = new NextHistoryStore(router);

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(DIRECTORR_DESTROY_STORE_ACTION, { StoreConstructor: NextHistoryStore })
    );

    expect(router.events.off).toHaveBeenCalledTimes(1);
    expect(router.events.off).toHaveBeenLastCalledWith(ROUTER_EVENT, store.dispatchAction);
  });

  it('set state', () => {
    const path = 'path';
    const queryObject = {};
    const pattern = 'pattern';
    const router = (new RouterMock() as unknown) as SingletonRouter;
    const store: any = new NextHistoryStore(router);

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(ROUTER_STORE_ACTIONS.STATE, { StoreConstructor: NextHistoryStore })
    );

    expect(store.pattern).not.toBe(pattern);
    expect(store.path).not.toBe(path);
    expect(store.queryObject).not.toBe(queryObject);

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(ROUTER_STORE_ACTIONS.STATE, {
        StoreConstructor: NextHistoryStore,
        initOptions: { pattern, path, queryObject },
      })
    );

    expect(store).toMatchObject({ pattern, path, queryObject });
  });

  it('push', () => {
    const path = 'path';
    const queryObject = {};
    const router = (new RouterMock() as unknown) as SingletonRouter;
    const store: any = new NextHistoryStore(router);

    store.push(path, queryObject);

    expect(router.push).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenLastCalledWith({ pathname: path, query: queryObject });
  });

  it('replace', () => {
    const path = 'path';
    const queryObject = {};
    const router = (new RouterMock() as unknown) as SingletonRouter;
    const store: any = new NextHistoryStore(router);

    store.replace(path, queryObject);

    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenLastCalledWith({ pathname: path, query: queryObject });
  });

  it('back', () => {
    const router = (new RouterMock() as unknown) as SingletonRouter;
    const store: any = new NextHistoryStore(router);

    store.back();

    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it('reload', () => {
    const router = (new RouterMock() as unknown) as SingletonRouter;
    const store: any = new NextHistoryStore(router);

    store.reload();

    expect(reloadWindow).toHaveBeenCalledTimes(1);
  });

  it('dispatchAction', () => {
    const router = (new RouterMock() as unknown) as SingletonRouter;
    const store: any = new NextHistoryStore(router);

    store.dispatchAction();

    expect(store).toMatchObject({
      path: router.router?.asPath,
      pattern: router.router?.pathname,
      queryObject: router.router?.query,
    });
  });

  it('toJSON', () => {
    const router = (new RouterMock() as unknown) as SingletonRouter;
    const store: any = new NextHistoryStore(router);

    expect(store.toJSON()).toBeUndefined();
  });
});