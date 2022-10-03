import { ReactNode, ComponentType, PureComponent } from 'react'
import { connector } from '@nimel/directorr-react'
import { EMPTY_FUNC, EMPTY_STRING } from '@nimel/directorr'
import { Action, ACTION } from '@nimel/directorr-router'
import ComponentWrapper from './ComponentWrapper'
import {
  findRouteAndComponent,
  calcAnimationFromAction,
  EMPTY_REACT_COMPONENT,
  styleInjector,
} from './utils'
import RouterStore from './RouterStore'
import {
  Route,
  RouterTask,
  Animation,
  Persisted,
  RouterHandler,
  RouteRedirect,
  RouteComponent,
  PERSISTED,
} from './types'
import {
  ANIMATIONS,
  containerStyle,
  childStyle,
  hideStyle,
  disableInteractionStyle,
} from './constants'

export const MODULE_NAME = 'Router'

export type RouterProps = {
  routes: Route[]
  startAnimationDelay?: number
  className?: string
  animation?: Animation
  persisted?: Persisted
  disableAnimationWhenNotShowRoute?: boolean
  routerStore?: RouterStore
}

export interface RouterState {
  component: ComponentType
  redirect?: string
  route?: Route
  pathKey: string
  isShowComponent: boolean
  animation: Animation
  persisted: Persisted
  action?: Action
}

export class Router extends PureComponent<RouterProps> {
  static defaultProps = {
    animation: ANIMATIONS.NONE,
    persisted: PERSISTED.SMART,
    disableAnimationWhenNotShowRoute: true,
    startAnimationDelay: 0,
  }

  prevRouteState: RouterState

  nextRouteState: RouterState

  animationID: any

  routesMap: Map<string, ReactNode>

  promiseResolve: (arg: any) => void

  endRouteTransition: () => void = EMPTY_FUNC

  routerHandler: RouterHandler

  props: RouterProps

  constructor(props: RouterProps) {
    super(props)

    this.props = props
    this.routesMap = new Map()
    this.promiseResolve = resolve => (this.endRouteTransition = resolve)
    this.routerHandler = ({ path, action }: RouterTask) => {
      const {
        routes,
        startAnimationDelay,
        routerStore,
        animation = ANIMATIONS.NONE,
        persisted = PERSISTED.SMART,
      } = this.props
      const { component, route } = findRouteAndComponent(routes, path)

      if (!route || !component) {
        this.prevRouteState.isShowComponent = false
        this.nextRouteState.isShowComponent = false

        return
      }

      if ((route as RouteRedirect).redirect) {
        routerStore?.historyStore.push((route as RouteRedirect).redirect)

        return
      }

      if (route.path === this.prevRouteState.route?.path) {
        this.prevRouteState.isShowComponent = true

        return
      }

      this.nextRouteState = {
        component,
        route,
        animation: this.calcAnimation(
          this.prevRouteState.isShowComponent,
          this.nextRouteState.isShowComponent,
          action,
          this.prevRouteState.animation,
          route.animation || animation,
        ),
        persisted: (route as RouteComponent).persisted || persisted,
        pathKey: route.path,
        isShowComponent: false,
        action,
      }

      styleInjector(this.nextRouteState.animation)

      this.animationID = setTimeout(this.routeTransitionOne, startAnimationDelay)

      return new Promise(this.promiseResolve)
    }
    const {
      routes,
      animation = ANIMATIONS.NONE,
      persisted = PERSISTED.SMART,
      routerStore,
    } = this.props

    routerStore?.subscribe(this.routerHandler)

    const { component, route } = findRouteAndComponent(routes, routerStore?.path || '')

    if (!route || !component) {
      this.prevRouteState = {
        component: EMPTY_REACT_COMPONENT,
        pathKey: EMPTY_STRING,
        isShowComponent: false,
        animation: animation,
        persisted,
        action: routerStore?.action,
      }
      this.nextRouteState = this.prevRouteState

      return
    }

    if ((route as RouteRedirect).redirect) {
      this.prevRouteState = {
        component: EMPTY_REACT_COMPONENT,
        route,
        pathKey: route.path,
        isShowComponent: false,
        animation: route.animation || animation,
        persisted,
        action: routerStore?.action,
      }
      this.nextRouteState = this.prevRouteState

      routerStore?.historyStore.push((route as RouteRedirect).redirect)

      return
    }

    this.routesMap.set(
      route.path,
      <div key={route.path} style={childStyle}>
        <ComponentWrapper component={component} />
      </div>,
    )

    this.prevRouteState = {
      component,
      route,
      pathKey: route.path,
      isShowComponent: true,
      animation: route.animation || animation,
      persisted: (route as RouteComponent).persisted || persisted,
      action: routerStore?.action,
    }
    this.nextRouteState = this.prevRouteState

    styleInjector(this.prevRouteState.animation)
  }

