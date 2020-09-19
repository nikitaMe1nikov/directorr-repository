import whenState, { initializer, stateChecker, MODULE_NAME } from '../whenState';
import { callWithPropNotEquallFunc, callDecoratorWithNotActionChecker } from '../messages';
import { someValue, someFunc, someProperty } from '../__mocks__/mocks';

describe('whenState', () => {
  it('call stateChecker with checker function', () => {
    const checkerTrue = jest.fn().mockImplementation(() => true);
    const checkerFalse = jest.fn().mockImplementation(() => false);
    const payload = {
      anotherProp: someValue,
    };
    const store = {};
    const valueFunc = jest.fn().mockImplementation(v => v);

    expect(stateChecker(payload, valueFunc, store, [checkerFalse])).toBeUndefined();
    expect(valueFunc).toBeCalledTimes(0);
    expect(checkerFalse).toBeCalledTimes(1);
    expect(checkerFalse).lastCalledWith(store, payload);

    expect(stateChecker(payload, valueFunc, store, [checkerTrue])).toEqual(payload);
    expect(valueFunc).toBeCalledTimes(1);
    expect(valueFunc).lastCalledWith(payload);
    expect(checkerTrue).toBeCalledTimes(1);
    expect(checkerTrue).lastCalledWith(store, payload);
  });

  it('call stateChecker with checker pattern', () => {
    const checkerTrue = jest.fn().mockImplementation(() => true);
    const checkerFalse = jest.fn().mockImplementation(() => false);
    const checkerEmptyObj = {};
    const checkerObjLikePayload = {
      [someProperty]: someValue,
    };
    const checkerObjLikeWithCheckerTrue = {
      [someProperty]: checkerTrue,
    };
    const checkerObjLikeWithCheckerFalse = {
      [someProperty]: checkerFalse,
    };
    const payload = {
      anotherProp: someValue,
    };
    const store = {};
    const valueFunc = jest.fn().mockImplementation(v => v);

    expect(stateChecker(payload, valueFunc, store, [checkerObjLikePayload])).toBeUndefined();
    expect(valueFunc).toBeCalledTimes(0);

    expect(stateChecker(payload, valueFunc, store, [checkerEmptyObj])).toEqual(payload);
    expect(valueFunc).toBeCalledTimes(1);
    expect(valueFunc).lastCalledWith(payload);

    expect(
      stateChecker(payload, valueFunc, checkerObjLikePayload, [checkerObjLikePayload])
    ).toEqual(payload);
    expect(valueFunc).toBeCalledTimes(2);
    expect(valueFunc).lastCalledWith(payload);

    expect(
      stateChecker(payload, valueFunc, checkerObjLikeWithCheckerFalse, [
        checkerObjLikeWithCheckerFalse,
      ])
    ).toBeUndefined();
    expect(checkerFalse).toBeCalledTimes(1);
    expect(checkerFalse).lastCalledWith(checkerObjLikeWithCheckerFalse, payload, someProperty);
    expect(valueFunc).toBeCalledTimes(2);

    expect(
      stateChecker(payload, valueFunc, checkerObjLikeWithCheckerTrue, [
        checkerObjLikeWithCheckerTrue,
      ])
    ).toEqual(payload);
    expect(checkerTrue).toBeCalledTimes(1);
    expect(checkerTrue).lastCalledWith(checkerObjLikeWithCheckerTrue, payload, someProperty);
    expect(valueFunc).toBeCalledTimes(3);
    expect(valueFunc).lastCalledWith(payload);
  });

  it('initializer', () => {
    const stateChecker = jest.fn();
    const store = {};
    const payload = {};

    expect(() => initializer(store, someValue, someProperty, someFunc, someFunc)).toThrowError(
      callWithPropNotEquallFunc(MODULE_NAME, someProperty)
    );

    initializer(store, someFunc, someProperty, someFunc, stateChecker)(payload);

    expect(stateChecker).toBeCalledTimes(1);
    expect(stateChecker).lastCalledWith(payload, someFunc, store, someFunc);
  });

  it('call whenState with correct arg', () => {
    expect(() => whenState({})).not.toThrow();
    expect(() => whenState(someFunc)).not.toThrow();
    expect(() => whenState({ someProp: () => {} })).not.toThrow();
  });

  it('call whenState with wrong arg', () => {
    const wrongActionType: any = 4;

    expect(() => whenState(wrongActionType)).toThrowError(
      callDecoratorWithNotActionChecker(MODULE_NAME, wrongActionType)
    );
  });

  it('use whenState in class', () => {
    const callEffect = jest.fn();
    const checkerFalse = jest.fn().mockImplementation(() => false);
    const checkerTrue = jest.fn().mockImplementation(() => true);
    const storeProp = 'storeProp';
    const checkerPatternFalse = {
      [storeProp]: 0,
    };
    const checkerPatternTrue = {
      [storeProp]: 1,
    };
    const payload = {
      [someProperty]: someValue,
    };
    const checkerObjLikeWithCheckerTrue = {
      [storeProp]: checkerTrue,
    };
    const checkerObjLikeWithCheckerFalse = {
      [storeProp]: checkerFalse,
    };

    class SomeClass {
      @whenState(checkerFalse)
      effectFalse = callEffect;

      @whenState(checkerTrue)
      effectTrue = callEffect;

      @whenState(checkerPatternFalse)
      effectPatternFalse = callEffect;

      @whenState(checkerPatternTrue)
      effectPatternTrue = callEffect;

      @whenState(checkerObjLikeWithCheckerFalse)
      effectPatternPropFalse = callEffect;

      @whenState(checkerObjLikeWithCheckerTrue)
      effectPatternPropTrue = callEffect;

      [storeProp] = 1;
    }

    const obj = new SomeClass();

    obj.effectFalse(payload);

    expect(checkerFalse).toBeCalledTimes(1);
    expect(checkerFalse).lastCalledWith(obj, payload);
    expect(callEffect).toBeCalledTimes(0);

    obj.effectTrue(payload);

    expect(checkerTrue).toBeCalledTimes(1);
    expect(checkerTrue).lastCalledWith(obj, payload);
    expect(callEffect).toBeCalledTimes(1);
    expect(callEffect).lastCalledWith(payload);

    obj.effectPatternFalse(payload);

    expect(callEffect).toBeCalledTimes(1);

    obj.effectPatternTrue(payload);

    expect(callEffect).toBeCalledTimes(2);
    expect(callEffect).lastCalledWith(payload);

    obj.effectPatternPropFalse(payload);

    expect(checkerFalse).toBeCalledTimes(2);
    expect(checkerFalse).lastCalledWith(obj, payload, storeProp);
    expect(callEffect).toBeCalledTimes(2);
    expect(callEffect).lastCalledWith(payload);

    obj.effectPatternPropTrue(payload);

    expect(checkerTrue).toBeCalledTimes(2);
    expect(checkerTrue).lastCalledWith(obj, payload, storeProp);
    expect(callEffect).toBeCalledTimes(3);
    expect(callEffect).lastCalledWith(payload);
  });

  it('use whenState in class with other decorators', () => {
    const callEffect = jest.fn();
    const storeProp = 'storeProp';
    const checkerFalse = {
      [storeProp]: 0,
    };
    const checkerTrue = {
      [storeProp]: 1,
    };
    const payload = {};

    class SomeClassFalse {
      @whenState(checkerTrue)
      @whenState(checkerFalse)
      effect = callEffect;

      [storeProp] = 1;
    }

    class SomeClassTrue {
      @whenState(checkerTrue)
      @whenState(checkerTrue)
      effect = callEffect;

      [storeProp] = 1;
    }

    const objFalse = new SomeClassFalse();

    objFalse.effect(payload);

    expect(callEffect).toBeCalledTimes(0);

    const objTrue = new SomeClassTrue();

    objTrue.effect(payload);

    expect(callEffect).toBeCalledTimes(1);
    expect(callEffect).lastCalledWith(payload);
  });
});
