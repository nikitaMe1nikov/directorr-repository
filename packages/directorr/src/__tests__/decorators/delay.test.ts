import delay, { initializer, MODULE_NAME } from '../../decorators/delay'
import {
  // EFFECTS_FIELD_NAME,
  // DISPATCH_ACTION_FIELD_NAME,
  createAction,
  // TIMERS_FIELD_NAME,
  // CLEAR_TIMERS_EFFECT_FIELD_NAME,
  clearTimersEffect,
  // DIRECTORR_DESTROY_STORE_ACTION,
} from '../../Directorr/directorrUtils'
import { someValue, someProperty } from '../../__mocks__/mocks'
import { callWithPropNotEquallFunc } from '../../messages'
import { flushTimeouts } from '../../../../../tests/utils'
import {
  CLEAR_TIMERS_EFFECT_FIELD_NAME,
  DIRECTORR_DESTROY_STORE_ACTION,
  DISPATCH_ACTION_FIELD_NAME,
  EFFECTS_FIELD_NAME,
  TIMERS_FIELD_NAME,
} from '../../constants'

describe('delay', () => {
  it('initializer', async () => {
    const storeWith: any = {
      [EFFECTS_FIELD_NAME]: new Map([
        [DIRECTORR_DESTROY_STORE_ACTION, [DIRECTORR_DESTROY_STORE_ACTION]],
      ]),
    }
    const store: any = {
      [EFFECTS_FIELD_NAME]: new Map(),
    }
    const context = [0] as [number]
    const addFields = jest.fn()
    const args = [1]
    const func = jest.fn()

    expect(() => initializer(store, someValue, someProperty, context)).toThrowError(
      callWithPropNotEquallFunc(MODULE_NAME, someProperty),
    )

    initializer(storeWith, func, someProperty, context, addFields)

    expect(addFields).toBeCalledTimes(1)
    expect(addFields).lastCalledWith(storeWith)

    expect(storeWith[TIMERS_FIELD_NAME]).toHaveLength(0)
    expect(storeWith[CLEAR_TIMERS_EFFECT_FIELD_NAME]).toBe(clearTimersEffect)
    expect(storeWith[EFFECTS_FIELD_NAME].get(DIRECTORR_DESTROY_STORE_ACTION)).toEqual([
      DIRECTORR_DESTROY_STORE_ACTION,
      CLEAR_TIMERS_EFFECT_FIELD_NAME,
    ])

    initializer(store, func, someProperty, context, addFields)(...args)

    expect(addFields).toBeCalledTimes(2)
    expect(addFields).lastCalledWith(store)

    expect(store[TIMERS_FIELD_NAME]).toHaveLength(1)
    expect(store[CLEAR_TIMERS_EFFECT_FIELD_NAME]).toBe(clearTimersEffect)
    expect(store[EFFECTS_FIELD_NAME].get(DIRECTORR_DESTROY_STORE_ACTION)).toEqual([
      CLEAR_TIMERS_EFFECT_FIELD_NAME,
    ])
    expect(func).not.toBeCalled()

    await flushTimeouts()

    expect(store[TIMERS_FIELD_NAME]).toHaveLength(0)
    expect(func).toBeCalledWith(...args)
  })

  it('use in class', async () => {
    const actionOne = jest.fn()
    const actionTwo = jest.fn()

    class SomeClass {
      @delay()
      actionOne = actionOne

      @delay()
      actionTwo = actionTwo
    }

    const store = new SomeClass()

    store.actionOne(someValue)
    store.actionTwo(someValue)

    expect(actionOne).not.toBeCalled()
    expect(actionTwo).not.toBeCalled()

    await flushTimeouts()

    expect(actionOne).toBeCalledTimes(1)
    expect(actionOne).lastCalledWith(someValue)
    expect(actionTwo).toBeCalledTimes(1)
    expect(actionTwo).lastCalledWith(someValue)

    store.actionOne(someValue)
    store.actionTwo(someValue)
    ;(store as any)[DISPATCH_ACTION_FIELD_NAME](
      createAction(DIRECTORR_DESTROY_STORE_ACTION, { store }),
    )

    await flushTimeouts()

    expect(actionOne).toBeCalledTimes(1)
    expect(actionOne).lastCalledWith(someValue)
    expect(actionTwo).toBeCalledTimes(1)
    expect(actionTwo).lastCalledWith(someValue)
  })
})
