import { pathToRegexp, Key, compile, PathFunction } from 'path-to-regexp';
import qs, { ParsedQuery } from 'query-string';
import { EMPTY_OBJECT, EMPTY_STRING } from '@nimel/directorr';
import { Params } from './types';

interface CompiledRegExp {
  reg: RegExp;
  keys: Key[];
}

export const ANY_PATH = '(.*)';
const ROOT_URL = '/';

export class Cache<K, V> {
  store = new Map<K, V>();
  cacheSize: number;

  constructor(cacheSize = 10000) {
    this.cacheSize = cacheSize;
  }

  set(key: K, value: V) {
    if (this.store.size > this.cacheSize) {
      this.store.delete(this.store.keys().next().value);
    }

    return this.store.set(key, value);
  }

  get(key: K) {
    return this.store.get(key);
  }

  has(key: K) {
    return this.store.has(key);
  }

  get size() {
    return this.store.size;
  }
}

const CACHE_PATTERNS = new Map<string, Cache<string, CompiledRegExp>>();
const CACHE_PATHS = new Cache<string, PathFunction>();

function compileRGXP(pattern: string, end: boolean, strict: boolean) {
  const cacheKey = EMPTY_STRING + end + strict;

  if (!CACHE_PATTERNS.has(cacheKey)) CACHE_PATTERNS.set(cacheKey, new Cache());

  const patternCache = CACHE_PATTERNS.get(cacheKey) as Cache<string, CompiledRegExp>;

  if (patternCache.has(pattern)) return patternCache.get(pattern) as CompiledRegExp;

  const keys: Key[] = [];
  const reg = pathToRegexp(pattern, keys, { end, strict });
  const compiledRGXP = { reg, keys };

  patternCache.set(pattern, compiledRGXP);

  return compiledRGXP;
}

export function matchPath(pathname: string, urlPattern: string, exact = true, strict = false) {
  const { reg, keys } = compileRGXP(urlPattern, exact, strict);

  const patterns = reg.exec(pathname);

  if (patterns) {
    return {
      patterns,
      keys,
    };
  }
}

export function calcParams(patterns: string[], keys: Key[]) {
  const params: Params = {};

  for (let i = 0, l = keys.length, name: string | number, value: string; i < l; ++i) {
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

function compilePath(path: string) {
  if (CACHE_PATHS.has(path)) return CACHE_PATHS.get(path) as PathFunction;

  const genPath = compile(path);

  CACHE_PATHS.set(path, genPath);

  return genPath;
}

export function generatePath(path = ROOT_URL, params = EMPTY_OBJECT) {
  return path === ROOT_URL ? path : compilePath(path)(params);
}

export function reloadWindow() {
  window.location.reload();
}
