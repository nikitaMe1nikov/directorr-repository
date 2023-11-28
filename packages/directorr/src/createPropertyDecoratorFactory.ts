import createDecoratorFactory from './decorators/createDecoratorFactory'
import decorator from './decorators/decorator'
import { CreateDecorator, Initializer, CreateContext } from './types'

export function createPropertyDecoratorFactory<T1 = any, T2 = any>(
  moduleName: string,
  initializer: Initializer,
  createContext?: CreateContext,
): CreateDecorator<T1, T2> {
  return createDecoratorFactory(moduleName, decorator, initializer, createContext)
}

export default createPropertyDecoratorFactory
