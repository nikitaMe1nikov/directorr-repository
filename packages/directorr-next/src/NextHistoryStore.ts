import { whenDestroy, EMPTY_STRING, EMPTY_OBJECT } from '@nimel/directorr';
import Router, { SingletonRouter } from 'next/router';
import {
  ACTION,
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
  effectRouterIsPattern,
  RouterIsPatternActionPayload,
  actionRouterIsPatternSuccess,
} from '@nimel/directorr-router';
import { reloadWindow, convertBracketToColonParams } from './utils';

export const ROUTER_EVENT = 'routeChangeComplete';

export default class NextHistoryStore {
  path = EMPTY_STRING;
  nextRouter: SingletonRouter;
  queryObject: QueryObject = EMPTY_OBJECT;
  pattern?: string;

  constructor(nextRouter = Router) {
    this.nextRouter = nextRouter;

    this.nextRouter.events.on(ROUTER_EVENT, this.dispatchAction);

    if (this.nextRouter.router) {
      const { asPath, query, pathname } = this.nextRouter.router;

      this.path = asPath;
      this.pattern = convertBracketToColonParams(pathname);
      this.queryObject = query;
    }
  }

  @actionRouterPush
  push = (path: string, queryObject: QueryObject = EMPTY_OBJECT) => ({
    path,
    queryObject,
  });

  @actionRouterReplace
  replace = (path: string, queryObject: QueryObject = EMPTY_OBJECT) => ({
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

  @effectRouterState
  toSetState = ({ pattern, path, queryObject = EMPTY_OBJECT }: RouterActionPayload) => {
    this.path = path;
    this.pattern = convertBracketToColonParams(pattern);
    this.queryObject = queryObject;
  };

  @effectRouterIsPattern
  @actionRouterIsPatternSuccess
  checkPattern = ({ pattern, store }: RouterIsPatternActionPayload) =>
    this.pattern === pattern
      ? { pattern, path: this.path, queryObject: this.queryObject, store }
      : null;

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
        pattern: convertBracketToColonParams(pathname),
        action: ACTION.POP,
      });
    }
  };

  // dont hydrate
  toJSON() {}
}
