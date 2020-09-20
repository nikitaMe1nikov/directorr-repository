import { historyChange } from '../decorators';
import { HISTORY_ACTIONS } from '../actionTypes';
import { createAction, DISPATCH_EFFECTS_FIELD_NAME } from '@nimel/directorr';

describe('decorators', () => {
  it('historyChange with HISTORY_ACTIONS.POP', () => {
    const effect = jest.fn();
    const pattern = '/';
    const someDiffrent = '/someDiffrent';
    class SomeStore {
      @historyChange(pattern)
      effect = effect;
    }
    const store: any = new SomeStore();

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(HISTORY_ACTIONS.POP, { path: pattern }));

    expect(effect).toBeCalledTimes(1);
    expect(effect).lastCalledWith({ path: pattern, match: {} });

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(HISTORY_ACTIONS.POP, { path: someDiffrent }));

    expect(effect).toBeCalledTimes(2);
    expect(effect).lastCalledWith({ path: someDiffrent });
  });

  it('historyChange with HISTORY_ACTIONS.PUSH', () => {
    const effect = jest.fn();
    const pattern = '/';
    const someDiffrent = '/someDiffrent';
    class SomeStore {
      @historyChange(pattern)
      effect = effect;
    }
    const store: any = new SomeStore();

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(HISTORY_ACTIONS.PUSH, { path: pattern }));

    expect(effect).toBeCalledTimes(1);
    expect(effect).lastCalledWith({ path: pattern, match: {} });

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(HISTORY_ACTIONS.PUSH, { path: someDiffrent }));

    expect(effect).toBeCalledTimes(2);
    expect(effect).lastCalledWith({ path: someDiffrent });
  });

  it('historyChange with HISTORY_ACTIONS.REPLACE', () => {
    const effect = jest.fn();
    const pattern = '/';
    const someDiffrent = '/someDiffrent';
    class SomeStore {
      @historyChange(pattern)
      effect = effect;
    }
    const store: any = new SomeStore();

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(HISTORY_ACTIONS.REPLACE, { path: pattern }));

    expect(effect).toBeCalledTimes(1);
    expect(effect).lastCalledWith({ path: pattern, match: {} });

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(HISTORY_ACTIONS.REPLACE, { path: someDiffrent })
    );

    expect(effect).toBeCalledTimes(2);
    expect(effect).lastCalledWith({ path: someDiffrent });
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

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(HISTORY_ACTIONS.POP, { path: pathWithParams }));

    expect(effect).toBeCalledTimes(1);
    expect(effect).lastCalledWith({ path: pathWithParams, match: { params: { id } } });
  });
});
