import effect from './effect'
import whenState from './whenState'
import { pickSameStore } from '../Directorr/directorrUtils'
import { DecoratorValueTyped, SomeEffect, InitPayload } from '../types'
import { DIRECTORR_DESTROY_STORE_ACTION } from '../constants'
import { composePropertyDecorators } from '../utils/decoratorsUtils'

export const whenDestroy: DecoratorValueTyped<SomeEffect<InitPayload>> = composePropertyDecorators([
  effect(DIRECTORR_DESTROY_STORE_ACTION),
  whenState(pickSameStore),
])

export default whenDestroy
