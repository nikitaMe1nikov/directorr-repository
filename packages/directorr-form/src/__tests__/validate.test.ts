import { object, string } from 'yup';
import { callWithPropNotEquallFunc } from '@nimel/directorr';
import validate, {
  isLikeFormStore,
  calcValues,
  MODULE_NAME,
  validateSchema,
  initializer,
} from '../validate';
import {
  propNotExistInClass,
  propInClassNotLikeFormStore,
  useWithEffects,
  callWithWrongSchema,
} from '../messages';
import { DEFAULT_VALIDATE_OPTIONS } from '../createSchemaContext';
import { someValue, someProperty, someFunc, action } from '../__mocks__/mocks';

class FakeFormStore {
  value: any = someProperty;
  changeStatusToInvalid = jest.fn();
  changeStatusToValid = jest.fn();
}

describe('validate', () => {
  it('isLikeFormStore', () => {
    const likeFormStore = new FakeFormStore();
    const fakeStore = {};

    expect(isLikeFormStore(fakeStore)).toBeFalsy();
    expect(isLikeFormStore(likeFormStore)).toBeTruthy();
  });

  it('calcValues', () => {
    const formStoreOne = new FakeFormStore();
    const formStoreTwo = {
      ...formStoreOne,
      value: '',
    };
    const formStoreThree = {
      ...formStoreOne,
      value: undefined,
    };
    const formStoreFour = {
      ...formStoreOne,
      value: null,
    };
    const otherPropOne = 'otherPropOne';
    const otherPropTwo = 'otherPropTwo';
    const otherPropThree = 'otherPropThree';
    const otherFields = [otherPropOne];
    const store = {
      [someProperty]: formStoreOne,
      [otherPropOne]: formStoreTwo,
      [otherPropTwo]: formStoreThree,
      [otherPropThree]: formStoreFour,
    };
    const fields = [someProperty, otherPropOne, otherPropTwo, otherPropThree];
    const storeWithWrongFormStore = {
      [someProperty]: {},
    };

    expect(() => calcValues(otherFields, someValue)).toThrowError(
      propNotExistInClass(MODULE_NAME, otherPropOne, store)
    );
    expect(() => calcValues(fields, storeWithWrongFormStore)).toThrowError(
      propInClassNotLikeFormStore(MODULE_NAME, someProperty, storeWithWrongFormStore)
    );
    expect(calcValues(fields, store)).toMatchObject({
      [someProperty]: someProperty,
      [otherPropOne]: undefined,
      [otherPropTwo]: undefined,
      [otherPropThree]: undefined,
    });
  });

  it('validateSchema', () => {
    const formStore = new FakeFormStore();
    const valueFunc = jest.fn().mockImplementation(v => v);
    const store = {
      [someProperty]: formStore,
    };
    const fields = [someProperty];
    const schema: any = {
      validateSyncAt: jest.fn(),
    };
    const errorMessage = 'errorMessage';
    const error = new Error(errorMessage);
    const schemaThrowError: any = {
      validateSyncAt: jest.fn().mockImplementation(() => {
        throw error;
      }),
    };
    const formStorePayload = {
      [DEFAULT_VALIDATE_OPTIONS.payloadProp]: someProperty,
    };

    expect(() =>
      validateSchema(action, valueFunc, store, [schema, DEFAULT_VALIDATE_OPTIONS, fields])
    ).toThrowError(useWithEffects(MODULE_NAME));

    expect(
      validateSchema(someValue, valueFunc, store, [schema, DEFAULT_VALIDATE_OPTIONS, fields])
    ).toBeUndefined();

    expect(valueFunc).not.toBeCalled();

    expect(
      validateSchema(undefined, valueFunc, store, [schema, DEFAULT_VALIDATE_OPTIONS, fields])
    ).toBeUndefined();

    expect(valueFunc).not.toBeCalled();

    expect(
      validateSchema(formStorePayload, valueFunc, store, [schema, DEFAULT_VALIDATE_OPTIONS, fields])
    ).toEqual(formStorePayload);
    expect(formStore.changeStatusToValid).toBeCalledTimes(1);
    expect(formStore.changeStatusToInvalid).toBeCalledTimes(0);
    expect(schema.validateSyncAt).toBeCalledTimes(1);
    expect(schema.validateSyncAt).lastCalledWith(
      someProperty,
      { [someProperty]: someProperty },
      DEFAULT_VALIDATE_OPTIONS
    );
    expect(valueFunc).toBeCalledTimes(1);
    expect(valueFunc).lastCalledWith(formStorePayload);

    const payload = validateSchema(formStorePayload, valueFunc, store, [
      schemaThrowError,
      DEFAULT_VALIDATE_OPTIONS,
      fields,
    ]);
    expect(payload).toMatchObject(formStorePayload);
    expect(payload.validationError).toEqual(error);
    expect(formStore.changeStatusToValid).toBeCalledTimes(1);
    expect(formStore.changeStatusToInvalid).toBeCalledTimes(1);
    expect(formStore.changeStatusToInvalid).lastCalledWith(errorMessage);
    expect(schemaThrowError.validateSyncAt).toBeCalledTimes(1);
    expect(schemaThrowError.validateSyncAt).lastCalledWith(
      someProperty,
      { [someProperty]: someProperty },
      DEFAULT_VALIDATE_OPTIONS
    );
    expect(valueFunc).toBeCalledTimes(2);
    expect(valueFunc).lastCalledWith(payload);
  });

  it('initializer', () => {
    const validateSchema = jest.fn();
    const store = {};
    const payload = {};
    const ctx = someValue;

    expect(() => initializer(store, someValue, someProperty, ctx)(payload)).toThrowError(
      callWithPropNotEquallFunc(MODULE_NAME, someProperty)
    );

    initializer(store, someFunc, someProperty, ctx, validateSchema)(payload);

    expect(validateSchema).toBeCalledTimes(1);
    expect(validateSchema).lastCalledWith(payload, someFunc, store, ctx);
  });

  it('call validate with wrong schema', () => {
    const wrongSchema: any = 4;

    expect(() => validate(wrongSchema)).toThrowError(callWithWrongSchema(MODULE_NAME, wrongSchema));
  });

  it('use validate in class', () => {
    const store = new FakeFormStore();
    const effect = jest.fn();
    const schema = object({
      [someProperty]: string().required(),
    });
    const someOtherPayload = someValue;
    const formStorePayload = {
      [DEFAULT_VALIDATE_OPTIONS.payloadProp]: someProperty,
    };

    class SomeClass {
      [someProperty] = store;

      @validate(schema)
      effect = effect;
    }

    const obj = new SomeClass();

    obj.effect(someOtherPayload);

    expect(store.changeStatusToValid).toBeCalledTimes(0);
    expect(store.changeStatusToInvalid).toBeCalledTimes(0);
    expect(effect).toBeCalledTimes(0);

    obj.effect(formStorePayload);

    expect(store.changeStatusToValid).toBeCalledTimes(1);
    expect(store.changeStatusToInvalid).toBeCalledTimes(0);
    expect(effect).toBeCalledTimes(1);

    store.value = 12;
    obj.effect(formStorePayload);

    expect(store.changeStatusToValid).toBeCalledTimes(1);
    expect(store.changeStatusToInvalid).toBeCalledTimes(1);
    expect(effect).toBeCalledTimes(2);
  });
});
