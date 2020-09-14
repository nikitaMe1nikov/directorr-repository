import {
  whenPayload,
  CreateDecoratorOneArg,
  composePropertyDecorators,
  DecoratorValueTyped,
  SomeEffect,
} from '@nimel/directorr';
import { HistoryActionPayload, effectHistoryPop } from '@nimel/directorr-router';
import { HistoryChangeActionPayload } from './types';

function returnTrue() {
  return true;
}

export const historyChange: CreateDecoratorOneArg<
  string,
  DecoratorValueTyped<SomeEffect<HistoryChangeActionPayload>>
> = (urlPattern: string) =>
  composePropertyDecorators([
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
