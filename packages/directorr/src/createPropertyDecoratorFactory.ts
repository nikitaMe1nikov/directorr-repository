import createDecoratorFactory from './createrDecoratorFactory';
import decorator from './decorator';
import { CreateDecorator, Initializer, CreateContext } from './types';

export default function createPropertyDecoratorFactory<T1 = any, T2 = any>(
  moduleName: string,
  initializer: Initializer,
  createContext?: CreateContext
): CreateDecorator<T1, T2> {
  return createDecoratorFactory(moduleName, decorator, initializer, createContext);
}
