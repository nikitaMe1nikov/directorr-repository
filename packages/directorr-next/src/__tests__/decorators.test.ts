import { historyChange } from '../decorators'
import { actionHistoryPop } from '@nimel/directorr-router'
import { createAction, DISPATCH_EFFECTS_FIELD_NAME } from '@nimel/directorr'

describe('decorators', () => {
  it('historyChange with HISTORY_ACTIONS.POP', () => {
    const effect = jest.fn()
    const pattern = '/'
    const someDiffrentPattern = '/someDiffrent'
    class SomeStore {
      @historyChange(pattern)
      effect = effect
    }
    const store: any = new SomeStore()

    store[DISPATCH_EFFECTS_FIELD_NAME](createAction(actionHistoryPop.type, { pattern }))

    expect(effect).toBeCalledTimes(1)
    expect(effect).lastCalledWith({ pattern, match: true })

    store[DISPATCH_EFFECTS_FIELD_NAME](
      createAction(actionHistoryPop.type, { pattern: someDiffrentPattern }),
    )

    expect(effect).toBeCalledTimes(2)
    expect(effect).lastCalledWith({ pattern: someDiffrentPattern })
  })
})
