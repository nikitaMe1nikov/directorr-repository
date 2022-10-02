import { errorWhenWrongEnv } from './messages'

if (typeof Symbol === 'undefined') {
  throw new TypeError(errorWhenWrongEnv())
}
