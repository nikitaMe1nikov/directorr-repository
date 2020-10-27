import { ComponentType, CSSProperties } from 'react';
import { HistoryActionPayload, QueryObject, LocationState } from '@nimel/directorr-router';

export const PERSISTED: { SMART: 'SMART'; ALWAYS: 'ALWAYS'; NEVER: 'NEVER' } = {
  SMART: 'SMART',
  ALWAYS: 'ALWAYS',
  NEVER: 'NEVER',
};

export type Persisted = keyof typeof PERSISTED;

export interface Params {
  [key: string]: string | number;
}

export interface RouteComponentProps {
  params?: Params;
  queryObject?: QueryObject;
  historyState?: LocationState;
  isShowComponent: boolean;
  TITLE?: string;
}

export type Route = RouteComponent | RouteRedirect;

export interface RouteComponent {
  component: ComponentType;
  path: string;
  exact?: boolean;
  strict?: boolean;
  animation?: Animation;
  persisted?: Persisted;
}

export interface RouteRedirect {
  path: string;
  exact?: boolean;
  strict?: boolean;
  redirect: string;
  animation?: Animation;
}

export type RouterTask = HistoryActionPayload;

export type RouterHandler = (rt: RouterTask) => Promise<any> | void;

export interface Animation {
  prev: CSSProperties;
  next: CSSProperties;
  keyFrames?: string;
}
