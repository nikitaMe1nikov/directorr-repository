import { MiddlewareAdapter, ReduxMiddlewareAdapter } from '../MiddlewareAdapters';
import { action } from './mocks';

describe('MiddlewareAdapters', () => {
  it('MiddlewareAdapter', () => {
    const middleware = jest.fn();
    const runNextMiddleware = jest.fn();
    const index = 1;
    const directorr = {} as any;

    const obj = new MiddlewareAdapter(middleware, runNextMiddleware, index, directorr);

    obj.run(action);

    expect(middleware).toHaveBeenCalledTimes(1);
    expect(middleware).toHaveBeenLastCalledWith(action, obj.next, directorr);

    obj.next(action);

    expect(runNextMiddleware).toHaveBeenCalledTimes(1);
    expect(runNextMiddleware).toHaveBeenLastCalledWith(index, action);
  });

  it('ReduxMiddlewareAdapter', () => {
    const middlewareLogic = jest.fn();
    const middleware = (store: any) => (next: any) => (action: any) => {
      middlewareLogic(store, next, action);
    };
    const runNextMiddleware = jest.fn();
    const index = 1;
    const directorr = {} as any;
    const store = {} as any;

    const obj = new ReduxMiddlewareAdapter(middleware, runNextMiddleware, index, directorr, store);

    obj.run(action);

    expect(middlewareLogic).toHaveBeenCalledTimes(1);
    expect(middlewareLogic).toHaveBeenLastCalledWith(store, obj.next, action);

    obj.next(action);

    expect(runNextMiddleware).toHaveBeenCalledTimes(1);
    expect(runNextMiddleware).toHaveBeenLastCalledWith(index, action);
  });
});
