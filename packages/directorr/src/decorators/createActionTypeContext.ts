import { isLikeActionType } from '../Directorr/directorrUtils'
import config from '../config'
import { callDecoratorWithNotActionType } from '../messages'
import { ActionType } from '../types'

export default function createActionTypeContext(
  moduleName: string,
  actionType: ActionType,
  options: any,
) {
  if (!isLikeActionType(actionType)) {
    throw new Error(callDecoratorWithNotActionType(moduleName, actionType))
  }

  return [config.createActionType(actionType), options]
}
