import {
  isFunction,
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  defineProperty,
  createValueDescriptor,
  getStoreName,
  isMSTModelNode,
  isDev,
} from './utils';
import config from './config';
import { useForPropNotEquallObject, useForPropNotEquallMTS } from './messages';
import {
  Action,
  DispatchProxyAction,
  AddDispatchAction,
  ActionType,
  CreateDecoratorOneArgOption,
} from './types';
import decorator from './decorator';
import createDecoratorFactory from './createDecoratorFactory';
import createActionTypeOptionContext from './createActionTypeOptionContext';
import addInitFields from './initFields';

export const MODULE_NAME = 'connectStore';

export function dispatchProxyAction(
  action: Action,
  fromStore: any,
  toStore: any,
  connectStoreProperty: string,
  prefixActionType?: string
) {
  fromStore[DISPATCH_EFFECTS_FIELD_NAME](action);

  toStore[isDev ? DISPATCH_ACTION_FIELD_NAME : DISPATCH_EFFECTS_FIELD_NAME](
    config.createAction(
      config.createActionType(
        prefixActionType
          ? [prefixActionType, getStoreName(fromStore), action.type]
          : [getStoreName(fromStore), action.type]
      ),
      { ...action.payload, connectStoreProperty }
    )
  );
}

export function addDispatchAction(
  fromStore: any,
  toStore: any,
  property: string,
  prefixActionType?: string,
  dispatchAction: DispatchProxyAction = dispatchProxyAction
) {
  return defineProperty(
    fromStore,
    DISPATCH_ACTION_FIELD_NAME,
    createValueDescriptor((action: Action) =>
      dispatchAction(action, fromStore, toStore, property, prefixActionType)
    )
  );
}

export function initializer(
  initObject: any,
  store: any,
  property: string,
  prefixActionType?: string,
  addDispatchActionInStore: AddDispatchAction = addDispatchAction,
  addFields = addInitFields
) {
  if (isFunction(store)) throw new Error(useForPropNotEquallObject(MODULE_NAME, property));

  if (isMSTModelNode(store)) throw new Error(useForPropNotEquallMTS(MODULE_NAME, property));

  addFields(initObject);

  return addDispatchActionInStore(store, initObject, property, prefixActionType);
}

const connectStore: CreateDecoratorOneArgOption<ActionType> = createDecoratorFactory(
  MODULE_NAME,
  decorator,
  initializer,
  createActionTypeOptionContext
);

export default connectStore;
