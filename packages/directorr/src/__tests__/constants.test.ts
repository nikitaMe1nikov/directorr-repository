import {
  EFFECTS_FIELD_NAME,
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  STORES_FIELD_NAME,
  INJECTED_STORES_FIELD_NAME,
  INJECTED_FROM_FIELD_NAME,
  DEPENDENCY_FIELD_NAME,
  DESCRIPTOR,
  PROPERTY_DESCRIPTOR,
  EMPTY_FUNC,
} from '../constants'

describe('constants', () => {
  it('symbols', () => {
    expect(typeof EFFECTS_FIELD_NAME).toBe('symbol')
    expect(typeof DISPATCH_EFFECTS_FIELD_NAME).toBe('symbol')
    expect(typeof STORES_FIELD_NAME).toBe('symbol')
    expect(typeof DISPATCH_ACTION_FIELD_NAME).toBe('symbol')
    expect(typeof INJECTED_STORES_FIELD_NAME).toBe('symbol')
    expect(typeof INJECTED_FROM_FIELD_NAME).toBe('symbol')
    expect(typeof DEPENDENCY_FIELD_NAME).toBe('symbol')
  })

  it('DESCRIPTOR', () => {
    expect(DESCRIPTOR).toStrictEqual({
      writable: false,
      enumerable: false,
      configurable: true,
      value: null,
    })
  })

  it('PROPERTY_DESCRIPTOR', () => {
    expect(PROPERTY_DESCRIPTOR).toStrictEqual({
      enumerable: false,
      configurable: true,
      get: EMPTY_FUNC,
      set: EMPTY_FUNC,
    })
  })
})
