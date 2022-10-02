import reloadAction from '../reloadAction'
import {
  DISPATCH_ACTION_FIELD_NAME,
  DIRECTORR_RELOAD_STORE_ACTION,
  createValueDescriptor,
} from '../utils'
import config from '../config'
import { someValue } from '../__mocks__/mocks'

describe('reloadAction', () => {
  it('use in class', () => {
    const action = jest.fn().mockImplementation(v => v)
    const dispatch = jest.fn()

    class SomeClass {
      @reloadAction
      action = action
    }

    const obj = new SomeClass()

    Object.defineProperty(obj, DISPATCH_ACTION_FIELD_NAME, createValueDescriptor(dispatch))

    obj.action(someValue)

    expect(action).toBeCalledTimes(1)
    expect(action).lastCalledWith(someValue)

    expect(dispatch).toBeCalledTimes(1)
    expect(dispatch).lastCalledWith(config.createAction(DIRECTORR_RELOAD_STORE_ACTION, someValue))
  })
})
