import { createActionFactory } from '../createActionFactory'
import { actionType, someValue } from '../__mocks__/mocks'

describe('createActionFactory', () => {
  it('createActionFactory', () => {
    const createAction = createActionFactory<typeof someValue>(actionType)

    expect(createAction(someValue)).toStrictEqual({
      type: actionType,
      payload: someValue,
    })
  })
})
