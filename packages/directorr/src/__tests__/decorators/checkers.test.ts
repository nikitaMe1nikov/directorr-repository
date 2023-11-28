import { propOneOf, propIsNotEqual, propIsNotEqualOneOf } from '../../decorators/checkers'

describe('checkers', () => {
  it('propOneOf', () => {
    const prop = 'prop'
    const otherProp = 'otherProp'
    const payload = {
      prop,
    }
    const checkPayloadTrue = propOneOf([prop])
    const checkPayloadFalse = propOneOf([otherProp])

    expect(checkPayloadTrue(payload, prop)).toBeTruthy()
    expect(checkPayloadFalse(payload, prop)).toBeFalsy()
  })

  it('propIsNotEqual', () => {
    const prop = 'prop'
    const otherProp = 'otherProp'
    const payload = {
      prop,
    }
    const propIsNotEqualFalsy = propIsNotEqual(prop)
    const propIsNotEqualTrue = propIsNotEqual(otherProp)

    expect(propIsNotEqualFalsy(payload, prop)).toBeFalsy()
    expect(propIsNotEqualTrue(payload, prop)).toBeTruthy()
  })

  it('propIsNotEqualOneOf', () => {
    const prop = 'prop'
    const otherProp = 'otherProp'
    const payload = {
      prop,
    }
    const propIsNotEqualFalsy = propIsNotEqualOneOf([prop])
    const propIsNotEqualTrue = propIsNotEqualOneOf([otherProp])

    expect(propIsNotEqualFalsy(payload, prop)).toBeFalsy()
    expect(propIsNotEqualTrue(payload, prop)).toBeTruthy()
  })
})
