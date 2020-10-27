import { Location as LocationHistory, History as HistoryType } from 'history';
import { ParsedQuery } from 'query-string';

export const ACTION: { POP: 'POP'; PUSH: 'PUSH'; REPLACE: 'REPLACE' } = {
  POP: 'POP',
  PUSH: 'PUSH',
  REPLACE: 'REPLACE',
};

export interface Params {
  [key: string]: string | number;
}

export type QueryObject = ParsedQuery;

export type Action = keyof typeof ACTION;
export type Location = LocationHistory;
export type LocationState = Record<string, any> | null;
export type Blocker = (...args: any[]) => any;
export type History = HistoryType;

export interface HistoryRouterTask {
  location: Location;
  action: Action;
}

export type HistoryRouterHandler = (rt: HistoryRouterTask) => void;

export interface HistoryActionPayload {
  path: string;
  queryObject?: QueryObject;
  state?: LocationState;
  action: Action;
  pattern?: string;
}

export interface HistoryChangeActionPayload extends HistoryActionPayload {
  match: boolean;
}

export interface RouterActionPayload {
  path: string;
  queryObject?: QueryObject;
  state?: LocationState;
  pattern?: string;
}

export interface RouterGoToActionPayload {
  index: number;
}

export interface RouterBlockActionPayload {
  blocker: Blocker;
}

export type BlockState = [Blocker, () => void];

export interface Options {
  exact?: boolean;
  strict?: boolean;
}

export interface RouterIsPatternActionPayload {
  pattern: string;
}

export interface RouterIsPatternSuccessActionPayload extends RouterIsPatternActionPayload {
  path: string;
  queryObject?: QueryObject;
}
