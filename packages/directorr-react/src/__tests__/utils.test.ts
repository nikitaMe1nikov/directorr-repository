import { isFunction, isContext, isDirrectorInstance } from '../utils';
import { someValue, someFunc } from '../__mocks__/mocks';
import { DirectorrMock } from '@nimel/directorr';

describe('utils', () => {
  it('isFunction', () => {
    expect(isFunction(4)).toBeFalsy();
    expect(isFunction(someValue)).toBeFalsy();
    expect(isFunction(someFunc)).toBeTruthy();
  });

  it('isContext', () => {
    expect(isContext(4)).toBeFalsy();
    expect(
      isContext({
        Provider: someValue,
        Consumer: someValue,
      })
    ).toBeTruthy();
  });

  it('isDirrectorInstance', () => {
    expect(isDirrectorInstance(4)).toBeFalsy();
    expect(isDirrectorInstance(new DirectorrMock())).toBeTruthy();
  });
});
