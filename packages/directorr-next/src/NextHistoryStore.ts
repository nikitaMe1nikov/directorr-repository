import { whenDestroy, whenInit } from '@nimel/directorr';
import Router, { SingletonRouter } from 'next/router';
import {
  Action,
  QueryObject,
  RouterActionPayload,
  HistoryActionPayload,
  actionRouterPush,
  actionRouterReplace,
  actionRouterBack,
  actionRouterReload,
  effectRouterReload,
  actionHistoryPop,
  effectRouterPush,
  effectRouterReplace,
  effectRouterBack,
  effectHistoryPop,
  effectRouterState,
} from '@nimel/directorr-router';
import { reloadWindow } from './utils';

export const ROUTER_EVENT = 'routeChangeComplete';

export default class NextHistoryStore {
  path: string;
  nextRouter: SingletonRouter;
  queryObject?: QueryObject;
  pattern?: string;

  constructor(nextRouter = Router) {
    this.nextRouter = nextRouter;

    this.nextRouter.events.on(ROUTER_EVENT, this.dispatchAction);

    if (this.nextRouter.router) {
      const { asPath, query, pathname } = this.nextRouter.router;

      this.path = asPath;
      this.pattern = pathname;
      this.queryObject = query;
    }
  }

  @actionRouterPush
  push = (path: string, queryObject?: QueryObject) => ({
    path,
    queryObject,
  });

  @actionRouterReplace
  replace = (path: string, queryObject?: QueryObject) => ({
    path,
    queryObject,
  });

  @actionRouterBack
  back = () => {};

  @actionRouterReload
  reload = () => {};

  @effectRouterReload
  toReload = () => reloadWindow();

  @actionHistoryPop
  toHistoryPop = (payload: HistoryActionPayload) => payload;

  @whenInit
  @effectRouterState
  toSetState = (payload: RouterActionPayload) => {
    if (payload) {
      const { pattern, path, queryObject } = payload;

      this.path = path;
      this.pattern = pattern;
      this.queryObject = queryObject;
    }
  };

  isCurrentPattern(pattern: string) {
    return this.pattern === pattern;
  }

  @whenDestroy
  toClear = () => this.nextRouter.events.off(ROUTER_EVENT, this.dispatchAction);

  @effectRouterPush
  toPush = ({ path, queryObject }: RouterActionPayload) =>
    this.nextRouter.push({ pathname: path, query: queryObject });

  @effectRouterReplace
  toReplace = ({ path, queryObject }: RouterActionPayload) =>
    this.nextRouter.replace({ pathname: path, query: queryObject });

  @effectRouterBack
  toBack = () => this.nextRouter.back();

  @effectHistoryPop
  toPop = ({ path, queryObject, pattern }: HistoryActionPayload) => {
    this.path = path;
    this.queryObject = queryObject;
    this.pattern = pattern;
  };

  dispatchAction = () => {
    if (this.nextRouter.router) {
      const { asPath, query, pathname } = this.nextRouter.router;

      this.toHistoryPop({
        path: asPath,
        queryObject: query,
        pattern: pathname,
        action: Action.POP,
      });
    }
  };

  // dont hydrate
  toJSON() {}
}
