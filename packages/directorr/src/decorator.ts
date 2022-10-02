import { isLikePropertyDecorator, createDescriptor } from './utils'
import { useForNotPropDecorator } from './messages'
import { BabelDescriptor, Initializer } from './types'

export function decorator(
  target: any,
  property: string,
  descriptor: BabelDescriptor | undefined,
  moduleName: string,
  initializerForInitObject: Initializer,
  ctx: any,
  buildDescriptor = createDescriptor,
) {
  if (!isLikePropertyDecorator(descriptor))
    throw new Error(useForNotPropDecorator(moduleName, property))

  return buildDescriptor(descriptor, property, initializerForInitObject, ctx)
}

export default decorator
