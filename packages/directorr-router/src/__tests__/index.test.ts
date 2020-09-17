import { HistoryStore, ANY_PATH, generatePath, matchPath } from '../index';

describe('index', () => {
  it('check exports', () => {
    expect(HistoryStore).not.toBeUndefined();
    expect(ANY_PATH).not.toBeUndefined();
    expect(generatePath).not.toBeUndefined();
    expect(matchPath).not.toBeUndefined();
  });
});
