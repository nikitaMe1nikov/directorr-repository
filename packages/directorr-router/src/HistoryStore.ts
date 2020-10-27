import { whenDestroy, EMPTY_FUNC } from '@nimel/directorr';
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
  actionRouterCancelBlock,
} from './decorators';
import { calcPath, reloadWindow } from './utils';
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
  ACTION,
} from './types';

export default class HistoryStore {
  path: string;
  state?: LocationState;
  queryObject?: QueryObject;
  unsubHistory = EMPTY_FUNC;
  action: Action;
  private history: History;
  private handlersStack: HistoryRouterHandler[] = [];
  private blockState: BlockState = [EMPTY_FUNC, EMPTY_FUNC];

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
    this.action = action;
  }

  subscribe = (handler: HistoryRouterHandler) => this.handlersStack.push(handler);

  unsubscribe = (handler: HistoryRouterHandler) => {
    const index = this.handlersStack.indexOf(handler);
    if (index !== -1) this.handlersStack.splice(index, 1);
  };

  @effectRouterState
  toSetState = ({ path, queryObject, state }: RouterActionPayload) => {
    this.path = path;
    this.queryObject = queryObject;
    this.state = state;
  };

  @whenDestroy
  toDestroy = () => {
    this.unsubHistory();
  };

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
  back = EMPTY_FUNC;

  @actionRouterReload
  reload = EMPTY_FUNC;

  @effectRouterReload
  toReload = () => reloadWindow();

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
  forward = EMPTY_FUNC;

  @effectRouterForward
  toForward = () => this.history.forward();

  @actionRouterBlock
  block = (blocker: Blocker) => ({ blocker });

  @effectRouterBlock
  toBlock = ({ blocker }: RouterBlockActionPayload) => {
    this.blockState = [blocker, this.history.block(blocker)];
  };

  @actionRouterCancelBlock
  cancelBlock = (blocker: Blocker) => ({ blocker });

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
      case ACTION.POP:
        this.toHistoryPop(routerPayload);
        break;
      case ACTION.REPLACE:
        this.toHistoryReplace(routerPayload);
        break;
      default:
        this.toHistoryPush(routerPayload);
    }

    for (const handler of this.handlersStack.concat()) {
      handler(task);
    }
  };

  toJSON() {}
}
