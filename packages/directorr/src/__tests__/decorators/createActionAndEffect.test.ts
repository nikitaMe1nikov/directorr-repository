import { createActionAndEffect } from '../../decorators/createActionAndEffect'
import { actionType, someValue } from '../../__mocks__/mocks'

describe('createActionAndEffect', () => {
  it('use in class', () => {
    const [action, effect] = createActionAndEffect<void>(actionType)

    class SomeClass {
      @action
      someAction = jest.fn().mockImplementation(v => v)

      @effect
      someEffect = jest.fn()
    }

    const obj = new SomeClass()

    obj.someAction(someValue)

    expect(obj.someEffect).toBeCalledTimes(1)
    expect(obj.someEffect).lastCalledWith(someValue)
  })
})
