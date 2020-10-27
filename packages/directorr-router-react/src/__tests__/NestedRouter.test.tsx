/**
 * @jest-environment jsdom
 */
import React from 'react';
import { ANY_PATH } from '@nimel/directorr-router';
import { createMemoryHistory } from 'history';
import Router from '../Router';
import ComponentWrapper from '../ComponentWrapper';
import { PERSISTED } from '../types';
import { ANIMATIONS, childStyle, disableInteractionStyle } from '../constants';
import { createDirectorr, mountWithDirectorr } from '../__mocks__/utils';
import { flushTimeouts } from '../../../../tests/utils';

describe('nested Routers', () => {
  it('switch component when history push and back', async () => {
    const persisted = PERSISTED.NEVER;
    const animation = ANIMATIONS.NONE;
    const history = createMemoryHistory();
    const directorr = createDirectorr(history);
    const ThreeComponent = () => null;
    const FourComponent = () => null;
    const nestedRoutes = [
      {
        path: '/path',
        component: ThreeComponent,
      },
      {
        path: '/path/somepath',
        component: FourComponent,
      },
    ];
    const OneComponent = () => null;
    const TwoComponent = () => (
      <Router persisted={persisted} animation={animation} routes={nestedRoutes} />
    );
    const routes = [
      {
        path: '/',
        component: OneComponent,
      },
      {
        path: `/path${ANY_PATH}`,
        component: TwoComponent,
      },
    ];

    let wrapper = mountWithDirectorr(
      <Router persisted={persisted} animation={animation} routes={routes} />,
      directorr
    );

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1);
    expect(wrapper.find(OneComponent)).toHaveLength(1);
    expect(wrapper.find(TwoComponent)).toHaveLength(0);
    expect(wrapper.find(ThreeComponent)).toHaveLength(0);
    expect(wrapper.find(FourComponent)).toHaveLength(0);

    history.push(nestedRoutes[0].path);

    await flushTimeouts();

    wrapper = wrapper.update().children().children().children();

    wrapper.simulate('animationEnd');

    wrapper = wrapper.update().children().children().children();

    wrapper.simulate('animationEnd');

    wrapper = wrapper.update();

    expect(wrapper.find(ComponentWrapper)).toHaveLength(2);
    expect(wrapper.find(OneComponent)).toHaveLength(0);
    expect(wrapper.find(TwoComponent)).toHaveLength(1);
    expect(wrapper.find(ThreeComponent)).toHaveLength(1);

    // wait RouterStore logic
    await flushTimeouts();

    // go back
    history.back();

    await flushTimeouts();

    wrapper = wrapper.update().children().children().children();

    wrapper.simulate('animationEnd');

    wrapper = wrapper.update().children().children().children();

    wrapper.simulate('animationEnd');

    wrapper = wrapper.update();

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1);
    expect(wrapper.find(OneComponent)).toHaveLength(1);
    expect(wrapper.find(TwoComponent)).toHaveLength(0);
    expect(wrapper.find(ThreeComponent)).toHaveLength(0);
    expect(wrapper.find(FourComponent)).toHaveLength(0);
  });

  it('animation = NONE for all Routers which do not match the path', async () => {
    const persisted = PERSISTED.ALWAYS;
    const animation = ANIMATIONS.FADE;
    const history = createMemoryHistory();
    const directorr = createDirectorr(history);
    const ThreeComponent = () => null;
    const FourComponent = () => null;
    const nestedRoutes = [
      {
        path: '/path',
        component: ThreeComponent,
      },
      {
        path: '/path/somepath',
        component: FourComponent,
      },
    ];
    const OneComponent = () => null;
    const TwoComponent = () => (
      <Router persisted={persisted} animation={animation} routes={nestedRoutes} />
    );
    const routes = [
      {
        path: '/',
        component: OneComponent,
      },
      {
        path: `/path${ANY_PATH}`,
        component: TwoComponent,
      },
    ];

    let wrapper = mountWithDirectorr(
      <Router persisted={persisted} animation={animation} routes={routes} />,
      directorr
    );

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1);
    expect(wrapper.find(OneComponent)).toHaveLength(1);
    expect(wrapper.find(TwoComponent)).toHaveLength(0);
    expect(wrapper.find(ThreeComponent)).toHaveLength(0);
    expect(wrapper.find(FourComponent)).toHaveLength(0);

    history.push(nestedRoutes[1].path);

    await flushTimeouts();

    wrapper = wrapper.update().children().children().children();

    wrapper.simulate('animationEnd');

    wrapper = wrapper.update().children().children().childAt(1);

    wrapper.simulate('animationEnd');

    wrapper = wrapper.update();

    expect(wrapper.find(ComponentWrapper)).toHaveLength(3);
    expect(wrapper.find(OneComponent)).toHaveLength(1);
    expect(wrapper.find(TwoComponent)).toHaveLength(1);
    expect(wrapper.find(ThreeComponent)).toHaveLength(0);
    expect(wrapper.find(FourComponent)).toHaveLength(1);

    // wait RouterStore logic
    await flushTimeouts();

    // go back
    history.back();

    await flushTimeouts();

    wrapper = wrapper.update().children().children().childAt(1);

    expect(wrapper.prop('style')).toEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.prev,
    });

    wrapper.simulate('animationEnd');

    wrapper = wrapper.update().children().children().childAt(0);

    expect(wrapper.prop('style')).toEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.next,
    });

    wrapper.simulate('animationEnd');

    wrapper = wrapper.update();

    expect(wrapper.find(ComponentWrapper)).toHaveLength(3);
    expect(wrapper.find(OneComponent)).toHaveLength(1);
    expect(wrapper.find(TwoComponent)).toHaveLength(1);
    expect(wrapper.find(ThreeComponent)).toHaveLength(0);
    expect(wrapper.find(FourComponent)).toHaveLength(1);

    // wait RouterStore logic
    await flushTimeouts();

    history.push(nestedRoutes[0].path);

    await flushTimeouts();

    wrapper = wrapper.update().children().children().childAt(0);

    expect(wrapper.prop('style')).toEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.prev,
    });

    wrapper.simulate('animationEnd');

    wrapper = wrapper.update().children().children().childAt(1);

    expect(wrapper.prop('style')).toEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.next,
    });

    wrapper.simulate('animationEnd');

    wrapper = wrapper.update();

    expect(wrapper.find(ComponentWrapper)).toHaveLength(3);
    expect(wrapper.find(OneComponent)).toHaveLength(1);
    expect(wrapper.find(TwoComponent)).toHaveLength(1);
    expect(wrapper.find(ThreeComponent)).toHaveLength(0);
    expect(wrapper.find(FourComponent)).toHaveLength(1);

    // simulate for inner router
    let innerWrapper = wrapper.update().find(Router).at(1).children().children().childAt(0);

    expect(innerWrapper.prop('style')).toEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...ANIMATIONS.NONE.prev,
    });

    innerWrapper.simulate('animationEnd');

    innerWrapper = wrapper.update().find(Router).at(1).children().children().childAt(1);

    expect(innerWrapper.prop('style')).toEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...ANIMATIONS.NONE.next,
    });

    innerWrapper.simulate('animationEnd');

    wrapper = wrapper.update();

    expect(wrapper.find(ComponentWrapper)).toHaveLength(4);
    expect(wrapper.find(OneComponent)).toHaveLength(1);
    expect(wrapper.find(TwoComponent)).toHaveLength(1);
    expect(wrapper.find(ThreeComponent)).toHaveLength(1);
    expect(wrapper.find(FourComponent)).toHaveLength(1);
  });
});
