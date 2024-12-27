import {
  createAction,
  createActionType,
  dispatchEffects,
  dispatchSubscribersOnStore,
  hydrateStoresToState,
  mergeStateToStore,
  setStateToStore,
  subscribeOnStore,
  unsubscribeOnStore,
} from './Directorr/directorrUtils'
import {
  BatchFunction,
  CreateActionFunction,
  DispatchEffects,
  CreateActionTypeFunction,
  Configure,
  HydrateStoresToState,
  MergeStateToStores,
  SetStateToStore,
  DispatchSubscribersOnStore,
  SubscribeOnStore,
  UnsubscribeOnStore,
} from './types'
import { ACTION_TYPE_DIVIDER } from './constants'
import { batchFunction } from './utils/primitives'

class Config {
  batchFunction: BatchFunction = batchFunction

  createAction: CreateActionFunction = createAction

  createActionType: CreateActionTypeFunction = actionType =>
    createActionType(actionType, this.actionTypeDivider)

  actionTypeDivider: string = ACTION_TYPE_DIVIDER

  dispatchEffectsOrig: DispatchEffects = dispatchEffects

  dispatchEffects: DispatchEffects = dispatchEffects

  dispatchSubscribersOnStore: DispatchSubscribersOnStore = dispatchSubscribersOnStore

  subscribeOnStore: SubscribeOnStore = subscribeOnStore

  unsubscribeOnStore: UnsubscribeOnStore = unsubscribeOnStore

  hydrateStoresToState: HydrateStoresToState = hydrateStoresToState

  mergeStateToStore: MergeStateToStores = mergeStateToStore

  setStateToStore: SetStateToStore = setStateToStore

  configure: Configure = ({
    batchFunction,
    createAction,
    actionTypeDivider,
    createActionType,
    dispatchEffects,
    hydrateStoresToState,
    mergeStateToStore,
    setStateToStore,
    dispatchSubscribersOnStore,
    subscribeOnStore,
    unsubscribeOnStore,
  } = {}) => {
    if (batchFunction) {
      this.batchFunction = batchFunction
      this.dispatchEffects = batchFunction(this.dispatchEffectsOrig)
    }

    if (createAction) this.createAction = createAction

    if (createActionType) this.createActionType = createActionType

    if (actionTypeDivider) this.actionTypeDivider = actionTypeDivider

    if (dispatchEffects) {
      this.dispatchEffectsOrig = dispatchEffects
      this.dispatchEffects = this.batchFunction(dispatchEffects)
    }

    if (hydrateStoresToState) this.hydrateStoresToState = hydrateStoresToState

    if (mergeStateToStore) this.mergeStateToStore = mergeStateToStore

    if (setStateToStore) this.setStateToStore = setStateToStore

    if (dispatchSubscribersOnStore) this.dispatchSubscribersOnStore = dispatchSubscribersOnStore

    if (subscribeOnStore) this.subscribeOnStore = subscribeOnStore

    if (unsubscribeOnStore) this.unsubscribeOnStore = unsubscribeOnStore
  }
}

export const config = new Config()

export default config
