import React, { CSSProperties, ReactNode } from 'react';
import { createConnector } from '@nimel/directorr-react';
import { Action } from '@nimel/directorr-router';
import ComponentWrapper from './ComponentWrapper';
import {
  findRouteAndComponent,
  setTitle,
  context,
  calcAnimationFromAction,
  PERSISTED,
  EMPTY_REACT_COMPONENT,
  styleInjector,
} from './utils';
import RouterStore from './RouterStore';
import {
  Route,
  RouterTask,
  RouteComponentType,
  Animation,
  Persisted,
  RouterHandler,
  RouteRedirect,
  RouteComponent,
} from './types';

const container: CSSProperties = {
  position: 'relative',
  height: '100%',
  width: '100%',
};

const child: CSSProperties = {
  position: 'absolute',
  height: '100%',
  width: '100%',
};

const hide: CSSProperties = {
  display: 'none',
};

const animation: CSSProperties = {
  animationDelay: '16ms',
  animationDuration: `${16 * 6}ms`,
  animationFillMode: 'both',
  animationTimingFunction: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
  willChange: 'opacity',
};

const animationNone: CSSProperties = {
  animationName: 'router_anim_none',
  animationDuration: '16ms',
  willChange: 'opacity',
};

const animationLeave: CSSProperties = {
  animationName: 'router_opacity_leave',
};

const animationEnter: CSSProperties = {
  animationName: 'router_opacity_enter',
};

const disableInteraction: CSSProperties = {
  pointerEvents: 'none',
  userSelect: 'none',
};

export const ANIMATIONS = {
  NONE: {
    prev: {
      ...disableInteraction,
      ...animationNone,
    },
    next: {
      ...disableInteraction,
      ...animationNone,
    },
    keyFrames: `
      @keyframes router_anim_none {
        100% {
          opacity: 1;
        }
      }
    `,
  },
  FADE: {
    prev: {
      ...disableInteraction,
      ...animation,
      ...animationLeave,
    },
    next: {
      ...disableInteraction,
      ...animation,
      ...animationEnter,
    },
    keyFrames: `
      @keyframes router_opacity_leave {
        0% {
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }

      @keyframes router_opacity_enter {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }
    `,
  },
};

interface RouterProps {
  routes: Route[];
  RouterStore: RouterStore;
  startAnimationDelay: number;
  className?: string;
  animation: Animation;
  persisted: Persisted;
  disableAnimationWhenNotShowRoute: boolean;
}

interface RouterState {
  component: RouteComponentType;
  redirect?: string;
  route: Route;
  pathKey: string;
  isShowComponent: boolean;
  animation: Animation;
  persisted: Persisted;
  action: Action;
}

export class Router extends React.PureComponent<RouterProps> {
  static defaultProps = {
    animation: ANIMATIONS.NONE,
    persisted: PERSISTED.SMART,
    disableAnimationWhenNotShowRoute: true,
    startAnimationDelay: 0,
  };

  routesMap: Map<string, ReactNode>;
  endRouteTransition: () => void;
  routerHandler: RouterHandler;
  promiseResolve: (r: any) => void;
  prevRouteState: RouterState;
  nextRouteState: RouterState;
  animationID: any;

