export const EFFECTS_FIELD_NAME = Symbol.for('dirrector: effects')
export const DISPATCH_ACTION_FIELD_NAME = Symbol.for('dirrector: dispatchAction')
export const DISPATCH_EFFECTS_FIELD_NAME = Symbol.for('dirrector: dispatchEffects')
export const STORES_FIELD_NAME = Symbol.for('dirrector: stores')
export const INJECTED_STORES_FIELD_NAME = Symbol.for('dirrector: injected stores')
export const INJECTED_FROM_FIELD_NAME = Symbol.for('dirrector: injected from stores')
export const DEPENDENCY_FIELD_NAME = Symbol.for('dirrector: external dependency')
export const TIMERS_FIELD_NAME = Symbol.for('dirrector: timers')
export const CLEAR_TIMERS_EFFECT_FIELD_NAME = Symbol.for('dirrector: clear timers')
export const SUBSCRIBE_FIELD_NAME = Symbol.for('dirrector: subscribe')
export const UNSUBSCRIBE_FIELD_NAME = Symbol.for('dirrector: unsubscribe')
export const SUBSCRIBERS_FIELD_NAME = Symbol.for('dirrector: subscribers')
export const DISPATCH_SUBSCRIBERS_FIELD_NAME = Symbol.for('dirrector: dispatchSubscribers')
export const DISPATHERS_FIELD_NAME = Symbol.for('dirrector: dispatchers')
export const DISPATHERS_EFFECT_FIELD_NAME = Symbol.for('dirrector: clear dispatchers')
export const INJECTED_DIRECTORR_FIELD_NAME = Symbol.for('dirrector: injected directorr')
export const EMPTY_FUNC = () => {}
export const RETURN_ARG_FUNC = (a: any) => a
export const TRUPHY_FUNC = () => true
export const EMPTY_STRING = ''
export const EMPTY_OBJECT = Object.freeze({})
export const DIRECTORR_INIT_STORE_ACTION = '@@DIRECTORR.INIT_STORE'
export const DIRECTORR_DESTROY_STORE_ACTION = '@@DIRECTORR.DESTROY_STORE'
export const DIRECTORR_RELOAD_STORE_ACTION = '@@DIRECTORR.RELOAD_STORE'
export const DIRECTORR_ANY_ACTION_TYPE = '@@DIRECTORR.ANY_ACTION'
export const ACTION_TYPE_DIVIDER = '.'

export const isDev = process.env.NODE_ENV === 'development'

export const TYPEOF = {
  STRING: 'string',
}

export const DESCRIPTOR: PropertyDescriptor = {
  writable: false,
  enumerable: false,
  configurable: true,
  value: null,
}

export const PROPERTY_DESCRIPTOR: PropertyDescriptor = {
  enumerable: false,
  configurable: true,
  get: EMPTY_FUNC,
  set: EMPTY_FUNC,
}
