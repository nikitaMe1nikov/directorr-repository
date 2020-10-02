import { STORES_FIELD_NAME } from '@nimel/directorr';
import { Action } from '@nimel/directorr-router';
import RouterStore from '../RouterStore';
import { flushPromises } from '../../../../tests/utils';

class HistoryStoreMock {
  static storeName = 'HistoryStore';
  path: '/path';
  action: Action.POP;
}

describe('RouterStore', () => {
  it('historyStore', () => {
    const store = new RouterStore();
    const history = new HistoryStoreMock();

    Object.defineProperty(store, STORES_FIELD_NAME, {
      value: new Map([[HistoryStoreMock.storeName, history]]),
    });

    expect(store.path).toEqual(history.path);
    expect(store.action).toEqual(history.action);
  });

  it('subscribe logic', () => {
    const handler = jest.fn();
    const handlersStack = [];
    const store = new RouterStore();

    Object.defineProperty(store, 'handlersStack', {
      value: handlersStack,
    });

    store.subscribe(handler);

    expect(handlersStack).toHaveLength(1);
    expect(handlersStack).toContain(handler);

    store.unsubscribe(handler);

    expect(handlersStack).toHaveLength(0);

    store.unsubscribe(handler);

    expect(handlersStack).toHaveLength(0);
  });

  it('dispatch action change history', async () => {
    const handleOne = jest.fn().mockReturnValue(Promise.resolve());
    const handlerTwo = jest.fn().mockReturnValue(Promise.resolve());
    const handlerThree = jest.fn();
    const taskOne = {
      path: '/path',
      queryObject: {},
      state: {},
      action: Action.POP,
      pattern: 'pattern',
    };
    const taskTwo = {
      path: '/nextpath',
      queryObject: {},
      state: {},
      action: Action.POP,
      pattern: 'pattern',
    };
    const store = new RouterStore();

    store.subscribe(handleOne);
    store.subscribe(handlerTwo);
    store.subscribe(handlerThree);

    store.whenChangeHistory(taskOne);
    store.whenChangeHistory(taskTwo);

    expect(store.historyQueue).toHaveLength(2);
    expect(handleOne).toBeCalledTimes(1);
    expect(handleOne).lastCalledWith(taskOne);
    expect(handlerTwo).toBeCalledTimes(1);
    expect(handlerTwo).lastCalledWith(taskOne);
    expect(handlerThree).toBeCalledTimes(1);
    expect(handlerThree).lastCalledWith(taskOne);

    await flushPromises();

    expect(store.historyQueue).toHaveLength(0);
    expect(handleOne).toBeCalledTimes(2);
    expect(handleOne).lastCalledWith(taskTwo);
    expect(handlerTwo).toBeCalledTimes(2);
    expect(handlerTwo).lastCalledWith(taskTwo);
    expect(handlerThree).toBeCalledTimes(2);
    expect(handlerThree).lastCalledWith(taskTwo);
  });

  it('unsubscribe when subscribe handler call', () => {
    const task = {
      path: '/path',
      queryObject: {},
      state: {},
      action: Action.POP,
      pattern: 'pattern',
    };
    const store = new RouterStore();
    const handlerUnsub = jest.fn().mockImplementation(() => store.unsubscribe(handlerUnsub));
    const handler = jest.fn();

    store.subscribe(handlerUnsub);
    store.subscribe(handler);
    store.whenChangeHistory(task);

    expect(handlerUnsub).toBeCalledTimes(1);
    expect(handlerUnsub).lastCalledWith(task);
    expect(handler).toBeCalledTimes(1);
    expect(handler).lastCalledWith(task);
  });
});
