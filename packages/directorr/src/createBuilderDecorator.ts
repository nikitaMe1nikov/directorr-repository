import { RETURN_ARG_FUNC } from './utils';
import { BabelDescriptor, Initializer, Decorator, CreateContext } from './types';

export const createBuilderDecorator = (
  moduleName: string,
  decorator: Decorator,
  initializer: Initializer,
  createContext: CreateContext = RETURN_ARG_FUNC
) => (arg1?: any, arg2?: any) => {
  const context = createContext(moduleName, arg1, arg2);

  return (target: any, property: string, descriptor?: BabelDescriptor) =>
    decorator(target, property, descriptor, moduleName, initializer, context);
};

export default createBuilderDecorator;
