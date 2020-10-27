import whenInit from '../whenInit';
import { DIRECTORR_INIT_STORE_ACTION, DISPATCH_ACTION_FIELD_NAME } from '../utils';
import config from '../config';

describe('whenInit', () => {
  it('use in class', () => {
    const effect = jest.fn();

    class SomeClass {
      @whenInit
      effect = effect;
    }

    const action = config.createAction(DIRECTORR_INIT_STORE_ACTION, {
      StoreConstructor: SomeClass,
    });

    const obj = new SomeClass();

    (obj as any)[DISPATCH_ACTION_FIELD_NAME](action);

    expect(effect).toBeCalledTimes(1);
    expect(effect).lastCalledWith(undefined);
  });
});
