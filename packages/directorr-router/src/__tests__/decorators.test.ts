import {
  historyChange,
  actionHistoryPop,
  actionHistoryPush,
  actionHistoryReplace,
} from '../decorators';
import { createAction, DISPATCH_EFFECTS_FIELD_NAME } from '@nimel/directorr';

describe('decorators', () => {
  it(`historyChange with ${actionHistoryPop.type}`, () => {
    const effect = jest.fn();
    const pattern = '/';
    const someDiffrent = '/someDiffrent';
    const queryObject = { prop: 'prop' };
    class SomeStore {
      @historyChange(pattern)
      effect = effect;
    }
    const store: any = new SomeStore();

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(actionHistoryPop.type, { path: pattern }));

    expect(effect).toBeCalledTimes(1);
    expect(effect).lastCalledWith({ path: pattern, match: true, queryObject: {} });

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(actionHistoryPop.type, { path: pattern, queryObject })
    );

    expect(effect).toBeCalledTimes(2);
    expect(effect).lastCalledWith({ path: pattern, match: true, queryObject });

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(actionHistoryPop.type, { path: someDiffrent }));

    expect(effect).toBeCalledTimes(3);
    expect(effect).lastCalledWith({ path: someDiffrent, match: false, queryObject: {} });

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(actionHistoryPop.type, { path: someDiffrent, queryObject })
    );

    expect(effect).toBeCalledTimes(4);
    expect(effect).lastCalledWith({ path: someDiffrent, match: false, queryObject });
  });

  it(`historyChange with ${actionHistoryPush.type}`, () => {
    const effect = jest.fn();
    const pattern = '/';
    const someDiffrent = '/someDiffrent';
    class SomeStore {
      @historyChange(pattern)
      effect = effect;
    }
    const store: any = new SomeStore();

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(actionHistoryPush.type, { path: pattern }));

    expect(effect).toBeCalledTimes(1);
    expect(effect).lastCalledWith({ path: pattern, match: true, queryObject: {} });

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(actionHistoryPush.type, { path: someDiffrent })
    );

    expect(effect).toBeCalledTimes(2);
    expect(effect).lastCalledWith({ path: someDiffrent, match: false, queryObject: {} });
  });

  it(`historyChange with ${actionHistoryReplace.type}`, () => {
    const effect = jest.fn();
    const pattern = '/';
    const someDiffrent = '/someDiffrent';
    class SomeStore {
      @historyChange(pattern)
      effect = effect;
    }
    const store: any = new SomeStore();

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(actionHistoryReplace.type, { path: pattern }));

    expect(effect).toBeCalledTimes(1);
    expect(effect).lastCalledWith({ path: pattern, match: true, queryObject: {} });

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(actionHistoryReplace.type, { path: someDiffrent })
    );

    expect(effect).toBeCalledTimes(2);
    expect(effect).lastCalledWith({ path: someDiffrent, match: false, queryObject: {} });
  });

  it('historyChange use in class with params', () => {
    const effect = jest.fn();
    const id = '12';
    const patternWithParams = `/:id`;
    const pathWithParams = `/${id}`;
    class SomeStore {
      @historyChange(patternWithParams)
      effect = effect;
    }
    const store: any = new SomeStore();

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(actionHistoryPop.type, { path: pathWithParams })
    );

    expect(effect).toBeCalledTimes(1);
    expect(effect).lastCalledWith({
      path: pathWithParams,
      match: true,
      queryObject: { params: { id } },
    });
  });
});
