import {
  batchFunction,
  createAction,
  createActionType,
  ACTION_TYPE_DIVIDER,
  dispatchEffects,
  hydrateStoresToState,
  mergeStateToStore,
} from '../utils';
import config from '../config';
import { actionType, actionType2 } from './mocks';

describe('config', () => {
  it('config default', () => {
    expect(config.batchFunction).toEqual(batchFunction);
    expect(config.createAction).toEqual(createAction);
    expect(config.actionTypeDivider).toEqual(ACTION_TYPE_DIVIDER);
    expect(config.createActionType([actionType, actionType2])).toEqual(
      createActionType([actionType, actionType2], config.actionTypeDivider)
    );
    expect(config.dispatchEffectsOrig).toEqual(dispatchEffects);
    expect(config.dispatchEffects).toEqual(dispatchEffects);
    expect(config.hydrateStoresToState).toEqual(hydrateStoresToState);
    expect(config.mergeStateToStore).toEqual(mergeStateToStore);
  });

  it('config.configure', () => {
    const batchFunction = jest.fn().mockImplementation(v => v);
    const createAction = jest.fn();
    const actionTypeDivider = 'actionTypeDivider';
    const createActionType = jest.fn();
    const dispatchEffects = jest.fn();
    const hydrateStoresToState = jest.fn();
    const mergeStateToStore = jest.fn();

    config.configure({
      batchFunction,
      createAction,
      actionTypeDivider,
      createActionType,
      dispatchEffects,
      hydrateStoresToState,
      mergeStateToStore,
    });

    expect(config.batchFunction).toEqual(batchFunction);
    expect(config.createAction).toEqual(createAction);
    expect(config.actionTypeDivider).toEqual(actionTypeDivider);
    expect(config.createActionType([actionType, actionType2])).toEqual(
      createActionType([actionType, actionType2], actionTypeDivider)
    );
    expect(config.dispatchEffectsOrig).toEqual(dispatchEffects);
    expect(config.dispatchEffects).toEqual(dispatchEffects);
    expect(config.hydrateStoresToState).toEqual(hydrateStoresToState);
    expect(config.mergeStateToStore).toEqual(mergeStateToStore);
  });
});
