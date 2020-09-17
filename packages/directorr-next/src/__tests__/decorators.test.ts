import { historyChange } from '../decorators';
import { HISTORY_ACTIONS } from '@nimel/directorr-router';
import { createAction, DISPATCH_EFFECTS_FIELD_NAME } from '@nimel/directorr';

describe('utils', () => {
  it('historyChange with HISTORY_ACTIONS.POP', () => {
    const effect = jest.fn();
    const pattern = '/';
    const someDiffrentPattern = '/someDiffrent';
    class SomeStore {
      @historyChange(pattern)
      effect = effect;
    }
    const store: any = new SomeStore();

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(HISTORY_ACTIONS.POP, { pattern }));

    expect(effect).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenLastCalledWith({ pattern, match: true });

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(HISTORY_ACTIONS.POP, { pattern: someDiffrentPattern })
    );

    expect(effect).toHaveBeenCalledTimes(2);
    expect(effect).toHaveBeenLastCalledWith({ pattern: someDiffrentPattern });
  });
});
