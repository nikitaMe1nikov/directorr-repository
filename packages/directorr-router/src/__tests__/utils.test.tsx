import { calcPath } from '../utils';

describe('utils', () => {
  it('calcPath', () => {
    const path = '/path';
    const queryObject = {
      propOne: 'one',
      propTwo: 'two',
    };

    expect(calcPath(path, queryObject)).toEqual(`${path}?propOne=one&propTwo=two`);
  });
});
