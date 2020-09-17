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
    expect(valueFunc).toHaveBeenCalledTimes(0);
    expect(checkerFalse).toHaveBeenCalledTimes(1);
    expect(checkerFalse).toHaveBeenLastCalledWith(store, payload);

    expect(stateChecker(payload, valueFunc, store, [checkerTrue])).toEqual(payload);
    expect(valueFunc).toHaveBeenCalledTimes(1);
    expect(valueFunc).toHaveBeenLastCalledWith(payload);
    expect(checkerTrue).toHaveBeenCalledTimes(1);
    expect(checkerTrue).toHaveBeenLastCalledWith(store, payload);
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
    expect(valueFunc).toHaveBeenCalledTimes(0);

    expect(stateChecker(payload, valueFunc, store, [checkerEmptyObj])).toEqual(payload);
    expect(valueFunc).toHaveBeenCalledTimes(1);
    expect(valueFunc).toHaveBeenLastCalledWith(payload);

    expect(
      stateChecker(payload, valueFunc, checkerObjLikePayload, [checkerObjLikePayload])
    ).toEqual(payload);
    expect(valueFunc).toHaveBeenCalledTimes(2);
    expect(valueFunc).toHaveBeenLastCalledWith(payload);

    expect(
      stateChecker(payload, valueFunc, checkerObjLikeWithCheckerFalse, [
        checkerObjLikeWithCheckerFalse,
      ])
    ).toBeUndefined();
    expect(checkerFalse).toHaveBeenCalledTimes(1);
    expect(checkerFalse).toHaveBeenLastCalledWith(
      checkerObjLikeWithCheckerFalse,
      payload,
      someProperty
    );
    expect(valueFunc).toHaveBeenCalledTimes(2);

    expect(
      stateChecker(payload, valueFunc, checkerObjLikeWithCheckerTrue, [
        checkerObjLikeWithCheckerTrue,
      ])
    ).toEqual(payload);
    expect(checkerTrue).toHaveBeenCalledTimes(1);
    expect(checkerTrue).toHaveBeenLastCalledWith(
      checkerObjLikeWithCheckerTrue,
      payload,
      someProperty
    );
    expect(valueFunc).toHaveBeenCalledTimes(3);
    expect(valueFunc).toHaveBeenLastCalledWith(payload);
  });

  it('initializer', () => {
    const stateChecker = jest.fn();
    const store = {};
    const payload = {};

    expect(() => initializer(store, someValue, someProperty, someFunc, someFunc)).toThrowError(
      callWithPropNotEquallFunc(MODULE_NAME, someProperty)
    );

    initializer(store, someFunc, someProperty, someFunc, stateChecker)(payload);

    expect(stateChecker).toHaveBeenCalledTimes(1);
    expect(stateChecker).toHaveBeenLastCalledWith(payload, someFunc, store, someFunc);
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

    expect(checkerFalse).toHaveBeenCalledTimes(1);
    expect(checkerFalse).toHaveBeenLastCalledWith(obj, payload);
    expect(callEffect).toHaveBeenCalledTimes(0);

    obj.effectTrue(payload);

    expect(checkerTrue).toHaveBeenCalledTimes(1);
    expect(checkerTrue).toHaveBeenLastCalledWith(obj, payload);
    expect(callEffect).toHaveBeenCalledTimes(1);
    expect(callEffect).toHaveBeenLastCalledWith(payload);

    obj.effectPatternFalse(payload);

    expect(callEffect).toHaveBeenCalledTimes(1);

    obj.effectPatternTrue(payload);

    expect(callEffect).toHaveBeenCalledTimes(2);
    expect(callEffect).toHaveBeenLastCalledWith(payload);

    obj.effectPatternPropFalse(payload);

    expect(checkerFalse).toHaveBeenCalledTimes(2);
    expect(checkerFalse).toHaveBeenLastCalledWith(obj, payload, storeProp);
    expect(callEffect).toHaveBeenCalledTimes(2);
    expect(callEffect).toHaveBeenLastCalledWith(payload);

    obj.effectPatternPropTrue(payload);

    expect(checkerTrue).toHaveBeenCalledTimes(2);
    expect(checkerTrue).toHaveBeenLastCalledWith(obj, payload, storeProp);
    expect(callEffect).toHaveBeenCalledTimes(3);
    expect(callEffect).toHaveBeenLastCalledWith(payload);
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

    expect(callEffect).toHaveBeenCalledTimes(0);

    const objTrue = new SomeClassTrue();

    objTrue.effect(payload);

    expect(callEffect).toHaveBeenCalledTimes(1);
    expect(callEffect).toHaveBeenLastCalledWith(payload);
  });
});
