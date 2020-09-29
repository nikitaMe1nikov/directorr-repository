import { errorWhenWrongEnv } from './messages';

if (typeof Symbol === 'undefined') {
  throw new Error(errorWhenWrongEnv());
}
