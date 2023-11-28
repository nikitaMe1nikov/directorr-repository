import {
  SomeFunction,
  GetFunction,
  SetFunction,
  BabelDescriptor,
  Initializer,
  Decorator,
  DecoratorValueTypedWithType,
} from '../types'
import { DESCRIPTOR, EMPTY_FUNC, PROPERTY_DESCRIPTOR, EMPTY_OBJECT } from '../constants'
import { defineProperty } from './primitives'

export function createValueDescriptor(value?: any): PropertyDescriptor {
  DESCRIPTOR.value = value

  return DESCRIPTOR
}

export function createPropertyDescriptor(
  get: GetFunction = EMPTY_FUNC,
  set: SetFunction = EMPTY_FUNC,
): PropertyDescriptor {
  PROPERTY_DESCRIPTOR.get = get
  PROPERTY_DESCRIPTOR.set = set

  return PROPERTY_DESCRIPTOR
}

export function isDecoratorWithCtx(decorator?: any): decorator is DecoratorValueTypedWithType {
  return !!decorator.type
}

export function isLikePropertyDecorator(
  decorator?: BabelDescriptor,
): decorator is PropertyDescriptor {
  return !!decorator?.initializer || !decorator?.value
}

export function createTypescriptDescriptor(
  descriptor: BabelDescriptor,
  property: string,
  initializer: SomeFunction,
  ctx: any,
): BabelDescriptor {
  const key = Symbol.for(property)
  const { set, get } = descriptor

  function newSet(this: any, newValue: any) {
    let value: any

    if (set && get) {
      set.call(this, newValue)

      value = get.call(this)
    } else {
      value = newValue
    }

    defineProperty(this, key, createValueDescriptor(initializer(this, value, property, ctx)))
  }

  function newGet(this: any) {
    return this[key]
  }

  return createPropertyDescriptor(newGet, newSet)
}

export function isBabelDecorator(decorator?: any): decorator is BabelDescriptor {
  return !!(decorator && decorator.initializer !== undefined)
}

export function isTypescriptDecorator(decorator?: any): decorator is PropertyDescriptor {
  return !!(decorator && !isBabelDecorator(decorator))
}

export function createBabelDescriptor(
  descriptor: BabelDescriptor,
  property: string,
  initializer: Initializer,
  ctx: any,
): BabelDescriptor {
  descriptor.writable = false

  const oldInitializer = descriptor.initializer

  descriptor.initializer = function initializerDirectorr() {
    return initializer(this, oldInitializer && oldInitializer.call(this), property, ctx)
  }

  return descriptor
}

export function createDescriptor(
  d: BabelDescriptor | undefined,
  property: string,
  init: Initializer,
  ctx: any,
): BabelDescriptor {
  return d && isBabelDecorator(d)
    ? createBabelDescriptor(d, property, init, ctx)
    : createTypescriptDescriptor(d || EMPTY_OBJECT, property, init, ctx)
}

export function composePropertyDecorators(decorators: Decorator[]): Decorator {
  return (target: any, property: string, descriptor?: BabelDescriptor) => {
    let resultDescriptor: any = descriptor

    for (let i = decorators.length - 1; i >= 0; --i) {
      resultDescriptor = decorators[i](target, property, resultDescriptor)
    }

    return resultDescriptor
  }
}
