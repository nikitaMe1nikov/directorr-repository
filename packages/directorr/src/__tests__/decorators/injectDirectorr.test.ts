import { INJECTED_DIRECTORR_FIELD_NAME } from '../../constants'
import { dontUseWithAnotherDecorator, notFoundDirectorr } from '../../messages'
import { someProperty } from '../../__mocks__/mocks'
import injectDirectorr, {
  createInjectDirectorr,
  injectStoreDecoratorr,
  MODULE_NAME,
} from '../../decorators/injectDirectorr'
import { DirectorrInterface } from '../../types'

describe('injectDirectorr', () => {
  it('decorator', () => {
    const directorr = {}

    const descriptor: any = Object.assign({}, injectStoreDecoratorr(MODULE_NAME))

    expect(() => descriptor.set()).not.toThrow()
    expect(() => descriptor.get()).toThrowError(notFoundDirectorr(MODULE_NAME))

    descriptor[INJECTED_DIRECTORR_FIELD_NAME] = directorr

    expect(descriptor.get()).toBe(directorr)
  })

  it('createInjectDirectorr', () => {
    const someDecorator = jest.fn()

    const injector = createInjectDirectorr(MODULE_NAME, someDecorator)

    injector(someDecorator, someProperty)

    expect(someDecorator).toBeCalledTimes(1)
    expect(someDecorator).lastCalledWith(MODULE_NAME)
  })

  // it('injectStore set injected stores field in class', () => {
  //   class InjectStore1 {}
  //   class InjectStore2 {
  //     some = '12'
  //   }

  //   class SomeClass1 {
  //     @injectStore(InjectStore1) store: InjectStore1
  //   }

  //   class SomeClass2 extends SomeClass1 {
  //     @injectStore(InjectStore1) store1: InjectStore1

  //     @injectStore(InjectStore2) store2: InjectStore2
  //   }

  //   expect((SomeClass1 as any)[INJECTED_STORES_FIELD_NAME]).toStrictEqual([InjectStore1])
  //   expect((SomeClass2 as any)[INJECTED_STORES_FIELD_NAME]).toStrictEqual([
  //     InjectStore1,
  //     InjectStore2,
  //   ])
  // })

  // it('use injectStore in class for class or model', () => {
  //   class InjectStore {}
  //   const storesMap = new Map<string, any>([[InjectStore.name, someValue]])

  //   class SomeClass {
  //     @injectStore(InjectStore) store: InjectStore
  //   }

  //   const obj: any = new SomeClass()

  //   expect(() => obj.store).toThrowError(notFoundDirectorrStore(MODULE_NAME, InjectStore))

  //   obj[STORES_FIELD_NAME] = null

  //   expect(() => obj.store).toThrowError(notFoundDirectorrStore(MODULE_NAME, InjectStore))

  //   obj[STORES_FIELD_NAME] = storesMap

  //   expect(() => obj.store).not.toThrow()
  //   expect(obj.store).toBe(someValue)
  // })

  it('use injectStore in class with same store', () => {
    class InjectStore {}
    const directorr = {}

    class SomeClass {
      @injectDirectorr directorr: DirectorrInterface

      @injectDirectorr dir: DirectorrInterface
    }

    const obj: any = new SomeClass()

    expect(() => obj.directorr).toThrowError(notFoundDirectorr(MODULE_NAME, InjectStore))

    obj[INJECTED_DIRECTORR_FIELD_NAME] = directorr

    expect(() => obj.store).not.toThrow()
    expect(obj.directorr).toBe(directorr)
    expect(obj.dir).toBe(directorr)
  })

  it('use injectStore in class with other decorator', () => {
    expect(() => {
      class SomeClass {
        @injectDirectorr
        @injectDirectorr
        store: any
      }

      new SomeClass()
    }).toThrowError(dontUseWithAnotherDecorator(MODULE_NAME))
  })
})
