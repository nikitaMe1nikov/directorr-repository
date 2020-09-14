import createBuilderDecorator from './createBuilderDecorator';
import decorator from './decorator';
import { CreateDecorator, Initializer, CreateContext } from './types';

export default function createBuilderPropertyDecorator<T1 = any, T2 = any>(
  moduleName: string,
  initializer: Initializer,
  createContext?: CreateContext
): CreateDecorator<T1, T2> {
  return createBuilderDecorator(moduleName, decorator, initializer, createContext);
}
