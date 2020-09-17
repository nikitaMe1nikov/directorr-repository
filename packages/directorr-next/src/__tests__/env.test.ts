import { isServer } from '../env';

describe('env', () => {
  it('isServer', () => {
    expect(isServer).toBeTruthy();
  });
});
