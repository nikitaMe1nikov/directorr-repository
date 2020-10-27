import { propNotExistInClass, propInClassNotLikeFormStore } from '../messages';
import { calcValues, isLikeFormStore } from '../calcValues';
import { someValue, someProperty } from '../__mocks__/mocks';

class FakeFormStore {
  value: any = someProperty;
  changeStatusToInvalid = jest.fn();
  changeStatusToValid = jest.fn();
}

describe('calcValues', () => {
  it('isLikeFormStore', () => {
    const likeFormStore = new FakeFormStore();
    const fakeStore = {};

    expect(isLikeFormStore(fakeStore)).toBeFalsy();
    expect(isLikeFormStore(likeFormStore)).toBeTruthy();
  });

  it('calcValues', () => {
    const MODULE_NAME = 'MODULE_NAME';
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

    expect(() => calcValues(MODULE_NAME, otherFields, someValue)).toThrowError(
      propNotExistInClass(MODULE_NAME, otherPropOne, store)
    );
    expect(() => calcValues(MODULE_NAME, fields, storeWithWrongFormStore)).toThrowError(
      propInClassNotLikeFormStore(MODULE_NAME, someProperty, storeWithWrongFormStore)
    );
    expect(calcValues(MODULE_NAME, fields, store)).toMatchObject({
      [someProperty]: someProperty,
      [otherPropOne]: undefined,
      [otherPropTwo]: undefined,
      [otherPropThree]: undefined,
    });
  });
});
