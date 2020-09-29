import effect, { initializer, MODULE_NAME } from '../effect';
import {
  EFFECTS_FIELD_NAME,
  DISPATCH_ACTION_FIELD_NAME,
  createAction,
  createActionType,
  ACTION_TYPE_DIVIDER,
} from '../utils';
import {
  someValue,
  someValue2,
  someFunc,
  actionType,
  actionType2,
  someProperty,
} from '../__mocks__/mocks';
import { callDecoratorWithNotActionType, callWithPropNotEquallFunc } from '../messages';

describe('effect', () => {
  it('initializer', () => {
    const store: any = {
      [EFFECTS_FIELD_NAME]: new Map(),
    };
    const addFields = jest.fn();
    const secondProp = 'secondProp';

    expect(() => initializer(store, someValue, someProperty, actionType)).toThrowError(
      callWithPropNotEquallFunc(MODULE_NAME, someProperty)
    );

    expect(initializer(store, someFunc, someProperty, actionType, addFields)).toBe(someFunc);

    expect(addFields).toBeCalledTimes(1);
    expect(addFields).lastCalledWith(store);

    expect(store[EFFECTS_FIELD_NAME].get(actionType)).toStrictEqual([someProperty]);

    expect(initializer(store, someFunc, secondProp, actionType, addFields)).toBe(someFunc);

    expect(store[EFFECTS_FIELD_NAME].get(actionType)).toStrictEqual([someProperty, secondProp]);
  });

  it('call effect with wrong arg', () => {
    const wrongActionType: any = 4;

    expect(() => effect(wrongActionType)).toThrowError(
      callDecoratorWithNotActionType(MODULE_NAME, wrongActionType)
    );
  });

  it('call effect with correct arg', () => {
    expect(() => effect(actionType)).not.toThrow();
  });

  it('use effect in class', () => {
    const callEffectOne = jest.fn();
    const callEffectTwo = jest.fn();

    class SomeClass {
      @effect(actionType)
      @effect(actionType2)
      effectOne = callEffectOne;

      @effect(actionType2)
      effectTwo = callEffectTwo;
    }

    const obj = new SomeClass();

    (obj as any)[DISPATCH_ACTION_FIELD_NAME](
      createAction(createActionType(actionType, ACTION_TYPE_DIVIDER), someValue)
    );

    expect(callEffectOne).toBeCalledTimes(1);
    expect(callEffectOne).lastCalledWith(someValue);

    (obj as any)[DISPATCH_ACTION_FIELD_NAME](
      createAction(createActionType(actionType2, ACTION_TYPE_DIVIDER), someValue2)
    );

    expect(callEffectOne).toBeCalledTimes(2);
    expect(callEffectOne).lastCalledWith(someValue2);
    expect(callEffectTwo).toBeCalledTimes(1);
    expect(callEffectTwo).lastCalledWith(someValue2);
  });
});
