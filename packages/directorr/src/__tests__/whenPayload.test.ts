import whenPayload, { initializer, payloadChecker, MODULE_NAME } from '../whenPayload';
import {
  callWithPropNotEquallFunc,
  callDecoratorWithNotActionChecker,
  callDecoratorWithNotConvertPayload,
} from '../messages';
import { someValue, someValue2, someFunc, someProperty } from './mocks';

const emptyFunc = () => {};

describe('whenPayload', () => {
  it('call payloadChecker with payload = undefined', () => {
    const checkerFalse = jest.fn().mockImplementation(() => false);
    const converter = jest.fn().mockImplementation(v => v);

    const payload = undefined;
    const valueFunc = jest.fn().mockImplementation(v => v);
    const convertedObj = {};
    const converterToNewObj = jest.fn().mockImplementation(() => convertedObj);

    expect(payloadChecker(payload, valueFunc, [checkerFalse])).toEqual(payload);
    expect(checkerFalse).toHaveBeenCalledTimes(0);
    expect(valueFunc).toHaveBeenCalledTimes(1);

    expect(payloadChecker(payload, valueFunc, [checkerFalse, converter])).toEqual(payload);
    expect(checkerFalse).toHaveBeenCalledTimes(0);
    expect(converter).toHaveBeenCalledTimes(1);
    expect(converter).toHaveBeenLastCalledWith(payload);
    expect(valueFunc).toHaveBeenCalledTimes(2);

    expect(payloadChecker(payload, valueFunc, [checkerFalse, converterToNewObj])).toEqual(
      convertedObj
    );
    expect(checkerFalse).toHaveBeenCalledTimes(0);
    expect(converterToNewObj).toHaveBeenCalledTimes(1);
    expect(converterToNewObj).toHaveBeenLastCalledWith(payload);
    expect(valueFunc).toHaveBeenCalledTimes(3);
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
    expect(valueFunc).toHaveBeenCalledTimes(1);
    expect(valueFunc).toHaveBeenLastCalledWith(payload);
    expect(checkerTrue).toHaveBeenCalledTimes(1);
    expect(checkerTrue).toHaveBeenLastCalledWith(payload);

    expect(payloadChecker(payload, valueFunc, [checkerFalse])).toBeUndefined();
    expect(valueFunc).toHaveBeenCalledTimes(1);
    expect(checkerFalse).toHaveBeenCalledTimes(1);
    expect(checkerFalse).toHaveBeenLastCalledWith(payload);

    expect(payloadChecker(payload, valueFunc, [checkerTrue, converterToNewObj])).toEqual(
      convertedObj
    );
    expect(valueFunc).toHaveBeenCalledTimes(2);
    expect(valueFunc).toHaveBeenLastCalledWith(convertedObj);
    expect(converterToNewObj).toHaveBeenCalledTimes(1);
    expect(converterToNewObj).toHaveBeenLastCalledWith(payload);
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
    expect(valueFunc).toHaveBeenCalledTimes(1);
    expect(valueFunc).toHaveBeenLastCalledWith(payload);

    expect(payloadChecker(payload, valueFunc, [checkerEmptyObj, converterToNewObj])).toEqual(
      convertedObj
    );
    expect(converterToNewObj).toHaveBeenCalledTimes(1);
    expect(converterToNewObj).toHaveBeenLastCalledWith(payload);
    expect(valueFunc).toHaveBeenCalledTimes(2);
    expect(valueFunc).toHaveBeenLastCalledWith(convertedObj);

    expect(payloadChecker(payload, valueFunc, [checkerObjLike])).toBeUndefined();
    expect(valueFunc).toHaveBeenCalledTimes(2);

    expect(payloadChecker(checkerObjLike, valueFunc, [checkerObjLike])).toEqual(checkerObjLike);
    expect(valueFunc).toHaveBeenCalledTimes(3);
    expect(valueFunc).toHaveBeenLastCalledWith(checkerObjLike);
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
    expect(checkerFalse).toHaveBeenCalledTimes(0);
    expect(converter).toHaveBeenCalledTimes(0);
    expect(valueFunc).toHaveBeenCalledTimes(0);

    expect(
      payloadChecker(checkerObjLike, valueFunc, [checkerObjLikeWithCheckerFalse, converter])
    ).toBeUndefined();
    expect(checkerFalse).toHaveBeenCalledTimes(1);
    expect(checkerFalse).toHaveBeenLastCalledWith(checkerObjLike, someProperty);
    expect(converter).toHaveBeenCalledTimes(0);
    expect(valueFunc).toHaveBeenCalledTimes(0);

    expect(
      payloadChecker(payload, valueFunc, [checkerObjLikeWithCheckerTrue, converter])
    ).toBeUndefined();
    expect(checkerTrue).toHaveBeenCalledTimes(0);
    expect(converter).toHaveBeenCalledTimes(0);
    expect(valueFunc).toHaveBeenCalledTimes(0);

    expect(
      payloadChecker(checkerObjLike, valueFunc, [checkerObjLikeWithCheckerTrue, converter])
    ).toEqual(checkerObjLike);
    expect(checkerTrue).toHaveBeenCalledTimes(1);
    expect(checkerTrue).toHaveBeenLastCalledWith(checkerObjLike, someProperty);
    expect(converter).toHaveBeenCalledTimes(1);
    expect(converter).toHaveBeenLastCalledWith(checkerObjLike);
    expect(valueFunc).toHaveBeenCalledTimes(1);
    expect(valueFunc).toHaveBeenLastCalledWith(checkerObjLike);

    expect(
      payloadChecker(checkerObjLike, valueFunc, [checkerObjLikeWithCheckerTrue, converterToNewObj])
    ).toEqual(convertedObj);
    expect(checkerTrue).toHaveBeenCalledTimes(2);
    expect(checkerTrue).toHaveBeenLastCalledWith(checkerObjLike, someProperty);
    expect(converterToNewObj).toHaveBeenCalledTimes(1);
    expect(converterToNewObj).toHaveBeenLastCalledWith(checkerObjLike);
    expect(valueFunc).toHaveBeenCalledTimes(2);
    expect(valueFunc).toHaveBeenLastCalledWith(convertedObj);
  });

  it('initializer', () => {
    const payloadChecker = jest.fn();
    const store = {};
    const payload = {};

    expect(() => initializer(store, someValue, someProperty, someFunc, someFunc)).toThrowError(
      callWithPropNotEquallFunc(MODULE_NAME, someProperty)
    );

    initializer(store, someFunc, someProperty, someFunc, payloadChecker)(payload);

    expect(payloadChecker).toHaveBeenCalledTimes(1);
    expect(payloadChecker).toHaveBeenLastCalledWith(payload, someFunc, someFunc);
  });

  it('call whenPayload with correct arg', () => {
    expect(() => whenPayload({})).not.toThrow();
    expect(() => whenPayload(emptyFunc)).not.toThrow();
    expect(() => whenPayload(emptyFunc, emptyFunc)).not.toThrow();
    expect(() => whenPayload({}, emptyFunc)).not.toThrow();
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

    expect(checkerFalse).toHaveBeenCalledTimes(1);
    expect(checkerFalse).toHaveBeenLastCalledWith(payload);
    expect(converter).toHaveBeenCalledTimes(0);
    expect(callEffect).toHaveBeenCalledTimes(0);

    obj.effectTrueNoConverter(payload);

    expect(checkerTrue).toHaveBeenCalledTimes(1);
    expect(checkerTrue).toHaveBeenLastCalledWith(payload);
    expect(converter).toHaveBeenCalledTimes(0);
    expect(callEffect).toHaveBeenCalledTimes(1);

    obj.effectTrue(payload);

    expect(checkerTrue).toHaveBeenCalledTimes(2);
    expect(checkerTrue).toHaveBeenLastCalledWith(payload);
    expect(converter).toHaveBeenCalledTimes(1);
    expect(converter).toHaveBeenLastCalledWith(payload);
    expect(callEffect).toHaveBeenCalledTimes(2);
    expect(callEffect).toHaveBeenLastCalledWith(payload);

    obj.effectPatternFalse(payload);

    expect(converter).toHaveBeenCalledTimes(1);
    expect(callEffect).toHaveBeenCalledTimes(2);

    obj.effectPatternTrue(payload);

    expect(converter).toHaveBeenCalledTimes(2);
    expect(converter).toHaveBeenLastCalledWith(payload);
    expect(callEffect).toHaveBeenCalledTimes(3);
    expect(callEffect).toHaveBeenLastCalledWith(payload);

    obj.effectPatternPropFalse(payload);

    expect(checkerFalse).toHaveBeenCalledTimes(2);
    expect(checkerFalse).toHaveBeenLastCalledWith(payload, someProperty);
    expect(converter).toHaveBeenCalledTimes(2);
    expect(converter).toHaveBeenLastCalledWith(payload);
    expect(callEffect).toHaveBeenCalledTimes(3);
    expect(callEffect).toHaveBeenLastCalledWith(payload);

    obj.effectPatternPropTrue(payload);

    expect(checkerTrue).toHaveBeenCalledTimes(3);
    expect(checkerTrue).toHaveBeenLastCalledWith(payload, someProperty);
    expect(converter).toHaveBeenCalledTimes(3);
    expect(converter).toHaveBeenLastCalledWith(payload);
    expect(callEffect).toHaveBeenCalledTimes(4);
    expect(callEffect).toHaveBeenLastCalledWith(payload);
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

    expect(checkerTrue).toHaveBeenCalledTimes(2);
    expect(callEffect).toHaveBeenCalledTimes(1);
    expect(callEffect).toHaveBeenLastCalledWith(payload);

    obj.effectTwo(payload);

    expect(checkerTrue).toHaveBeenCalledTimes(3);
    expect(checkerFalse).toHaveBeenCalledTimes(1);
    expect(callEffect).toHaveBeenCalledTimes(1);
    expect(callEffect).toHaveBeenLastCalledWith(payload);
  });
});