import { Action, Next, isFunction } from '@nimel/directorr';

export default function logMiddleware(action: Action<string, any>, next: Next) {
  console.log(
    `log ${action.type} - `,
    isFunction(action.payload) ? action.payload.name : action.payload
  );

  next(action);
}
