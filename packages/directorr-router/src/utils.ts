import { pathToRegexp, Key } from 'path-to-regexp';
import qs, { ParsedQuery } from 'query-string';
import { Params } from './types';

interface CompiledRegExp {
  reg: RegExp;
  keys: Key[];
}

interface CompileCache {
  [key: string]: CompiledRegExp;
}

interface RegCache {
  [key: string]: CompileCache;
}

export const ANY_PATH = '(.*)';

export const EMPTY_STRING = '';
const ROOT_URL = '/';
const SQUERE_LEFT = '[';
const SQUERE_RIGHT = ']';
export const EMPTY_OBJECT = Object.freeze({});
const patternCache: RegCache = {};

function compilePath(pattern: string, end: boolean, strict: boolean) {
  const cacheKey = EMPTY_STRING + end + strict;
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  if (cache[pattern]) return cache[pattern];

  const keys: Key[] = [];

  return (cache[pattern] = { reg: pathToRegexp(pattern, keys, { end, strict }), keys });
}

export function matchPath(pathname: string, urlPattern: string, exact = true, strict = false) {
  const { reg, keys } = compilePath(urlPattern, exact, strict);

  const patterns = reg.exec(pathname);

  if (patterns && exact && patterns[0] !== pathname) return;

  if (patterns) {
    return {
      patterns,
      keys,
    };
  }
}

export function calcParams(patterns: string[], keys: Key[]) {
  const params: Params = {};

  for (let i = 0, l = keys.length, name, value; i < l; ++i) {
    name = keys[i].name;
    value = patterns[i + 1];

    if (name) {
      params[name] = value;
    }
  }

  return params;
}

export function calcPath(path: string, queryObject?: ParsedQuery) {
  return queryObject ? `${path}?${qs.stringify(queryObject)}` : path;
}

export function generatePath(path: string, params: Params = EMPTY_OBJECT): string {
  return path === ROOT_URL
    ? path
    : ROOT_URL +
        path
          .slice(1)
          .split(ROOT_URL)
          .map(segment => {
            if (segment.startsWith(SQUERE_LEFT) && segment.endsWith(SQUERE_RIGHT)) {
              return params[segment.slice(1, -1)];
            }

            return segment;
          })
          .join(ROOT_URL);
}
