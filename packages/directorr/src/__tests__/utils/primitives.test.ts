import {
  isFunction,
  isObject,
  batchFunction,
  createPromiseCancelable,
} from '../../utils/primitives'
import { someValue, someFunc } from '../../__mocks__/mocks'
import { DESCRIPTOR, EMPTY_FUNC, PROPERTY_DESCRIPTOR } from '../../constants'
import { flushPromises } from '../../../../../tests/utils'

describe('primitives', () => {
  it('isFunction', () => {
    expect(isFunction(4)).toBeFalsy()
    expect(isFunction(someValue)).toBeFalsy()
    expect(isFunction(someFunc)).toBeTruthy()
  })

  it('isObject', () => {
    expect(isObject(true)).toBeFalsy()
    expect(isObject(3)).toBeFalsy()
    expect(isObject(someFunc)).toBeFalsy()
    expect(isObject(someValue)).toBeTruthy()
  })

  it('batchFunction', () => {
    expect(batchFunction(someFunc)).toBe(someFunc)
  })

  it('DESCRIPTOR', () => {
    expect(DESCRIPTOR).toStrictEqual({
      writable: false,
      enumerable: false,
      configurable: true,
      value: null,
    })
  })

  it('PROPERTY_DESCRIPTOR', () => {
    expect(PROPERTY_DESCRIPTOR).toStrictEqual({
      enumerable: false,
      configurable: true,
      get: EMPTY_FUNC,
      set: EMPTY_FUNC,
    })
  })

  it('createPromiseCancelable when not resolved', async () => {
    const fulfill = jest.fn()
    const reject = jest.fn()
    const whenCancelCallback = jest.fn()
    const notResolvedExecutor = (res: any, rej: any, whenCancel: any) => {
      whenCancel(whenCancelCallback)
    }

    const promise = createPromiseCancelable(notResolvedExecutor)

    promise.then(fulfill).catch(reject)

    await flushPromises()

    expect(fulfill).not.toBeCalled()
    expect(reject).not.toBeCalled()
    expect(whenCancelCallback).not.toBeCalled()

    promise.cancel()

    expect(fulfill).not.toBeCalled()
    expect(reject).not.toBeCalled()
    expect(whenCancelCallback).toBeCalled()
  })

  it('createPromiseCancelable when resolved', async () => {
    const fulfill = jest.fn()
    const reject = jest.fn()
    const whenCancelCallback = jest.fn()
    const resolvedExecutor = (res: any, rej: any, whenCancel: any) => {
      res()
      whenCancel(whenCancelCallback)
    }

    const promise = createPromiseCancelable(resolvedExecutor)

    promise.then(fulfill).catch(reject)

    await flushPromises()

    expect(fulfill).toBeCalledTimes(1)
    expect(reject).not.toBeCalled()
    expect(whenCancelCallback).not.toBeCalled()

    promise.cancel()

    expect(fulfill).toBeCalledTimes(1)
    expect(reject).not.toBeCalled()
    expect(whenCancelCallback).not.toBeCalled()
  })

  it('createPromiseCancelable when rejected', async () => {
    const fulfill = jest.fn()
    const reject = jest.fn()
    const whenCancelCallback = jest.fn()
    const resolvedExecutor = (res: any, rej: any, whenCancel: any) => {
      rej()
      whenCancel(whenCancelCallback)
    }

    const promise = createPromiseCancelable(resolvedExecutor)

    promise.then(fulfill).catch(reject)

    await flushPromises()

    expect(reject).toBeCalledTimes(1)
    expect(fulfill).not.toBeCalled()
    expect(whenCancelCallback).not.toBeCalled()

    promise.cancel()

    expect(reject).toBeCalledTimes(1)
    expect(fulfill).not.toBeCalled()
    expect(whenCancelCallback).not.toBeCalled()
  })
})
