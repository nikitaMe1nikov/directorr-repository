import whenReload from '../../decorators/whenReload'
import { DISPATCH_ACTION_FIELD_NAME, DIRECTORR_RELOAD_STORE_ACTION } from '../../constants'
import config from '../../config'
import { someValue } from '../../__mocks__/mocks'

describe('whenReload', () => {
  it('use in class', () => {
    const effect = jest.fn()
    const action = config.createAction(DIRECTORR_RELOAD_STORE_ACTION, someValue)

    class SomeClass {
      @whenReload
      effect = effect
    }

    const obj: any = new SomeClass()

    obj[DISPATCH_ACTION_FIELD_NAME](action)

    expect(effect).toBeCalledTimes(1)
    expect(effect).lastCalledWith(someValue)
  })
})
