import decorator from '../decorator';
import {
  someValue,
  someFunc,
  someProperty,
  moduleName,
  someDescriptor,
  context,
  somePropertyDescriptor,
} from '../__mocks__/mocks';
import { useForNotPropDecorator } from '../messages';

describe('decorator', () => {
  it('call with not property descriptor', () => {
    const ctx = {};

    expect(() =>
      decorator(someValue, someProperty, undefined, moduleName, someFunc, ctx)
    ).not.toThrow();

    expect(() =>
      decorator(someValue, someProperty, somePropertyDescriptor, moduleName, someFunc, ctx)
    ).toThrowError(useForNotPropDecorator(moduleName, someProperty));
  });

  it('call with property descriptor', () => {
    const buildDescriptor = jest.fn();

    decorator(
      someValue,
      someProperty,
      someDescriptor,
      moduleName,
      someFunc,
      context,
      buildDescriptor
    );

    expect(buildDescriptor).toHaveBeenCalledTimes(1);
    expect(buildDescriptor).toHaveBeenLastCalledWith(
      someDescriptor,
      someProperty,
      someFunc,
      context
    );
  });
});
