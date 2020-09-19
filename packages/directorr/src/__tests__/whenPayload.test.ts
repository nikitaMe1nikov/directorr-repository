import whenPayload, { initializer, payloadChecker, MODULE_NAME } from '../whenPayload';
import {
  callWithPropNotEquallFunc,
  callDecoratorWithNotActionChecker,
  callDecoratorWithNotConvertPayload,
} from '../messages';
import { someValue, someValue2, someFunc, someProperty } from '../__mocks__/mocks';
import { EMPTY_FUNC } from '../utils';

describe('whenPayload', () => {
  it('call payloadChecker with payload = undefined', () => {
    const checkerFalse = jest.fn().mockImplementation(() => false);
    const converter = jest.fn().mockImplementation(v => v);

    const payload = undefined;
    const valueFunc = jest.fn().mockImplementation(v => v);
    const convertedObj = {};
    const converterToNewObj = jest.fn().mockImplementation(() => convertedObj);

    expect(payloadChecker(payload, valueFunc, [checkerFalse])).toEqual(payload);
    expect(checkerFalse).toBeCalledTimes(0);
    expect(valueFunc).toBeCalledTimes(1);

    expect(payloadChecker(payload, valueFunc, [checkerFalse, converter])).toEqual(payload);
    expect(checkerFalse).toBeCalledTimes(0);
    expect(converter).toBeCalledTimes(1);
    expect(converter).lastCalledWith(payload);
    expect(valueFunc).toBeCalledTimes(2);

    expect(payloadChecker(payload, valueFunc, [checkerFalse, converterToNewObj])).toEqual(
      convertedObj
    );
    expect(checkerFalse).toBeCalledTimes(0);
    expect(converterToNewObj).toBeCalledTimes(1);
    expect(converterToNewObj).lastCalledWith(payload);
    expect(valueFunc).toBeCalledTimes(3);
  });

  it('call payloadChecker with checker and converter', () => {
    const checkerTrue = jest.fn().mockImplementation(() => true);
    const checkerFalse = jest.fn().mockImplementation(() => false);
    const payload = {
      anotherProp: someValue,
    };
    const valueFunc = jest.fn().mockImplementation(v => v);
    const convertedObj = {};
    const converterToNewObj = jest.fn().mockImplementation(() => convertedObj);

    expect(payloadChecker(payload, valueFunc, [checkerTrue])).toEqual(payload);
    expect(valueFunc).toBeCalledTimes(1);
    expect(valueFunc).lastCalledWith(payload);
    expect(checkerTrue).toBeCalledTimes(1);
    expect(checkerTrue).lastCalledWith(payload);

    expect(payloadChecker(payload, valueFunc, [checkerFalse])).toBeUndefined();
    expect(valueFunc).toBeCalledTimes(1);
    expect(checkerFalse).toBeCalledTimes(1);
    expect(checkerFalse).lastCalledWith(payload);

    expect(payloadChecker(payload, valueFunc, [checkerTrue, converterToNewObj])).toEqual(
      convertedObj
    );
    expect(valueFunc).toBeCalledTimes(2);
    expect(valueFunc).lastCalledWith(convertedObj);
    expect(converterToNewObj).toBeCalledTimes(1);
    expect(converterToNewObj).lastCalledWith(payload);
  });

  it('call payloadChecker with checker pattern', () => {
    const checkerEmptyObj = {};
    const checkerObjLike = {
      [someProperty]: someValue,
    };
    const payload = {
      anotherProp: someValue2,
    };
    const valueFunc = jest.fn().mockImplementation(v => v);
    const convertedObj = {};
    const converterToNewObj = jest.fn().mockImplementation(() => convertedObj);

    expect(payloadChecker(payload, valueFunc, [checkerEmptyObj])).toEqual(payload);
    expect(valueFunc).toBeCalledTimes(1);
    expect(valueFunc).lastCalledWith(payload);

    expect(payloadChecker(payload, valueFunc, [checkerEmptyObj, converterToNewObj])).toEqual(
      convertedObj
    );
    expect(converterToNewObj).toBeCalledTimes(1);
    expect(converterToNewObj).lastCalledWith(payload);
    expect(valueFunc).toBeCalledTimes(2);
    expect(valueFunc).lastCalledWith(convertedObj);

    expect(payloadChecker(payload, valueFunc, [checkerObjLike])).toBeUndefined();
    expect(valueFunc).toBeCalledTimes(2);

    expect(payloadChecker(checkerObjLike, valueFunc, [checkerObjLike])).toEqual(checkerObjLike);
    expect(valueFunc).toBeCalledTimes(3);
    expect(valueFunc).lastCalledWith(checkerObjLike);
  });

  it('call payloadChecker with checker pattern and prop checker function', () => {
    const checkerTrue = jest.fn().mockImplementation(() => true);
    const checkerFalse = jest.fn().mockImplementation(() => false);
    const converter = jest.fn().mockImplementation(v => v);
    const checkerObjLike = {
      [someProperty]: someValue,
    };
    const checkerObjLikeWithCheckerTrue = {
      [someProperty]: checkerTrue,
    };
    const checkerObjLikeWithCheckerFalse = {
      [someProperty]: checkerFalse,
    };
    const payload = {
      anotherProp: someValue2,
    };
    const valueFunc = jest.fn().mockImplementation(v => v);
    const convertedObj = {};
    const converterToNewObj = jest.fn().mockImplementation(() => convertedObj);

    expect(
      payloadChecker(payload, valueFunc, [checkerObjLikeWithCheckerFalse, converter])
    ).toBeUndefined();
    expect(checkerFalse).toBeCalledTimes(0);
    expect(converter).toBeCalledTimes(0);
    expect(valueFunc).toBeCalledTimes(0);

    expect(
      payloadChecker(checkerObjLike, valueFunc, [checkerObjLikeWithCheckerFalse, converter])
    ).toBeUndefined();
    expect(checkerFalse).toBeCalledTimes(1);
    expect(checkerFalse).lastCalledWith(checkerObjLike, someProperty);
    expect(converter).toBeCalledTimes(0);
    expect(valueFunc).toBeCalledTimes(0);

    expect(
      payloadChecker(payload, valueFunc, [checkerObjLikeWithCheckerTrue, converter])
    ).toBeUndefined();
    expect(checkerTrue).toBeCalledTimes(0);
    expect(converter).toBeCalledTimes(0);
    expect(valueFunc).toBeCalledTimes(0);

    expect(
      payloadChecker(checkerObjLike, valueFunc, [checkerObjLikeWithCheckerTrue, converter])
    ).toEqual(checkerObjLike);
    expect(checkerTrue).toBeCalledTimes(1);
    expect(checkerTrue).lastCalledWith(checkerObjLike, someProperty);
    expect(converter).toBeCalledTimes(1);
    expect(converter).lastCalledWith(checkerObjLike);
    expect(valueFunc).toBeCalledTimes(1);
    expect(valueFunc).lastCalledWith(checkerObjLike);

    expect(
      payloadChecker(checkerObjLike, valueFunc, [checkerObjLikeWithCheckerTrue, converterToNewObj])
    ).toEqual(convertedObj);
    expect(checkerTrue).toBeCalledTimes(2);
    expect(checkerTrue).lastCalledWith(checkerObjLike, someProperty);
    expect(converterToNewObj).toBeCalledTimes(1);
    expect(converterToNewObj).lastCalledWith(checkerObjLike);
    expect(valueFunc).toBeCalledTimes(2);
    expect(valueFunc).lastCalledWith(convertedObj);
  });

  it('initializer', () => {
    const payloadChecker = jest.fn();
    const store = {};
    const payload = {};

    expect(() => initializer(store, someValue, someProperty, someFunc, someFunc)).toThrowError(
      callWithPropNotEquallFunc(MODULE_NAME, someProperty)
    );

    initializer(store, someFunc, someProperty, someFunc, payloadChecker)(payload);

    expect(payloadChecker).toBeCalledTimes(1);
    expect(payloadChecker).lastCalledWith(payload, someFunc, someFunc);
  });

  it('call whenPayload with correct arg', () => {
    expect(() => whenPayload({})).not.toThrow();
    expect(() => whenPayload(EMPTY_FUNC)).not.toThrow();
    expect(() => whenPayload(EMPTY_FUNC, EMPTY_FUNC)).not.toThrow();
    expect(() => whenPayload({}, EMPTY_FUNC)).not.toThrow();
  });

  it('call whenPayload with wrong arg', () => {
    const wrongActionType: any = 4;

    expect(() => whenPayload(wrongActionType)).toThrowError(
      callDecoratorWithNotActionChecker(MODULE_NAME, wrongActionType)
    );

    expect(() => whenPayload({}, wrongActionType)).toThrowError(
      callDecoratorWithNotConvertPayload(MODULE_NAME, wrongActionType)
    );
  });

  it('use whenPayload in class', () => {
    const callEffect = jest.fn();
    const converter = jest.fn().mockImplementation(v => v);
    const checkerFalse = jest.fn().mockImplementation(() => false);
    const checkerTrue = jest.fn().mockImplementation(() => true);
    const payload = {
      [someProperty]: someValue,
    };
    const checkerPatternFalse = {
      anotherProp: someValue,
    };
    const checkerPatternTrue = {
      [someProperty]: someValue,
    };
    const checkerPatternPropFalse = {
      [someProperty]: checkerFalse,
    };
    const checkerPatternPropTrue = {
      [someProperty]: checkerTrue,
    };

    class SomeClass {
      @whenPayload(checkerFalse, converter)
      effectFalse = callEffect;

      @whenPayload(checkerTrue)
      effectTrueNoConverter = callEffect;

      @whenPayload(checkerTrue, converter)
      effectTrue = callEffect;

      @whenPayload(checkerPatternFalse, converter)
      effectPatternFalse = callEffect;

      @whenPayload(checkerPatternTrue, converter)
      effectPatternTrue = callEffect;

      @whenPayload(checkerPatternPropFalse, converter)
      effectPatternPropFalse = callEffect;

      @whenPayload(checkerPatternPropTrue, converter)
      effectPatternPropTrue = callEffect;
    }

    const obj = new SomeClass();

    obj.effectFalse(payload);

    expect(checkerFalse).toBeCalledTimes(1);
    expect(checkerFalse).lastCalledWith(payload);
    expect(converter).toBeCalledTimes(0);
    expect(callEffect).toBeCalledTimes(0);

    obj.effectTrueNoConverter(payload);

    expect(checkerTrue).toBeCalledTimes(1);
    expect(checkerTrue).lastCalledWith(payload);
    expect(converter).toBeCalledTimes(0);
    expect(callEffect).toBeCalledTimes(1);

    obj.effectTrue(payload);

    expect(checkerTrue).toBeCalledTimes(2);
    expect(checkerTrue).lastCalledWith(payload);
    expect(converter).toBeCalledTimes(1);
    expect(converter).lastCalledWith(payload);
    expect(callEffect).toBeCalledTimes(2);
    expect(callEffect).lastCalledWith(payload);

    obj.effectPatternFalse(payload);

    expect(converter).toBeCalledTimes(1);
    expect(callEffect).toBeCalledTimes(2);

    obj.effectPatternTrue(payload);

    expect(converter).toBeCalledTimes(2);
    expect(converter).lastCalledWith(payload);
    expect(callEffect).toBeCalledTimes(3);
    expect(callEffect).lastCalledWith(payload);

    obj.effectPatternPropFalse(payload);

    expect(checkerFalse).toBeCalledTimes(2);
    expect(checkerFalse).lastCalledWith(payload, someProperty);
    expect(converter).toBeCalledTimes(2);
    expect(converter).lastCalledWith(payload);
    expect(callEffect).toBeCalledTimes(3);
    expect(callEffect).lastCalledWith(payload);

    obj.effectPatternPropTrue(payload);

    expect(checkerTrue).toBeCalledTimes(3);
    expect(checkerTrue).lastCalledWith(payload, someProperty);
    expect(converter).toBeCalledTimes(3);
    expect(converter).lastCalledWith(payload);
    expect(callEffect).toBeCalledTimes(4);
    expect(callEffect).lastCalledWith(payload);
  });

  it('use whenPayload in class with other decorators', () => {
    const callEffect = jest.fn();
    const payload = {
      [someProperty]: someValue,
    };
    const checkerTrue = jest.fn(() => true);
    const checkerFalse = jest.fn(() => false);

    class SomeClass {
      @whenPayload(checkerTrue)
      @whenPayload(checkerTrue)
      effectOne = callEffect;

      @whenPayload(checkerTrue)
      @whenPayload(checkerFalse)
      effectTwo = callEffect;
    }

    const obj = new SomeClass();

    obj.effectOne(payload);

    expect(checkerTrue).toBeCalledTimes(2);
    expect(callEffect).toBeCalledTimes(1);
    expect(callEffect).lastCalledWith(payload);

    obj.effectTwo(payload);

    expect(checkerTrue).toBeCalledTimes(3);
    expect(checkerFalse).toBeCalledTimes(1);
    expect(callEffect).toBeCalledTimes(1);
    expect(callEffect).lastCalledWith(payload);
  });
});
