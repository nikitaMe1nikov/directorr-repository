import {
  batchFunction,
  createAction,
  createActionType,
  ACTION_TYPE_DIVIDER,
  dispatchEffects,
  hydrateStoresToState,
  mergeStateToStore,
} from './utils';
import {
  BatchFunction,
  CreateActionFunction,
  DispatchEffects,
  CreateActionTypeFunction,
  Configure,
  HydrateStoresToState,
  MergeStateToStores,
} from './types';

class Config {
  batchFunction: BatchFunction = batchFunction;

  createAction: CreateActionFunction = createAction;

  createActionType: CreateActionTypeFunction = actionType =>
    createActionType(actionType, this.actionTypeDivider);

  actionTypeDivider: string = ACTION_TYPE_DIVIDER;

  dispatchEffectsOrig: DispatchEffects = dispatchEffects;

  dispatchEffects: DispatchEffects = dispatchEffects;

  hydrateStoresToState: HydrateStoresToState = hydrateStoresToState;

  mergeStateToStore: MergeStateToStores = mergeStateToStore;

  configure: Configure = ({
    batchFunction,
    createAction,
    actionTypeDivider,
    createActionType,
    dispatchEffects,
    hydrateStoresToState,
    mergeStateToStore,
  }) => {
    if (batchFunction) {
      this.batchFunction = batchFunction;
      this.dispatchEffects = batchFunction(this.dispatchEffectsOrig);
    }

    if (createAction) this.createAction = createAction;

    if (createActionType) this.createActionType = createActionType;

    if (actionTypeDivider) this.actionTypeDivider = actionTypeDivider;

    if (dispatchEffects) {
      this.dispatchEffectsOrig = dispatchEffects;
      this.dispatchEffects = this.batchFunction(dispatchEffects);
    }

    if (hydrateStoresToState) this.hydrateStoresToState = hydrateStoresToState;

    if (mergeStateToStore) this.mergeStateToStore = mergeStateToStore;
  };
}

export const config = new Config();

export default config;
