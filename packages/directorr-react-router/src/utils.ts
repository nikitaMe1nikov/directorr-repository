import { createContext } from 'react';
import { Directorr } from '@nimel/directorr';
import { Action, matchPath } from '@nimel/directorr-router';
import { Route, Animation, RouteComponentType, RouteComponent } from './types';

export const PERSISTED = {
  SMART: 'SMART',
  ALWAYS: 'ALWAYS',
  NEVER: 'NEVER',
};

export const EMPTY_OBJECT = Object.freeze({});
export const EMPTY_REACT_COMPONENT = () => null;

export const context = createContext<Directorr>((null as unknown) as Directorr);
export const { Provider: RouterProvider } = context;

export function setTitle(title: string) {
  document.title = title;
}

export function findRouteAndComponent(
  routes: Route[],
  pathname: string
): { component?: RouteComponentType; route?: Route } {
  for (let i = 0, l = routes.length, currentRoute, match; i < l; ++i) {
    currentRoute = routes[i];
    match = matchPath(pathname, currentRoute.path);

    if (match) {
      return {
        component: (currentRoute as RouteComponent).component,
        route: currentRoute,
      };
    }
  }

  return EMPTY_OBJECT;
}

export function calcAnimationFromAction(
  action: Action,
  prevAnimation: Animation,
  nextAnimation: Animation
) {
  switch (action) {
    case Action.POP:
      return prevAnimation;
    case Action.PUSH:
    case Action.REPLACE:
      return nextAnimation;
    default:
      return nextAnimation;
  }
}

let styleElement: HTMLStyleElement;
const injectedKeyframes: string[] = [];

export function styleInjector(animation: Animation) {
  if (!styleElement) {
    styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
  }

  if (animation.keyFrames && injectedKeyframes.indexOf(animation.keyFrames) === -1) {
    styleElement.innerHTML = styleElement.innerHTML + animation.keyFrames;
    injectedKeyframes.push(animation.keyFrames);
  }
}
