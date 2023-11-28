import {
  SomeFunction,
  SomeObject,
  CheckObjectPattern,
  Executor,
  PromiseCancelable,
  Resolver,
  Rejector,
} from '../types'
import { EMPTY_FUNC, TYPEOF } from '../constants'

export const { isArray } = Array

export const {
  defineProperty,
  keys,
  prototype: { toString, hasOwnProperty: hasOwnPropertyFromPrototype },
} = Object

const STRING_OBJECT = '[object Object]'

export function isObject(obj: any): obj is SomeObject {
  return toString.call(obj) === STRING_OBJECT
}

export function isString(str: any): str is string {
  return typeof str === TYPEOF.STRING
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(func: any): func is Function {
  return !!(func && func.constructor && func.call && func.apply)
}

export function isPromise(promise: any): promise is Promise<any> {
  return !!(promise && promise.then && promise.catch)
}

export function hasOwnProperty(target: any, prop: string | symbol) {
  return hasOwnPropertyFromPrototype.call(target, prop)
}

export function batchFunction(f: SomeFunction): SomeFunction {
  return f
}

export function compareObjectWithPattern(
  objectPattern: CheckObjectPattern,
  obj?: SomeObject,
): boolean {
  if (!obj) return false

  for (const prop in objectPattern) {
    const value = objectPattern[prop]

    if (isFunction(value)) {
      if (!value(obj[prop])) return false
    } else if (obj[prop] !== value) {
      return false
    }
  }

  return true
}

export function createPromiseCancelable<T = any>(executor: Executor<T>): PromiseCancelable<T> {
  let resolvecb: Resolver<T> = EMPTY_FUNC
  let rejectcb: Rejector = EMPTY_FUNC
  let callback: () => void = EMPTY_FUNC
  let pending = true

  function whenCancel(cb: () => void) {
    callback = cb
  }

  function resolver(arg: any) {
    pending = false

    return resolvecb(arg)
  }

  function rejector(arg: any) {
    pending = false

    return rejectcb(arg)
  }

  function cancel() {
    resolvecb(Promise.resolve<any>(undefined))

    if (pending) callback()
  }

  const promise = new Promise((resolve, reject) => {
    resolvecb = resolve
    rejectcb = reject
    executor(resolver, rejector, whenCancel)
  }) as PromiseCancelable<T>

  promise.cancel = cancel

  return promise
}
