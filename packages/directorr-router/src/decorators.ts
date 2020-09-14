import {
  whenPayload,
  CreateDecorator,
  composePropertyDecorators,
  createActionAndEffect,
  DecoratorValueTyped,
} from '@nimel/directorr';
import {
  HistoryActionPayload,
  RouterActionPayload,
  RouterGoToActionPayload,
  RouterBlockActionPayload,
  Options,
  HistoryChangeActionPayload,
} from './types';
import { matchPath, calcParams } from './utils';
import { HISTORY_ACTIONS, ROUTER_STORE_ACTIONS } from './actionTypes';

const DEFAULT_OPTIONS: Options = {
  exact: true,
  strict: true,
};

function returnTrue() {
  return true;
}

export const [actionRouterPush, effectRouterPush] = createActionAndEffect<RouterActionPayload>(
  ROUTER_STORE_ACTIONS.PUSH
);
export const [actionRouterReplace, effectRouterReplace] = createActionAndEffect<
  RouterActionPayload
>(ROUTER_STORE_ACTIONS.REPLACE);
export const [actionRouterBack, effectRouterBack] = createActionAndEffect<void>(
  ROUTER_STORE_ACTIONS.BACK
);
export const [actionRouterForward, effectRouterForward] = createActionAndEffect<void>(
  ROUTER_STORE_ACTIONS.FORWARD
);
export const [actionRouterGoTo, effectRouterGoTo] = createActionAndEffect<RouterGoToActionPayload>(
  ROUTER_STORE_ACTIONS.GOTO
);
export const [actionRouterReload, effectRouterReload] = createActionAndEffect<void>(
  ROUTER_STORE_ACTIONS.RELOAD
);
export const [actionRouterBlock, effectRouterBlock] = createActionAndEffect<
  RouterBlockActionPayload
>(ROUTER_STORE_ACTIONS.BLOCK);
export const [actionRouterCancelBlock, effectRouterCancelBlock] = createActionAndEffect<
  RouterBlockActionPayload
>(ROUTER_STORE_ACTIONS.CANCEL_BLOCK);
export const [actionRouterState, effectRouterState] = createActionAndEffect<RouterActionPayload>(
  ROUTER_STORE_ACTIONS.STATE
);

export const [actionHistoryPop, effectHistoryPop] = createActionAndEffect<HistoryActionPayload>(
  HISTORY_ACTIONS.POP
);
export const [actionHistoryPush, effectHistoryPush] = createActionAndEffect<HistoryActionPayload>(
  HISTORY_ACTIONS.PUSH
);
export const [actionHistoryReplace, effectHistoryReplace] = createActionAndEffect<
  HistoryActionPayload
>(HISTORY_ACTIONS.REPLACE);

export const historyChange: CreateDecorator<string, Options> = (
  urlPattern: string,
  { exact, strict }: Options = DEFAULT_OPTIONS
): DecoratorValueTyped<HistoryChangeActionPayload> =>
  composePropertyDecorators([
    effectHistoryPop,
    effectHistoryPush,
    effectHistoryReplace,
    whenPayload(returnTrue, (payload: HistoryActionPayload) => {
      const match = matchPath(payload.path, urlPattern, exact, strict);

      if (match) {
        return {
          ...payload,
          match: {
            ...(match.keys.length && { params: calcParams(match.patterns, match.keys) }),
          },
        };
      }

      return payload;
    }),
  ]);
