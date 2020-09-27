import { findRouteAndComponent, calcAnimationFromAction, styleInjector } from '../utils';
import { Action } from '@nimel/directorr-router';

describe('utils', () => {
  it('findRouteAndComponent', () => {
    const component = () => null;
    const path = '/path';
    const otherPath = '/otherPath';
    const routes = [
      { path, component },
      { path: '/somePath', component },
    ];

    expect(findRouteAndComponent(routes, path)).toEqual({ component, route: routes[0] });
    expect(findRouteAndComponent(routes, otherPath)).toEqual({});
  });

  it('calcAnimationFromAction', () => {
    const prevAnimation: any = {};
    const nextAnimation: any = {};

    expect(calcAnimationFromAction(Action.POP, prevAnimation, nextAnimation)).toEqual(
      prevAnimation
    );
    expect(calcAnimationFromAction(Action.PUSH, prevAnimation, nextAnimation)).toEqual(
      nextAnimation
    );
    expect(calcAnimationFromAction(Action.REPLACE, prevAnimation, nextAnimation)).toEqual(
      nextAnimation
    );
  });

  it('styleInjector', () => {
    const animation: any = {
      prevAnimation: {},
      nextAnimation: {},
      keyFrames: 'keyFrames',
    };
    const document = {
      createElement: jest.fn().mockReturnValue({ innerHTML: '' }),
      head: {
        appendChild: jest.fn(),
      },
    };
    Object.defineProperty(global, 'document', { value: document });

    styleInjector(animation);

    expect(document.createElement).toBeCalledTimes(1);
    expect(document.createElement).toBeCalledWith('style');
    expect(document.head.appendChild).toBeCalledTimes(1);
    expect(document.head.appendChild).toBeCalledWith({ innerHTML: animation.keyFrames });

    styleInjector(animation);

    // not add keyFrames in style
    expect(document.createElement).toBeCalledTimes(1);
    expect(document.head.appendChild).toBeCalledTimes(1);
  });
});
