import effect, { initializer, MODULE_NAME } from '../effect';
import {
  EFFECTS_FIELD_NAME,
  DISPATCH_ACTION_FIELD_NAME,
  createAction,
  createActionType,
  ACTION_TYPE_DIVIDER,
} from '../utils';
import { someValue, someValue2, someFunc, actionType, actionType2, someProperty } from './mocks';
import { callDecoratorWithNotActionType } from '../messages';

describe('effect', () => {
  it('initializer', () => {
    const store: any = {
      [EFFECTS_FIELD_NAME]: new Map(),
    };
    const addFields = jest.fn();
    const secondProp = 'secondProp';

    expect(initializer(store, someFunc, someProperty, actionType, addFields)).toEqual(someFunc);

    expect(addFields).toHaveBeenCalledTimes(1);
    expect(addFields).toHaveBeenLastCalledWith(store);

    expect(store[EFFECTS_FIELD_NAME].get(actionType)).toEqual([someProperty]);

    expect(initializer(store, someFunc, secondProp, actionType, addFields)).toEqual(someFunc);

    expect(store[EFFECTS_FIELD_NAME].get(actionType)).toEqual([someProperty, secondProp]);
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

    expect(callEffectOne).toHaveBeenCalledTimes(1);
    expect(callEffectOne).toHaveBeenLastCalledWith(someValue);

    (obj as any)[DISPATCH_ACTION_FIELD_NAME](
      createAction(createActionType(actionType2, ACTION_TYPE_DIVIDER), someValue2)
    );

    expect(callEffectOne).toHaveBeenCalledTimes(2);
    expect(callEffectOne).toHaveBeenLastCalledWith(someValue2);
    expect(callEffectTwo).toHaveBeenCalledTimes(1);
    expect(callEffectTwo).toHaveBeenLastCalledWith(someValue2);
  });
});
