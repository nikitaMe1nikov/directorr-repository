import { Action } from './types';
import config from './config';

export function createActionFactory<P = any>(type: string) {
  return (payload?: P): Action<string, P> => config.createAction(type, payload);
}
