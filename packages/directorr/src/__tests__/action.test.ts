import action, { initializer, runDispatcher, MODULE_NAME } from '../action';
import {
  DISPATCH_ACTION_FIELD_NAME,
  createValueDescriptor,
  defineProperty,
  createActionType,
  createAction,
  ACTION_TYPE_DIVIDER,
} from '../utils';
import { callDecoratorWithNotActionType } from '../messages';
import {
  someValue,
  someFunc,
  actionType,
  actionType2,
  someProperty,
  action as someAction,
} from './mocks';

describe('action', () => {
  it('runDispatcher', () => {
    const valueFuncWithEmptyReturn = jest.fn().mockImplementation(() => null);
    const valueFuncWithFullReturn = jest.fn().mockImplementation(() => someValue);
    const store = {
      [DISPATCH_ACTION_FIELD_NAME]: jest.fn(),
    };
    const args = [1];

    expect(runDispatcher(args, actionType, valueFuncWithEmptyReturn, store)).toEqual(null);

    expect(valueFuncWithEmptyReturn).toHaveBeenCalledTimes(1);
    expect(valueFuncWithEmptyReturn).toHaveBeenLastCalledWith(...args);
    expect(store[DISPATCH_ACTION_FIELD_NAME]).toHaveBeenCalledTimes(0);

    expect(runDispatcher(args, actionType, valueFuncWithFullReturn, store)).toEqual(someValue);

    expect(valueFuncWithFullReturn).toHaveBeenCalledTimes(1);
    expect(valueFuncWithFullReturn).toHaveBeenLastCalledWith(...args);
    expect(store[DISPATCH_ACTION_FIELD_NAME]).toHaveBeenCalledTimes(1);
    expect(store[DISPATCH_ACTION_FIELD_NAME]).toHaveBeenLastCalledWith(someAction);
  });

  it('initializer', () => {
    const dispatcher = jest.fn();
    const addFieds = jest.fn();
    const store = {};
    const args = [1];

    expect(() =>
      initializer(store, someValue, someProperty, actionType, dispatcher, addFieds)(...args)
    ).toThrow();

    initializer(store, someFunc, someProperty, actionType, dispatcher, addFieds)(...args);

    expect(addFieds).toHaveBeenCalledTimes(1);
    expect(addFieds).toHaveBeenLastCalledWith(store);
    expect(dispatcher).toHaveBeenCalledTimes(1);
    expect(dispatcher).toHaveBeenLastCalledWith(args, actionType, someFunc, store);
  });

  it('call action with wrong arg', () => {
    const wrongActionType: any = 4;

    expect(() => action(wrongActionType)).toThrowError(
      callDecoratorWithNotActionType(MODULE_NAME, wrongActionType)
    );
  });

  it('call action with correct arg', () => {
    expect(() => action(actionType)).not.toThrow();
  });

  it('use action in class', () => {
    const callAction = jest.fn().mockImplementation(v => v);
    const dispatchEffects = jest.fn();
    class SomeClassThree {}

    class SomeClass {
      @action(actionType)
      actionOne = callAction;

      @action(actionType)
      @action(actionType2)
      actionTwo = callAction;

      @action([actionType, SomeClassThree])
      actionThree = callAction;
    }

    const obj = new SomeClass();

    defineProperty(obj, DISPATCH_ACTION_FIELD_NAME, createValueDescriptor(dispatchEffects));

    obj.actionOne(someValue);

    expect(dispatchEffects).toHaveBeenCalledTimes(1);
    expect(dispatchEffects).toHaveBeenLastCalledWith(
      createAction(createActionType(actionType, ACTION_TYPE_DIVIDER), someValue)
    );

    dispatchEffects.mockReset();

    obj.actionTwo(someValue);

    expect(dispatchEffects).toHaveBeenCalledTimes(2);
    expect(dispatchEffects).toHaveBeenNthCalledWith(
      1,
      createAction(createActionType(actionType2, ACTION_TYPE_DIVIDER), someValue)
    );
    expect(dispatchEffects).toHaveBeenLastCalledWith(
      createAction(createActionType(actionType, ACTION_TYPE_DIVIDER), someValue)
    );

    dispatchEffects.mockReset();

    obj.actionThree(someValue);

    expect(dispatchEffects).toHaveBeenCalledTimes(1);
    expect(dispatchEffects).toHaveBeenLastCalledWith(
      createAction(
        createActionType([actionType, SomeClassThree.name], ACTION_TYPE_DIVIDER),
        someValue
      )
    );
  });
});
