import {
  Directorr,
  config,
  action,
  effect,
  injectStore,
  connectStore,
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
  DIRECTORR_RELOAD_STORE_ACTION,
  createAction,
  whenPayload,
  whenState,
  whenInit,
  whenDestroy,
  reloadAction,
  whenReload,
  composePropertyDecorators,
  createBuilderPropertyDecorator,
  callWithPropNotEquallFunc,
  isFunction,
  isLikeAction,
  createAfterware,
  isActionHave,
  isPayloadHave,
  createActionAndEffect,
  isStoreReady,
  isStoreError,
  DEPENDENCY_FIELD_NAME,
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  STORES_FIELD_NAME,
  INJECTED_STORES_FIELD_NAME,
  INJECTED_FROM_FIELD_NAME,
  DirectorrMock,
  EMPTY_STRING,
  EMPTY_OBJECT,
  EMPTY_FUNC,
} from '../index';

describe('index', () => {
  it('check exports', () => {
    expect(Directorr).not.toBeUndefined();
    expect(config).not.toBeUndefined();
    expect(action).not.toBeUndefined();
    expect(effect).not.toBeUndefined();
    expect(injectStore).not.toBeUndefined();
    expect(connectStore).not.toBeUndefined();
    expect(DIRECTORR_INIT_STORE_ACTION).not.toBeUndefined();
    expect(DIRECTORR_DESTROY_STORE_ACTION).not.toBeUndefined();
    expect(DIRECTORR_RELOAD_STORE_ACTION).not.toBeUndefined();
    expect(createAction).not.toBeUndefined();
    expect(whenPayload).not.toBeUndefined();
    expect(whenState).not.toBeUndefined();
    expect(whenInit).not.toBeUndefined();
    expect(whenDestroy).not.toBeUndefined();
    expect(reloadAction).not.toBeUndefined();
    expect(whenReload).not.toBeUndefined();
    expect(composePropertyDecorators).not.toBeUndefined();
    expect(createBuilderPropertyDecorator).not.toBeUndefined();
    expect(callWithPropNotEquallFunc).not.toBeUndefined();
    expect(isFunction).not.toBeUndefined();
    expect(isLikeAction).not.toBeUndefined();
    expect(createAfterware).not.toBeUndefined();
    expect(isActionHave).not.toBeUndefined();
    expect(isPayloadHave).not.toBeUndefined();
    expect(createActionAndEffect).not.toBeUndefined();
    expect(isStoreReady).not.toBeUndefined();
    expect(isStoreError).not.toBeUndefined();
    expect(DEPENDENCY_FIELD_NAME).not.toBeUndefined();
    expect(DISPATCH_ACTION_FIELD_NAME).not.toBeUndefined();
    expect(DISPATCH_EFFECTS_FIELD_NAME).not.toBeUndefined();
    expect(STORES_FIELD_NAME).not.toBeUndefined();
    expect(INJECTED_STORES_FIELD_NAME).not.toBeUndefined();
    expect(INJECTED_FROM_FIELD_NAME).not.toBeUndefined();
    expect(DirectorrMock).not.toBeUndefined();
    expect(EMPTY_STRING).not.toBeUndefined();
    expect(EMPTY_OBJECT).not.toBeUndefined();
    expect(EMPTY_FUNC).not.toBeUndefined();
  });
});