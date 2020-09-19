import { EMPTY_OBJECT } from '@nimel/directorr';

export interface Params {
  [key: string]: string | number;
}

const ROOT_URL = '/';
const SQUERE_LEFT = '[';
const SQUERE_RIGHT = ']';

export function reloadWindow() {
  window.location.reload();
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
          .filter(string => string)
          .join(ROOT_URL);
}
