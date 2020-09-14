import { returnArgFunc } from './utils';
import { BabelDescriptor, Initializer, Decorator, CreateContext } from './types';

export const createBuilderDecorator = (
  moduleName: string,
  decorator: Decorator,
  initializer: Initializer,
  createContext: CreateContext = returnArgFunc
) => (arg1?: any, arg2?: any) => {
  const context = createContext(moduleName, arg1, arg2);

  return (target: any, property: string, descriptor?: BabelDescriptor) =>
    decorator(target, property, descriptor, moduleName, initializer, context);
};

export default createBuilderDecorator;
