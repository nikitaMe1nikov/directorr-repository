import { ComponentType, CSSProperties } from 'react';
import { HistoryRouterTask, QueryObject, LocationState } from '@nimel/directorr-router';
import { PERSISTED } from './utils';

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

interface ComponentWithStaticTitle {
  TITLE?: string;
}

export type RouteComponentType = ComponentWithStaticTitle & ComponentType<any>;

export type Route = RouteComponent | RouteRedirect;

export interface RouteComponent {
  component: RouteComponentType;
  path: string;
  exact: boolean;
  strict: boolean;
  animation: Animation;
  persisted: Persisted;
}

export interface RouteRedirect {
  path: string;
  exact: boolean;
  strict: boolean;
  redirect: string;
  animation: Animation;
}

export type RouterTask = HistoryRouterTask;

export type RouterHandler = (rt: RouterTask) => Promise<any> | void;

export interface Animation {
  prev: CSSProperties;
  next: CSSProperties;
  keyFrames?: string;
}
