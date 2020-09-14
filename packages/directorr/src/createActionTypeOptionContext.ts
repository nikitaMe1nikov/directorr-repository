import { isLikeActionType } from './utils';
import config from './config';
import { callDecoratorWithNotActionType } from './messages';
import { ActionType } from './types';

export default function createActionTypeOptionContext(moduleName: string, actionType?: ActionType) {
  if (actionType) {
    if (!isLikeActionType(actionType)) {
      throw new Error(callDecoratorWithNotActionType(moduleName, actionType));
    }

    return config.createActionType(actionType);
  }

  return actionType;
}
