import createPropertyDecoratorFactory from '../createPropertyDecoratorFactory'
import decorator from '../decorators/decorator'
import { moduleName } from '../__mocks__/mocks'

jest.mock('../decorators/createDecoratorFactory', () => {
  const createDecoratorFactory = jest.fn().mockImplementation(() => createDecoratorFactory)

  return createDecoratorFactory
})

describe('createPropertyDecoratorFactory', () => {
  it('createPropertyDecoratorFactory', () => {
    const initializer = jest.fn()
    const createContext = jest.fn()

    const createDecoratorFactory = createPropertyDecoratorFactory(
      moduleName,
      initializer,
      createContext,
    )

    expect(createDecoratorFactory).toBeCalledTimes(1)
    expect(createDecoratorFactory).lastCalledWith(moduleName, decorator, initializer, createContext)
  })
})
