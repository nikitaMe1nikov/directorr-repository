import effect from './effect'
import whenState from './whenState'
import { composePropertyDecorators, DIRECTORR_DESTROY_STORE_ACTION, pickSameStore } from './utils'
import { DecoratorValueTyped, SomeEffect, InitPayload } from './types'

export const whenDestroy: DecoratorValueTyped<SomeEffect<InitPayload>> = composePropertyDecorators([
  effect(DIRECTORR_DESTROY_STORE_ACTION),
  whenState(pickSameStore),
])

export default whenDestroy
