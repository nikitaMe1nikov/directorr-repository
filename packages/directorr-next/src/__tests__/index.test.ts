import {
  nextWithDirectorr,
  NextHistoryStore,
  generatePath,
  ANY_PATH,
  convertBracketToColonParams,
  convertColonToBracketParams,
} from '../index';

describe('index', () => {
  it('check exports', () => {
    expect(nextWithDirectorr).not.toBeUndefined();
    expect(NextHistoryStore).not.toBeUndefined();
    expect(generatePath).not.toBeUndefined();
    expect(ANY_PATH).not.toBeUndefined();
    expect(convertBracketToColonParams).not.toBeUndefined();
    expect(convertColonToBracketParams).not.toBeUndefined();
  });
});
