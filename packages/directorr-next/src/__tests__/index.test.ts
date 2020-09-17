import {
  nextWithDirectorr,
  NextHistoryStore,
  ROUTER_STORE_ACTIONS,
  HISTORY_ACTIONS,
  generatePath,
  ANY_PATH,
} from '../index';

describe('index', () => {
  it('check exports', () => {
    expect(nextWithDirectorr).not.toBeUndefined();
    expect(NextHistoryStore).not.toBeUndefined();
    expect(ROUTER_STORE_ACTIONS).not.toBeUndefined();
    expect(HISTORY_ACTIONS).not.toBeUndefined();
    expect(generatePath).not.toBeUndefined();
    expect(ANY_PATH).not.toBeUndefined();
  });
});
