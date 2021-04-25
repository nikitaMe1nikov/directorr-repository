import effect from './effect';
import { DIRECTORR_ANY_ACTION_TYPE } from './utils';
import { Action } from './types';

export const allEffect = effect<Action>(DIRECTORR_ANY_ACTION_TYPE);
