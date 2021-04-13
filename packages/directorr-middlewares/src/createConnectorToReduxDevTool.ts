import { Action, Next, DirectorrInterface, Middleware } from '@nimel/directorr';

const DISPATCH_TYPE = 'DISPATCH';
const JUMP_TO_STATE_TYPE = 'JUMP_TO_STATE';
const JUMP_TO_ACTION_TYPE = 'JUMP_TO_ACTION';
const TOGGLE_ACTION = 'TOGGLE_ACTION';
const RESET = 'RESET';
const COMMIT = 'COMMIT';
const ROLLBACK = 'ROLLBACK';
const IMPORT_STATE = 'IMPORT_STATE';

function calcNewActionsState(currentState: string, id: number, store: DirectorrInterface) {
  const state = JSON.parse(currentState);

  const currentIDX = state.stagedActionIds.indexOf(id);

  if (currentIDX === -1) return state;

  const stagedActionIds: string[] = state.stagedActionIds.slice(0, currentIDX + 1);
  const actionsById = stagedActionIds.reduce(
    (acc, id) => (acc[id] = state.actionsById[id]) && acc,
    {} as Record<string, any>
  );
  const computedStates = state.computedStates.slice(0, currentIDX + 1);

  store.setStateToStore(computedStates[computedStates.length - 1].state);

  return {
    actionsById,
    computedStates,
    currentStateIndex: computedStates.length - 1,
    nextActionId: stagedActionIds[stagedActionIds.length - 1] + 1,
    skippedActionIds: [],
    stagedActionIds,
  };
}

export type Options = {
  name?: string;
  latency?: number;
  maxAge?: number;
  trace?: boolean;
  traceLimit?: number;
  actionsBlacklist?: string[];
  actionsWhitelist?: string[];
  features?: Record<string, any>;
};

export default function createConnectorToReduxDevTool(options: Options = {}): Middleware {
  if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect({
      shouldCatchErrors: true,
      ...options,
    });

    return function reduxDevToolConnector(
      action: Action<string, any>,
      next: Next,
      store: DirectorrInterface
    ) {
      next(action);

      if (!devTools.isInit) {
        devTools.subscribe(({ type, payload, state }: Action) => {
          if (type === DISPATCH_TYPE) {
            if (payload.type === JUMP_TO_STATE_TYPE || payload.type === JUMP_TO_ACTION_TYPE) {
              store.setStateToStore(JSON.parse(state));
            } else if (payload.type === RESET) {
              // need add reset method to directorr
              devTools.init({});
            } else if (payload.type === COMMIT) {
              devTools.init(store.getHydrateStoresState());
            } else if (payload.type === ROLLBACK) {
              store.setStateToStore(JSON.parse(state));
              devTools.init(store.getHydrateStoresState());
            } else if (payload.type === TOGGLE_ACTION) {
              devTools.send(null, calcNewActionsState(state, payload.id, store));
            } else if (payload.type === IMPORT_STATE) {
              const { nextLiftedState } = payload;
              const { computedStates } = nextLiftedState;
              store.setStateToStore(computedStates[computedStates.length - 1].state);
              devTools.send(null, nextLiftedState);
            }
          }
        });

        devTools.init(store.getHydrateStoresState());

        devTools.isInit = true;
      }

      devTools.send(action, store.getHydrateStoresState());
    };
  } else {
    return function noop(action: Action<string, any>, next: Next) {
      next(action);
    };
  }
}
