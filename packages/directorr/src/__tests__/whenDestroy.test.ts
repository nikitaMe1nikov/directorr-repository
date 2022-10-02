import whenDestroy from '../whenDestroy'
import { DISPATCH_ACTION_FIELD_NAME, DIRECTORR_DESTROY_STORE_ACTION } from '../utils'
import config from '../config'

describe('whenDestroy', () => {
  it('use in class', () => {
    const effect = jest.fn()

    class SomeClass {
      @whenDestroy
      effect = effect
    }

    const store: any = new SomeClass()

    const action = config.createAction(DIRECTORR_DESTROY_STORE_ACTION, {
      store,
    })

    store[DISPATCH_ACTION_FIELD_NAME](action)

    expect(effect).toBeCalledTimes(1)
    expect(effect).lastCalledWith(action.payload)
  })
})
