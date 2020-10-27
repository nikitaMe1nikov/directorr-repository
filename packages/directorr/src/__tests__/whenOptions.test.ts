import whenOptions from '../whenOptions';
import action from '../action';
import { DIRECTORR_OPTIONS_STORE_ACTION } from '../utils';

describe('whenOptions', () => {
  it('use in class', () => {
    const callEffect = jest.fn();
    const initOptions = {};

    class SomeClass {
      @whenOptions
      effect = callEffect;

      @action(DIRECTORR_OPTIONS_STORE_ACTION)
      action = (payload: any) => payload;
    }

    const obj = new SomeClass();

    obj.action({
      StoreConstructor: SomeClass,
      initOptions,
    });

    expect(callEffect).toBeCalledTimes(1);
    expect(callEffect).lastCalledWith(initOptions);
  });
});
