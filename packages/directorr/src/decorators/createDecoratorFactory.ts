import { RETURN_ARG_FUNC } from '../constants'
import { BabelDescriptor, Initializer, Decorator, CreateContext, ConvertDecorator } from '../types'

export function returnArgs(moduleName: any, arg1: any, arg2: any) {
  return [arg1, arg2]
}

export function createDecoratorFactory(
  moduleName: string,
  decorator: Decorator,
  initializer: Initializer,
  createContext: CreateContext = returnArgs,
  convertDecorator: ConvertDecorator = RETURN_ARG_FUNC,
) {
  return function decoratorFactory(arg1?: any, arg2?: any) {
    const context = createContext(moduleName, arg1, arg2)

    return convertDecorator(
      (target: any, property: string, descriptor?: BabelDescriptor) =>
        decorator(target, property, descriptor, moduleName, initializer, context),
      context,
    )
  }
}

export default createDecoratorFactory
