import { object, string, number } from 'yup'
import { callWithPropNotEquallFunc } from '@nimel/directorr'
import validateAll, { MODULE_NAME, validateSchema, initializer } from '../validateAll'
import { useWithEffects, callWithWrongSchema } from '../messages'
import { DEFAULT_VALIDATE_OPTIONS } from '../createSchemaContext'
import { someProperty, action, someValue, someFunc } from '../__mocks__/mocks'

class FakeFormStore {
  value: any = someProperty

  changeStatusToInvalid = jest.fn()

  changeStatusToValid = jest.fn()
}

describe('validateAll', () => {
  it('validateSchema', () => {
    const otherProp = 'otherProp'
    const formStore = new FakeFormStore()
    const valueFunc = jest.fn().mockImplementation(v => v)
    const store = {
      [someProperty]: formStore,
      [otherProp]: formStore,
    }
    const fields = [someProperty, otherProp]
    const schema = object({
      [someProperty]: string().required(),
    })
    const schemaNumber = object({
      [someProperty]: number().required(),
      [otherProp]: number().required(),
    })
    const errorMessageOne =
      'someProp must be a `number` type, but the final value was: `"someProp"`.'
    const errorMessageTwo =
      'otherProp must be a `number` type, but the final value was: `"someProp"`.'
    const somePayload = {
      [someProperty]: someValue,
    }

    expect(() =>
      validateSchema(action, valueFunc, store, [schema, DEFAULT_VALIDATE_OPTIONS, fields]),
    ).toThrowError(useWithEffects(MODULE_NAME))

    expect(
      validateSchema(undefined, valueFunc, store, [schema, DEFAULT_VALIDATE_OPTIONS, fields]),
    ).toEqual({})
    expect(formStore.changeStatusToValid).toBeCalledTimes(2)
    expect(formStore.changeStatusToInvalid).toBeCalledTimes(0)
    expect(valueFunc).toBeCalledTimes(1)
    expect(valueFunc).lastCalledWith({})

    expect(
      validateSchema(somePayload, valueFunc, store, [schema, DEFAULT_VALIDATE_OPTIONS, fields]),
    ).toEqual(somePayload)
    expect(formStore.changeStatusToValid).toBeCalledTimes(4)
    expect(formStore.changeStatusToInvalid).toBeCalledTimes(0)
    expect(valueFunc).toBeCalledTimes(2)
    expect(valueFunc).lastCalledWith(somePayload)

    const payload = validateSchema(somePayload, valueFunc, store, [
      schemaNumber,
      DEFAULT_VALIDATE_OPTIONS,
      fields,
    ])
    expect(payload).toMatchObject(somePayload)
    expect(formStore.changeStatusToValid).toBeCalledTimes(4)
    expect(formStore.changeStatusToInvalid).toBeCalledTimes(2)
    expect(formStore.changeStatusToInvalid).nthCalledWith(1, errorMessageOne)
    expect(formStore.changeStatusToInvalid).nthCalledWith(2, errorMessageTwo)
    expect(valueFunc).toBeCalledTimes(3)
  })

  it('initializer', () => {
    const validateSchema = jest.fn()
    const store = {}
    const payload = {}
    const ctx = someValue

    expect(() => initializer(store, someValue, someProperty, ctx)(payload)).toThrowError(
      callWithPropNotEquallFunc(MODULE_NAME, someProperty),
    )

    initializer(store, someFunc, someProperty, ctx, validateSchema)(payload)

    expect(validateSchema).toBeCalledTimes(1)
    expect(validateSchema).lastCalledWith(payload, someFunc, store, ctx)
  })

  it('call validateAll with wrong schema', () => {
    const wrongSchema: any = 4

    expect(() => validateAll(wrongSchema)).toThrowError(
      callWithWrongSchema(MODULE_NAME, wrongSchema),
    )
  })

  it('use validateAll in class', () => {
    const store = new FakeFormStore()
    const effect = jest.fn()
    const otherProperty = 'otherProperty'
    const schema = object({
      [someProperty]: string().required(),
      [otherProperty]: string().required(),
    })
    const payload = someValue

    class SomeClass {
      [someProperty] = store;

      [otherProperty] = store

      @validateAll(schema)
      effect = effect
    }

    const obj = new SomeClass()

    obj.effect(payload)

    expect(store.changeStatusToValid).toBeCalledTimes(2)
    expect(store.changeStatusToInvalid).toBeCalledTimes(0)
    expect(effect).toBeCalledTimes(1)

    store.value = 12
    obj.effect(payload)

    expect(store.changeStatusToValid).toBeCalledTimes(2)
    expect(store.changeStatusToInvalid).toBeCalledTimes(2)
    expect(effect).toBeCalledTimes(2)
  })
})
