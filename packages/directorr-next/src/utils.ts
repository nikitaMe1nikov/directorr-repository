export interface Params {
  [key: string]: string | number;
}

const EMPTY_STRING = '';
const ROOT_MARK = '/';
const SQUERE_LEFT_MARK = '[';
const SQUERE_LEFT_RGXP = /\[/g;
const SQUERE_RIGHT_MARK = ']';
const SQUERE_RIGHT_RGXP = /\]/g;
const COLON_MARK = ':';

export function reloadWindow() {
  window.location.reload();
}

export function convertBracketToColonParams(pattern: string) {
  return pattern.replace(SQUERE_LEFT_RGXP, COLON_MARK).replace(SQUERE_RIGHT_RGXP, EMPTY_STRING);
}

function filterExist(segment: string) {
  return !!segment;
}

function addColon(segment: string) {
  if (segment.startsWith(COLON_MARK)) {
    return segment.replace(COLON_MARK, SQUERE_LEFT_MARK) + SQUERE_RIGHT_MARK;
  }

  return segment;
}

export function convertColonToBracketParams(pattern: string) {
  return pattern === ROOT_MARK
    ? pattern
    : ROOT_MARK + pattern.split(ROOT_MARK).filter(filterExist).map(addColon).join(ROOT_MARK);
}
