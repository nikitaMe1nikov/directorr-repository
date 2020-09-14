import { whenInit, whenDestroy } from '@nimel/directorr';
import { createBrowserHistory } from 'history';
import qs from 'query-string';
import {
  actionRouterPush,
  actionRouterReplace,
  actionRouterBack,
  actionRouterReload,
  effectRouterReload,
  actionHistoryPop,
  actionHistoryPush,
  actionHistoryReplace,
  effectRouterPush,
  effectRouterReplace,
  effectRouterBack,
  actionRouterGoTo,
  effectRouterGoTo,
  actionRouterForward,
  effectRouterForward,
  actionRouterBlock,
  effectRouterBlock,
  effectRouterCancelBlock,
  effectHistoryPop,
  effectHistoryPush,
  effectHistoryReplace,
  effectRouterState,
} from './decorators';
import { calcPath } from './utils';
import {
  Action,
  Blocker,
  History,
  HistoryActionPayload,
  RouterActionPayload,
  BlockState,
  LocationState,
  RouterGoToActionPayload,
  RouterBlockActionPayload,
  QueryObject,
  HistoryRouterTask,
  HistoryRouterHandler,
} from './types';

export default class HistoryStore {
  path: string;
  state?: LocationState;
  queryObject?: QueryObject;
  unsubHistory = () => {};
  action: Action;
  private history: History;
  private handlersStack: HistoryRouterHandler[] = [];
  private blockState: BlockState = [() => {}, () => {}];

  constructor(history = createBrowserHistory()) {
    this.history = history;
    const {
      location: { pathname, search, state },
      action,
    } = this.history;

    this.unsubHistory = this.history.listen(this.dispatchAction as any);

    this.path = pathname;
    this.queryObject = qs.parse(search);
    this.state = state;
    this.action = action as any;
  }

  subscribe = (handler: HistoryRouterHandler) => this.handlersStack.push(handler);

  unsubscribe = (handler: HistoryRouterHandler) => {
    const index = this.handlersStack.indexOf(handler);
    if (index !== -1) this.handlersStack.splice(index, 1);
  };

  @whenInit
  @effectRouterState
  toSetState = (payload: RouterActionPayload) => {
    if (payload) {
      const { path, queryObject, state } = payload;

      this.path = path;
      this.queryObject = queryObject;
      this.state = state;
    }
  };

  @whenDestroy
  toDestroy = () => {
    this.unsubHistory();
  };

  @actionRouterPush
  push = (path: string, queryObject?: QueryObject, state?: LocationState) => ({
    path,
    queryObject,
    state,
  });

  @actionRouterReplace
  replace = (path: string, queryObject?: QueryObject, state?: LocationState) => ({
    path,
    queryObject,
    state,
  });

  @actionRouterBack
  back = () => {};

  @actionRouterReload
  reload = () => {};

  @effectRouterReload
  toReload = () => window.location.reload();

  @actionHistoryPush
  toHistoryPush = (payload: HistoryActionPayload) => payload;

  @actionHistoryPop
  toHistoryPop = (payload: HistoryActionPayload) => payload;

  @actionHistoryReplace
  toHistoryReplace = (payload: HistoryActionPayload) => payload;

  @effectHistoryPop
  @effectHistoryPush
  @effectHistoryReplace
  toPop = ({ path, queryObject, state, action }: HistoryActionPayload) => {
    this.path = path;
    this.queryObject = queryObject;
    this.state = state;
    this.action = action;
  };

  @effectRouterPush
  toPush = ({ path, queryObject, state }: RouterActionPayload) =>
    this.history.push(calcPath(path, queryObject), state);

  @effectRouterReplace
  toReplace = ({ path, queryObject, state }: RouterActionPayload) =>
    this.history.replace(calcPath(path, queryObject), state);

  @effectRouterBack
  toBack = () => this.history.back();

  @actionRouterGoTo
  goTo = (index: number) => ({ index });

  @effectRouterGoTo
  toGoTo = ({ index }: RouterGoToActionPayload) => this.history.go(index);

  @actionRouterForward
  forward = () => {};

  @effectRouterForward
  toForward = () => this.history.forward();

  @actionRouterBlock
  block = (blocker: Blocker) => ({ blocker });

  @effectRouterBlock
  toBlock = ({ blocker }: RouterBlockActionPayload) => {
    this.blockState = [blocker, this.history.block(blocker)];
  };

  @effectRouterCancelBlock
  toCancelBlock = ({ blocker }: RouterBlockActionPayload) => {
    const [lastBlocker, handler] = this.blockState;

    if (blocker === lastBlocker) {
      handler();
    }
  };

  dispatchAction = (task: HistoryRouterTask) => {
    const { location, action } = task;
    const routerPayload: HistoryActionPayload = {
      path: location.pathname,
      queryObject: qs.parse(location.search),
      ...(location.state && { state: location.state }),
      action,
    };

    switch (action) {
      case Action.POP:
        this.toHistoryPop(routerPayload);
        break;
      case Action.REPLACE:
        this.toHistoryReplace(routerPayload);
        break;
      default:
        return this.toHistoryPush(routerPayload);
    }

    for (const handler of this.handlersStack) {
      handler(task);
    }
  };

  toJSON() {}
}