  componentWillUnmount() {
    clearTimeout(this.animationID)
    this.props.routerStore?.unsubscribe(this.routerHandler)
  }

  calcAnimation(
    isShowPrevComponent: boolean,
    isShowNextComponent: boolean,
    action: Action,
    prevAnimation: Animation,
    nextAnimation: Animation,
  ) {
    if (
      this.props.disableAnimationWhenNotShowRoute &&
      !isShowPrevComponent &&
      !isShowNextComponent
    ) {
      return ANIMATIONS.NONE
    }

    return calcAnimationFromAction(action, prevAnimation, nextAnimation)
  }

  routeTransitionOne = () => {
    const { component: prevComponent, pathKey: prevPathKey } = this.prevRouteState
    const { animation } = this.nextRouteState

    this.routesMap.set(
      prevPathKey,
      <div
        key={prevPathKey}
        style={{
          ...childStyle,
          ...disableInteractionStyle,
          ...animation.prev,
        }}
        onAnimationEnd={this.routeTransitionTwo}
      >
        <ComponentWrapper component={prevComponent} />
      </div>,
    )

    this.forceUpdate()
  }

  routeTransitionTwo = () => {
    const { component: prevComponent, persisted, pathKey: prevPathKey } = this.prevRouteState
    const { action } = this.nextRouteState

    if (
      persisted === PERSISTED.NEVER ||
      (action !== ACTION.PUSH && persisted === PERSISTED.SMART)
    ) {
      this.routesMap.delete(prevPathKey)
    } else {
      this.routesMap.set(
        prevPathKey,
        <div key={prevPathKey} style={{ ...childStyle, ...hideStyle, ...disableInteractionStyle }}>
          <ComponentWrapper component={prevComponent} />
        </div>,
      )
    }

    const {
      component: nextComponent,
      pathKey: nextPathKey,
      animation: nextAnimation,
    } = this.nextRouteState

    this.routesMap.set(
      nextPathKey,
      <div
        key={nextPathKey}
        style={{ ...childStyle, ...disableInteractionStyle, ...nextAnimation.next }}
        onAnimationEnd={this.routeTransitionThree}
      >
        <ComponentWrapper component={nextComponent} />
      </div>,
    )

    this.forceUpdate()
  }

  routeTransitionThree = () => {
    const { component: nextComponent, pathKey: nextPathKey } = this.nextRouteState

    this.routesMap.set(
      nextPathKey,
      <div key={nextPathKey} style={childStyle}>
        <ComponentWrapper component={nextComponent} />
      </div>,
    )

    this.prevRouteState = this.nextRouteState

    this.prevRouteState.isShowComponent = true

    this.forceUpdate(this.endRouteTransition)
  }

  render() {
    return (
      <div style={containerStyle} className={this.props.className}>
        {[...this.routesMap.values()]}
      </div>
    )
  }
}

export default connector(RouterStore)(Router)
