import {
  Cache,
  calcPath,
  generatePath,
  calcParams,
  matchPath,
  ANY_PATH,
  reloadWindow,
} from '../utils';

describe('utils', () => {
  it('Cache', () => {
    const cache = new Cache(1);
    const keyOne = 'keyOne';
    const valueOne = {};
    const keyTwo = 'keyTwo';
    const valueTwo = {};
    const keyThree = 'keyThree';
    const valueThree = {};

    expect(cache.size).toEqual(0);

    cache.set(keyOne, valueOne);

    expect(cache.size).toEqual(1);
    expect(cache.has(keyOne)).toBeTruthy();
    expect(cache.get(keyOne)).toEqual(valueOne);

    cache.set(keyTwo, valueTwo);

    expect(cache.size).toEqual(2);
    expect(cache.has(keyOne)).toBeTruthy();
    expect(cache.has(keyTwo)).toBeTruthy();
    expect(cache.get(keyTwo)).toEqual(valueTwo);

    cache.set(keyThree, valueThree);

    expect(cache.has(keyOne)).toBeFalsy();
    expect(cache.has(keyTwo)).toBeTruthy();
    expect(cache.has(keyThree)).toBeTruthy();
    expect(cache.get(keyThree)).toEqual(valueThree);
  });

  it('matchPath', () => {
    const pathname = '/pathname';
    const urlPatternSame = pathname;
    const urlPatternSameInner = `${pathname}/some`;
    const urlPatternOther = '/other';
    const id = '12';
    const pathnameWithId = `${pathname}/${id}`;
    const urlPatternSameWith = `${pathname}/:id`;

    expect(matchPath(pathname, urlPatternOther)).toBeUndefined();

    expect(matchPath(urlPatternSameInner, `${pathname}/${ANY_PATH}`)?.patterns[0]).toEqual(
      urlPatternSameInner
    );
    expect(matchPath(urlPatternSameInner, `${pathname}/${ANY_PATH}`)?.keys).toEqual([
      {
        modifier: '',
        name: 0,
        pattern: '.*',
        prefix: '/',
        suffix: '',
      },
    ]);

    expect(matchPath(pathname, urlPatternSame)?.patterns[0]).toEqual(pathname);
    expect(matchPath(pathname, urlPatternSame)?.keys).toEqual([]);

    expect(matchPath(pathnameWithId, urlPatternSameWith)?.patterns[0]).toEqual(pathnameWithId);
    expect(matchPath(pathnameWithId, urlPatternSameWith)?.keys).toEqual([
      {
        modifier: '',
        name: 'id',
        pattern: '[^\\/#\\?]+?',
        prefix: '/',
        suffix: '',
      },
    ]);
  });

  it('calcParams', () => {
    const someValue = 'someValue';
    const name = 'name';
    const patterns = ['', someValue];
    const keys: any = [{ name }, {}];

    expect(calcParams(patterns, keys)).toEqual({
      [name]: someValue,
    });
  });

  it('calcPath', () => {
    const path = '/path';
    const queryObject = {
      propOne: 'one',
      propTwo: 'two',
    };

    expect(calcPath(path)).toEqual(path);
    expect(calcPath(path, queryObject)).toEqual(`${path}?propOne=one&propTwo=two`);
  });

  it('generatePath', () => {
    const root = '/';
    const idParam = ':id';
    const path = '/path';
    const params = {
      id: '12',
    };

    expect(generatePath(root)).toEqual(root);
    expect(generatePath()).toEqual(root);
    expect(generatePath(`${path}/${idParam}`, params)).toEqual(`${path}/${params.id}`);
    expect(generatePath(`${path}/${idParam}`, params)).toEqual(`${path}/${params.id}`);
  });

  it('reloadWindow', () => {
    const reload = jest.fn();

    Object.defineProperty(global, 'window', {
      value: {
        location: {
          reload,
        },
      },
    });

    reloadWindow();

    expect(window.location.reload).toBeCalledTimes(1);
  });
});
