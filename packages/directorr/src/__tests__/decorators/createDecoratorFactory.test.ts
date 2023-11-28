import createDecoratorFactory from '../../decorators/createDecoratorFactory'
import {
  someValue,
  someFunc,
  someProperty,
  moduleName,
  someDescriptor,
} from '../../__mocks__/mocks'

describe('createrDecoratorFactory', () => {
  it('createDecoratorFactory', () => {
    const decorator = jest.fn().mockImplementation(() => someValue)
    const createContext = jest.fn().mockImplementation(() => someValue)
    const convertDecorator = jest.fn().mockImplementation(v => v)

    expect(() =>
      createDecoratorFactory(moduleName, decorator, someFunc)(someValue, someValue),
    ).not.toThrow()

    const builderDecorator = createDecoratorFactory(
      moduleName,
      decorator,
      someFunc,
      createContext,
      convertDecorator,
    )

    const createdDecorator = builderDecorator(someValue, someValue)

    const descriptor = createdDecorator(someValue, someProperty, someDescriptor)

    expect(createContext).toBeCalledTimes(1)
    expect(createContext).lastCalledWith(moduleName, someValue, someValue)

    expect(convertDecorator).toBeCalledTimes(1)
    expect(convertDecorator).lastCalledWith(createdDecorator, someValue)

    expect(decorator).toBeCalledTimes(1)
    expect(decorator).lastCalledWith(
      someValue,
      someProperty,
      someDescriptor,
      moduleName,
      someFunc,
      someValue,
    )

    expect(descriptor).toBe(someValue)
  })
})
