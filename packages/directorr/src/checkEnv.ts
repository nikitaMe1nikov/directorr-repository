import { errorWhenWrongEnv } from './messages';

if (typeof Symbol === 'undefined' || typeof Map === 'undefined') {
  throw new Error(errorWhenWrongEnv());
}
