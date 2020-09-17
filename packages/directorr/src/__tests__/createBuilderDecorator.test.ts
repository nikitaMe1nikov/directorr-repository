import createBuilderDecorator from '../createBuilderDecorator';
import { someValue, someFunc, someProperty, moduleName, someDescriptor } from '../__mocks__/mocks';

describe('createBuilderDecorator', () => {
  it('createBuilderDecorator', () => {
    const decorator = jest.fn().mockImplementation(() => someValue);
    const createContext = jest.fn().mockImplementation(() => someValue);

    expect(() => createBuilderDecorator(moduleName, decorator, someFunc)).not.toThrow();

    const builderDecorator = createBuilderDecorator(moduleName, decorator, someFunc, createContext);

    const descriptor = builderDecorator(someValue, someValue)(
      someValue,
      someProperty,
      someDescriptor
    );

    expect(createContext).toHaveBeenCalledTimes(1);
    expect(createContext).toHaveBeenLastCalledWith(moduleName, someValue, someValue);

    expect(decorator).toHaveBeenCalledTimes(1);
    expect(decorator).toHaveBeenLastCalledWith(
      someValue,
      someProperty,
      someDescriptor,
      moduleName,
      someFunc,
      someValue
    );

    expect(descriptor).toEqual(someValue);
  });
});
