import { DIRECTORR_INIT_STORE_ACTION } from '../utils'
import config from '../config'

export const someValue = { someValue: 'someValue' }
export const someValue2 = { someValue2: 'someValue2' }
export function someFunc() {}
export const actionType = 'actionType1'
export const actionType2 = 'actionType2'
export const actionTypeArray = ['actionType1', 'actionType2']
export const someProperty = 'someProp'
export const action = config.createAction(actionType, someValue)
export const actionTwo = {
  type: actionType2,
  payload: someValue2,
}
export const context = { context: 'context' }
export const initAction = {
  type: DIRECTORR_INIT_STORE_ACTION,
}
export const actionTypePrefix = 'actionTypePrefix'
export const moduleName = 'moduleName'
export const storeName = 'storeName'
export const someDescriptor = {}
export const somePropertyDescriptor = { value: {} }
export const actionWithObjPayload = {
  type: actionType,
  payload: {
    [someProperty]: someValue,
  },
}
export class SomeClass {}
