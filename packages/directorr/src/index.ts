if (typeof Symbol === 'undefined' && typeof Map === 'undefined') {
  throw new Error(
    "Directorr requires Symbol and Map objects. If your environment doesn't support, magic won`t work."
  );
}

import Directorr from './Directorr';
import config from './config';
import action from './action';
import effect from './effect';
import whenPayload from './whenPayload';
import whenState from './whenState';
import whenInit from './whenInit';
import whenDestroy from './whenDestroy';
import injectStore from './injectStore';
import reloadAction from './reloadAction';
import whenReload from './whenReload';
export * from './checkers';
import createBuilderPropertyDecorator from './createBuilderPropertyDecorator';
import connectStore from './connectStore';
import createActionAndEffect from './createActionAndEffect';
import {
  DIRECTORR_INIT_STORE_ACTION,
  DIRECTORR_DESTROY_STORE_ACTION,
  DIRECTORR_RELOAD_STORE_ACTION,
  DEPENDENCY_FIELD_NAME,
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  STORES_FIELD_NAME,
  INJECTED_STORES_FIELD_NAME,
  INJECTED_FROM_FIELD_NAME,
  createAction,
  composePropertyDecorators,
  isFunction,
  isLikeAction,
  createAfterware,
  isActionHave,
  isPayloadHave,
  isStoreReady,
  isStoreError,
} from './utils';
import { callWithPropNotEquallFunc } from './messages';
import DirectorrMock from './__tests__/DirectorrMock';
export * from './types';

export {
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
};