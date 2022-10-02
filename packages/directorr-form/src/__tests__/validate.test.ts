import { object, string, number } from 'yup'
import { callWithPropNotEquallFunc } from '@nimel/directorr'
import validate, { MODULE_NAME, validateSchema, initializer } from '../validate'
import { useWithEffects, callWithWrongSchema } from '../messages'
import { DEFAULT_VALIDATE_OPTIONS } from '../createSchemaContext'
import { someValue, someProperty, someFunc, action } from '../__mocks__/mocks'

class FakeFormStore {
  value: any = someProperty

  changeStatusToInvalid = jest.fn()

  changeStatusToValid = jest.fn()
}

describe('validate', () => {
  it('validateSchema', () => {
    const formStore = new FakeFormStore()
    const valueFunc = jest.fn().mockImplementation(v => v)
    const store = {
      [someProperty]: formStore,
    }
    const fields = [someProperty]
    const schema = object({
      [someProperty]: string().required(),
    })
    const schemaNumber = object({
      [someProperty]: number().required(),
    })
    const errorMessage = 'someProp must be a `number` type, but the final value was: `"someProp"`.'
    const formStorePayload = {
      [DEFAULT_VALIDATE_OPTIONS.payloadProp]: someProperty,
    }

    expect(() =>
      validateSchema(action, valueFunc, store, [schema, DEFAULT_VALIDATE_OPTIONS, fields]),
    ).toThrowError(useWithEffects(MODULE_NAME))

    expect(
      validateSchema(someValue, valueFunc, store, [schema, DEFAULT_VALIDATE_OPTIONS, fields]),
    ).toBeUndefined()

    expect(valueFunc).not.toBeCalled()

    expect(
      validateSchema(undefined, valueFunc, store, [schema, DEFAULT_VALIDATE_OPTIONS, fields]),
    ).toBeUndefined()

    expect(valueFunc).not.toBeCalled()

    expect(
      validateSchema(formStorePayload, valueFunc, store, [
        schema,
        DEFAULT_VALIDATE_OPTIONS,
        fields,
      ]),
    ).toEqual(formStorePayload)
    expect(formStore.changeStatusToValid).toBeCalledTimes(1)
    expect(formStore.changeStatusToInvalid).toBeCalledTimes(0)
    expect(valueFunc).toBeCalledTimes(1)
    expect(valueFunc).lastCalledWith(formStorePayload)

    const payload = validateSchema(formStorePayload, valueFunc, store, [
      schemaNumber,
      DEFAULT_VALIDATE_OPTIONS,
      fields,
    ])
    expect(payload).toMatchObject(formStorePayload)
    expect(payload.validationError).toBeInstanceOf(Error)
    expect(formStore.changeStatusToValid).toBeCalledTimes(1)
    expect(formStore.changeStatusToInvalid).toBeCalledTimes(1)
    expect(formStore.changeStatusToInvalid).lastCalledWith(errorMessage)
    expect(valueFunc).toBeCalledTimes(2)
    expect(valueFunc).lastCalledWith(payload)
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

  it('call validate with wrong schema', () => {
    const wrongSchema: any = 4

    expect(() => validate(wrongSchema)).toThrowError(callWithWrongSchema(MODULE_NAME, wrongSchema))
  })

  it('use validate in class', () => {
    const store = new FakeFormStore()
    const effect = jest.fn()
    const schema = object({
      [someProperty]: string().required(),
    })
    const someOtherPayload = someValue
    const formStorePayload = {
      [DEFAULT_VALIDATE_OPTIONS.payloadProp]: someProperty,
    }

    class SomeClass {
      [someProperty] = store

      @validate(schema)
      effect = effect
    }

    const obj = new SomeClass()

    obj.effect(someOtherPayload)

    expect(store.changeStatusToValid).toBeCalledTimes(0)
    expect(store.changeStatusToInvalid).toBeCalledTimes(0)
    expect(effect).toBeCalledTimes(0)

    obj.effect(formStorePayload)

    expect(store.changeStatusToValid).toBeCalledTimes(1)
    expect(store.changeStatusToInvalid).toBeCalledTimes(0)
    expect(effect).toBeCalledTimes(1)

    store.value = 12
    obj.effect(formStorePayload)

    expect(store.changeStatusToValid).toBeCalledTimes(1)
    expect(store.changeStatusToInvalid).toBeCalledTimes(1)
    expect(effect).toBeCalledTimes(2)
  })
})
