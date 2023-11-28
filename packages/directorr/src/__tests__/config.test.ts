import {
  // batchFunction,
  createAction,
  createActionType,
  // ACTION_TYPE_DIVIDER,
  dispatchEffects,
  hydrateStoresToState,
  mergeStateToStore,
} from '../Directorr/directorrUtils'
import config from '../config'
import { actionType, actionType2 } from '../__mocks__/mocks'
import { ACTION_TYPE_DIVIDER } from '../constants'
import { batchFunction } from '../utils/primitives'

describe('config', () => {
  it('config default', () => {
    expect(config.batchFunction).toBe(batchFunction)
    expect(config.createAction).toBe(createAction)
    expect(config.actionTypeDivider).toBe(ACTION_TYPE_DIVIDER)
    expect(config.createActionType([actionType, actionType2])).toEqual(
      createActionType([actionType, actionType2], config.actionTypeDivider),
    )
    expect(config.dispatchEffectsOrig).toBe(dispatchEffects)
    expect(config.dispatchEffects).toBe(dispatchEffects)
    expect(config.hydrateStoresToState).toBe(hydrateStoresToState)
    expect(config.mergeStateToStore).toBe(mergeStateToStore)

    config.configure({})

    expect(config.batchFunction).toBe(batchFunction)
    expect(config.createAction).toBe(createAction)
    expect(config.actionTypeDivider).toBe(ACTION_TYPE_DIVIDER)
    expect(config.createActionType([actionType, actionType2])).toEqual(
      createActionType([actionType, actionType2], config.actionTypeDivider),
    )
    expect(config.dispatchEffectsOrig).toBe(dispatchEffects)
    expect(config.dispatchEffects).toBe(dispatchEffects)
    expect(config.hydrateStoresToState).toBe(hydrateStoresToState)
    expect(config.mergeStateToStore).toBe(mergeStateToStore)
  })

  it('config.configure', () => {
    const batchFunction = jest.fn().mockImplementation(v => v)
    const createAction = jest.fn()
    const actionTypeDivider = 'actionTypeDivider'
    const createActionType = jest.fn()
    const dispatchEffects = jest.fn()
    const hydrateStoresToState = jest.fn()
    const mergeStateToStore = jest.fn()

    config.configure({
      batchFunction,
      createAction,
      actionTypeDivider,
      createActionType,
      dispatchEffects,
      hydrateStoresToState,
      mergeStateToStore,
    })

    expect(config.batchFunction).toBe(batchFunction)
    expect(config.createAction).toBe(createAction)
    expect(config.actionTypeDivider).toBe(actionTypeDivider)
    expect(config.createActionType([actionType, actionType2])).toEqual(
      createActionType([actionType, actionType2], actionTypeDivider),
    )
    expect(config.dispatchEffectsOrig).toBe(dispatchEffects)
    expect(config.dispatchEffects).toBe(dispatchEffects)
    expect(config.hydrateStoresToState).toBe(hydrateStoresToState)
    expect(config.mergeStateToStore).toBe(mergeStateToStore)
  })
})
