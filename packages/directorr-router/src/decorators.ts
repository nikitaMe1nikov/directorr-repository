import {
  whenPayload,
  composePropertyDecorators,
  createActionAndEffect,
  DecoratorValueTyped,
  SomeEffect,
} from '@nimel/directorr';
import {
  HistoryActionPayload,
  RouterActionPayload,
  RouterGoToActionPayload,
  RouterBlockActionPayload,
  Options,
  HistoryChangeActionPayload,
  RouterIsPatternActionPayload,
  RouterIsPatternSuccessActionPayload,
} from './types';
import { matchPath, calcParams } from './utils';

export const [actionRouterPush, effectRouterPush] = createActionAndEffect<RouterActionPayload>(
  'ROUTER.PUSH'
);
export const [actionRouterReplace, effectRouterReplace] = createActionAndEffect<
  RouterActionPayload
>('ROUTER.REPLACE');
export const [actionRouterBack, effectRouterBack] = createActionAndEffect<void>('ROUTER.BACK');
export const [actionRouterForward, effectRouterForward] = createActionAndEffect<void>(
  'ROUTER.FORWARD'
);
export const [actionRouterGoTo, effectRouterGoTo] = createActionAndEffect<RouterGoToActionPayload>(
  'ROUTER.GOTO'
);
export const [actionRouterReload, effectRouterReload] = createActionAndEffect<void>(
  'ROUTER.RELOAD'
);
export const [actionRouterBlock, effectRouterBlock] = createActionAndEffect<
  RouterBlockActionPayload
>('ROUTER.BLOCK');
export const [actionRouterCancelBlock, effectRouterCancelBlock] = createActionAndEffect<
  RouterBlockActionPayload
>('ROUTER.CANCEL_BLOCK');
export const [actionRouterState, effectRouterState] = createActionAndEffect<RouterActionPayload>(
  'ROUTER.STATE'
);

export const [actionRouterIsPattern, effectRouterIsPattern] = createActionAndEffect<
  RouterIsPatternActionPayload
>('ROUTER.IS_PATTERN');
export const [actionRouterIsPatternSuccess, effectRouterIsPatternSuccess] = createActionAndEffect<
  RouterIsPatternSuccessActionPayload
>('ROUTER.IS_PATTERN_SUCCESS');

export const [actionHistoryPop, effectHistoryPop] = createActionAndEffect<HistoryActionPayload>(
  'HISTORY.POP'
);
export const [actionHistoryPush, effectHistoryPush] = createActionAndEffect<HistoryActionPayload>(
  'HISTORY.PUSH'
);
export const [actionHistoryReplace, effectHistoryReplace] = createActionAndEffect<
  HistoryActionPayload
>('HISTORY.REPLACE');

const DEFAULT_OPTIONS: Options = {
  exact: true,
  strict: true,
};

function returnTrue() {
  return true;
}

export function historyChange(
  urlPattern: string,
  { exact, strict }: Options = DEFAULT_OPTIONS
): DecoratorValueTyped<SomeEffect<HistoryChangeActionPayload>> {
  return composePropertyDecorators([
    effectHistoryPop,
    effectHistoryPush,
    effectHistoryReplace,
    whenPayload(returnTrue, (payload: HistoryActionPayload) => {
      const match = matchPath(payload.path, urlPattern, exact, strict);

      return {
        ...payload,
        match: !!match,
        queryObject: {
          ...payload.queryObject,
          ...(match?.keys.length && { params: calcParams(match.patterns, match.keys) }),
        },
      };
    }),
  ]);
}