  constructor(props: RouterProps) {
    super(props);

    const { routes, RouterStore, animation, persisted } = props;
    this.routesMap = new Map();
    this.promiseResolve = resolve => (this.endRouteTransition = resolve);

    this.routerHandler = ({ location, action }: RouterTask) => {
      const { routes, RouterStore, startAnimationDelay } = this.props;
      const { pathname } = location;

      const { component, route } = findRouteAndComponent(routes, pathname);

      if (!route) {
        this.prevRouteState.isShowComponent = false;
        this.nextRouteState.isShowComponent = false;
        return;
      }

      if (!component)
        throw new Error(
          `${this.constructor.name}: no necessary component for a path=${pathname} with routes=${routes}`
        );

      if (!(route as RouteRedirect).redirect && !component)
        throw new Error(
          `${this.constructor.name}: no necessary redirect for a path=${pathname} with routes=${routes}`
        );

      if ((route as RouteRedirect).redirect) {
        RouterStore.historyStore.push((route as RouteRedirect).redirect);
        return;
      }

      if (route.path === this.prevRouteState.route.path) {
        return;
      }

      if (component.TITLE) {
        setTitle(component.TITLE);
      }

      this.nextRouteState = {
        component,
        route,
        animation: this.calcAnimation(
          action,
          this.prevRouteState.animation,
          (route as RouteComponent).animation || animation
        ),
        persisted: (route as RouteComponent).persisted || persisted,
        pathKey: route.path,
        isShowComponent: false,
        action,
      };

      styleInjector(this.nextRouteState.animation);

      this.animationID = setTimeout(this.routeTransition1, startAnimationDelay);

      return new Promise(this.promiseResolve);
    };

    RouterStore.subscribe(this.routerHandler);

    if (!routes) throw new Error(`${this.constructor.name}: not set prop routes=${routes}`);

    const { action, path: pathname } = RouterStore.historyStore;
    const { component, route } = findRouteAndComponent(routes, pathname);

    if (!route) {
      return;
    }

    if (!component)
      throw new Error(
        `${this.constructor.name}: no necessary component for a path=${pathname} with routes=${routes}`
      );

    if (!(route as RouteRedirect).redirect && !component)
      throw new Error(
        `${this.constructor.name}: no necessary redirect for a path=${pathname} with routes=${routes}`
      );

    if ((route as RouteRedirect).redirect) {
      this.prevRouteState = {
        component: EMPTY_REACT_COMPONENT,
        route,
        pathKey: route.path,
        isShowComponent: false,
        animation: route.animation || animation,
        persisted,
        action,
      };

      RouterStore.historyStore.push((route as RouteRedirect).redirect);
      return;
    }

    if (component.TITLE) {
      setTitle(component.TITLE);
    }

    this.routesMap.set(
      route.path,
      <div key={route.path} style={child}>
        <ComponentWrapper component={component} />
      </div>
    );

    this.prevRouteState = {
      component,
      route,
      pathKey: route.path,
      isShowComponent: true,
      animation: route.animation || animation,
      persisted: (route as RouteComponent).persisted || persisted,
      action,
    };
    this.nextRouteState = this.prevRouteState;

    styleInjector(this.prevRouteState.animation);
  }

  componentWillUnmount() {
    clearTimeout(this.animationID);
    this.props.RouterStore.unsubscribe(this.routerHandler);
  }

  calcAnimation(action: Action, prevAnimation: Animation, nextAnimation: Animation) {
    if (
      this.props.disableAnimationWhenNotShowRoute &&
      !this.prevRouteState.isShowComponent &&
      !this.nextRouteState.isShowComponent
    ) {
      return ANIMATIONS.NONE;
    }

    return calcAnimationFromAction(action, prevAnimation, nextAnimation);
  }

  routeTransition1 = () => {
    const { component: prevComponent, pathKey: prevPathKey } = this.prevRouteState;
    const { animation } = this.nextRouteState;

    this.routesMap.set(
      prevPathKey,
      <div
        key={prevPathKey}
        style={{
          ...child,
          ...disableInteraction,
          ...animation.prev,
        }}
        onAnimationEnd={this.routeTransition2}
      >
        <ComponentWrapper component={prevComponent} />
      </div>
    );

    this.forceUpdate();
  };

  routeTransition2 = () => {
    const { component: prevComponent, persisted, pathKey: prevPathKey } = this.prevRouteState;
    const { action } = this.nextRouteState;

    if (
      persisted === PERSISTED.NEVER ||
      (action !== Action.PUSH && persisted === PERSISTED.SMART)
    ) {
      this.routesMap.delete(prevPathKey);
    } else {
      this.routesMap.set(
        prevPathKey,
        <div key={prevPathKey} style={{ ...child, ...hide, ...disableInteraction }}>
          <ComponentWrapper component={prevComponent} />
        </div>
      );
    }

    const {
      component: nextComponent,
      pathKey: nextPathKey,
      animation: nextAnimation,
    } = this.nextRouteState;

    this.routesMap.set(
      nextPathKey,
      <div
        key={nextPathKey}
        style={{ ...child, ...disableInteraction, ...nextAnimation.next }}
        onAnimationEnd={this.routeTransition3}
      >
        <ComponentWrapper component={nextComponent} />
      </div>
    );

    this.forceUpdate();
  };

  routeTransition3 = () => {
    const { component: nextComponent, pathKey: nextPathKey } = this.nextRouteState;

    if (nextComponent.TITLE) {
      setTitle(nextComponent.TITLE);
    }

    this.routesMap.set(
      nextPathKey,
      <div key={nextPathKey} style={child}>
        <ComponentWrapper component={nextComponent} />
      </div>
    );

    this.prevRouteState = this.nextRouteState;

    this.prevRouteState.isShowComponent = true;

    this.forceUpdate(this.endRouteTransition);
  };

  render() {
    return (
      <div style={container} className={this.props.className}>
        {Array.from(this.routesMap.values())}
      </div>
    );
  }
}

export default createConnector(context, RouterStore)(Router);
