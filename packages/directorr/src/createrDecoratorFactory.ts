import { RETURN_ARG_FUNC } from './utils';
import { BabelDescriptor, Initializer, Decorator, CreateContext, ConvertDecorator } from './types';

export default function createDecoratorFactory(
  moduleName: string,
  decorator: Decorator,
  initializer: Initializer,
  createContext: CreateContext = RETURN_ARG_FUNC,
  convertDecorator: ConvertDecorator = RETURN_ARG_FUNC
) {
  return function decoratorFactory(arg1?: any, arg2?: any) {
    const context = createContext(moduleName, arg1, arg2);

    return convertDecorator(
      (target: any, property: string, descriptor?: BabelDescriptor) =>
        decorator(target, property, descriptor, moduleName, initializer, context),
      context
    );
  };
}
