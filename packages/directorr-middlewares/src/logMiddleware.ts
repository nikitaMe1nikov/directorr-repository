import { Action, Next } from '@nimel/directorr';

export default function logMiddleware(action: Action<string, any>, next: Next) {
  console.log(`log ${action.type} - `, action.payload?.call ? action.payload.name : action.payload);

  next(action);
}
