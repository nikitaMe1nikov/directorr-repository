import { ComponentType } from 'react'
import { EMPTY_OBJECT } from '@nimel/directorr'
import { ACTION, Action, matchPath } from '@nimel/directorr-router'
import { Route, Animation, RouteComponent } from './types'

export const EMPTY_REACT_COMPONENT = () => null

export function findRouteAndComponent(
  routes: Route[],
  pathname: string,
): { component?: ComponentType; route?: Route } {
  for (
    let i = 0, l = routes.length, currentRoute: Route, match: ReturnType<typeof matchPath>;
    i < l;
    ++i
  ) {
    currentRoute = routes[i]
    match = matchPath(pathname, currentRoute.path)

    if (match) {
      return {
        component: (currentRoute as RouteComponent).component,
        route: currentRoute,
      }
    }
  }

  return EMPTY_OBJECT
}

export function calcAnimationFromAction(
  action: Action,
  prevAnimation: Animation,
  nextAnimation: Animation,
) {
  return action === ACTION.POP ? prevAnimation : nextAnimation
}

let styleElement: HTMLStyleElement
const injectedKeyframes: string[] = []

export function styleInjector(animation: Animation) {
  if (!styleElement) {
    styleElement = document.createElement('style')
    document.head.append(styleElement)
  }

  if (animation.keyFrames && !injectedKeyframes.includes(animation.keyFrames)) {
    styleElement.innerHTML = styleElement.innerHTML + animation.keyFrames
    injectedKeyframes.push(animation.keyFrames)
  }
}
