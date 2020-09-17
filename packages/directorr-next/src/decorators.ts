import {
  whenPayload,
  composePropertyDecorators,
  DecoratorValueTyped,
  SomeEffect,
} from '@nimel/directorr';
import { HistoryActionPayload, effectHistoryPop } from '@nimel/directorr-router';
import { HistoryChangeActionPayload } from './types';

export function returnTrue() {
  return true;
}

export function historyChange(
  urlPattern: string
): DecoratorValueTyped<SomeEffect<HistoryChangeActionPayload>> {
  return composePropertyDecorators([
    effectHistoryPop,
    whenPayload(returnTrue, (payload: HistoryActionPayload) => {
      const match = urlPattern === payload.pattern;

      if (match) {
        return {
          ...payload,
          match,
        };
      }

      return payload;
    }),
  ]);
}
