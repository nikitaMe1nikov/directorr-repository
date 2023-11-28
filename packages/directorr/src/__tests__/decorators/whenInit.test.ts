import whenInit from '../../decorators/whenInit'
import { DIRECTORR_INIT_STORE_ACTION, DISPATCH_ACTION_FIELD_NAME } from '../../constants'
import config from '../../config'

describe('whenInit', () => {
  it('use in class', () => {
    const effect = jest.fn()

    class SomeClass {
      @whenInit
      effect = effect
    }

    const store: any = new SomeClass()

    const action = config.createAction(DIRECTORR_INIT_STORE_ACTION, {
      store,
    })

    store[DISPATCH_ACTION_FIELD_NAME](action)

    expect(effect).toBeCalledTimes(1)
    expect(effect).lastCalledWith(action.payload)
  })
})
