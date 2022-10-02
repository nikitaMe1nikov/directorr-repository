/**
 * @jest-environment jsdom
 */
import { createMemoryHistory } from 'history'
import Router from '../Router'
import RouterStore from '../RouterStore'
import ComponentWrapper from '../ComponentWrapper'
import { PERSISTED } from '../types'
import { styleInjector } from '../utils'
import {
  ANIMATIONS,
  containerStyle,
  childStyle,
  hideStyle,
  disableInteractionStyle,
} from '../constants'
import { createDirectorr, mountWithDirectorr } from '../__mocks__/utils'
import { flushTimeouts } from '../../../../tests/utils'

jest.mock('../utils', () => {
  const originalModule = jest.requireActual('../utils')

  return {
    ...originalModule,
    styleInjector: jest.fn(),
  }
})

describe('Router', () => {
  it('render with empty routes', () => {
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const routesEmpty: any[] = []

    const wrapper = mountWithDirectorr(<Router routes={routesEmpty} />, directorr)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(0)
  })

  it('render with className', () => {
    const className = 'className'
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const routesEmpty: any[] = []

    const wrapper = mountWithDirectorr(
      <Router className={className} routes={routesEmpty} />,
      directorr,
    )

    expect(wrapper.children().prop(className)).toBe(className)
    expect(wrapper.children().prop('style')).toStrictEqual(containerStyle)
  })

  it('render with routes', () => {
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const OneComponent = () => null
    const TwoComponent = () => null
    const routes = [
      {
        path: '/',
        component: OneComponent,
      },
      {
        path: '/path',
        component: TwoComponent,
      },
    ]

    const wrapper = mountWithDirectorr(<Router routes={routes} />, directorr)
    const routerStore = directorr.addStore(RouterStore)
    jest.spyOn(routerStore, 'unsubscribe')
    jest.spyOn(global, 'clearTimeout')

    expect(styleInjector).lastCalledWith(ANIMATIONS.NONE)
    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)

    wrapper.unmount()

    expect(clearTimeout).toBeCalledTimes(1)
    expect(routerStore.unsubscribe).lastCalledWith((wrapper.instance() as any).routerHandler)
  })

  it('render with routes without current path', () => {
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const OneComponent = () => null
    const TwoComponent = () => null
    const routes = [
      {
        path: '/path',
        component: OneComponent,
      },
      {
        path: '/anotherpath',
        component: TwoComponent,
      },
    ]

    const wrapper = mountWithDirectorr(<Router routes={routes} />, directorr)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(0)
  })

  it('not switch component with empty routes', async () => {
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const routesEmpty: any[] = []

    const wrapper = mountWithDirectorr(<Router routes={routesEmpty} />, directorr)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(0)

    history.push('/path')

    await flushTimeouts()

    expect(wrapper.find(ComponentWrapper)).toHaveLength(0)
  })

  it('switch component when change history with persisted = NEVER', async () => {
    const persisted = PERSISTED.NEVER
    const animation = ANIMATIONS.FADE
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const OneComponent = () => null
    const TwoComponent = () => null
    const routes = [
      {
        path: '/',
        component: OneComponent,
      },
      {
        path: '/path',
        component: TwoComponent,
      },
    ]

    let wrapper = mountWithDirectorr(
      <Router persisted={persisted} animation={animation} routes={routes} />,
      directorr,
    )

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)

    history.push(routes[1].path)

    await flushTimeouts()

    expect(styleInjector).lastCalledWith(animation)

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.prev,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.next,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual(childStyle)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(0)
    expect(wrapper.find(TwoComponent)).toHaveLength(1)
  })

  it('switch component when change history with persisted = SMART', async () => {
    const persisted = PERSISTED.SMART
    const animation = ANIMATIONS.FADE
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const OneComponent = () => null
    const TwoComponent = () => null
    const routes = [
      {
        path: '/',
        component: OneComponent,
      },
      {
        path: '/path',
        component: TwoComponent,
      },
    ]

    let wrapper = mountWithDirectorr(
      <Router persisted={persisted} animation={animation} routes={routes} />,
      directorr,
    )

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)

    history.push(routes[1].path)

    await flushTimeouts()

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.prev,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children()

    expect(wrapper.childAt(0).prop('style')).toStrictEqual({
      ...childStyle,
      ...hideStyle,
      ...disableInteractionStyle,
    })
    expect(wrapper.childAt(1).prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.next,
    })

    wrapper.childAt(1).simulate('animationEnd')

    wrapper = wrapper.update().children().children()

    expect(wrapper.childAt(0).prop('style')).toStrictEqual({
      ...childStyle,
      ...hideStyle,
      ...disableInteractionStyle,
    })
    expect(wrapper.childAt(1).prop('style')).toStrictEqual(childStyle)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(2)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(1)

    // wait RouterStore logic
    await flushTimeouts()

    // go back
    history.back()

    await flushTimeouts()

    wrapper = wrapper.update().children().children()

    expect(wrapper.childAt(1).prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.prev,
    })

    wrapper.childAt(1).simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.next,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual(childStyle)
    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)
  })

  it('switch component when change history with persisted = ALWAYS', async () => {
    const persisted = PERSISTED.ALWAYS
    const animation = ANIMATIONS.FADE
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const OneComponent = () => null
    const TwoComponent = () => null
    const routes = [
      {
        path: '/',
        component: OneComponent,
      },
      {
        path: '/path',
        component: TwoComponent,
      },
    ]

    let wrapper = mountWithDirectorr(
      <Router persisted={persisted} animation={animation} routes={routes} />,
      directorr,
    )

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)

    history.push(routes[1].path)

    await flushTimeouts()

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.prev,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children()

    expect(wrapper.childAt(0).prop('style')).toStrictEqual({
      ...childStyle,
      ...hideStyle,
      ...disableInteractionStyle,
    })
    expect(wrapper.childAt(1).prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.next,
    })

    wrapper.childAt(1).simulate('animationEnd')

    wrapper = wrapper.update().children().children()

    expect(wrapper.childAt(0).prop('style')).toStrictEqual({
      ...childStyle,
      ...hideStyle,
      ...disableInteractionStyle,
    })
    expect(wrapper.childAt(1).prop('style')).toStrictEqual(childStyle)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(2)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(1)
  })

  it('should overwritten animation and persisted per route when push - back', async () => {
    const persisted = PERSISTED.ALWAYS
    const animation = ANIMATIONS.FADE
    const persistedRoute = PERSISTED.NEVER
    const animationRoute = ANIMATIONS.NONE
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const OneComponent = () => null
    const TwoComponent = () => null
    const routes = [
      {
        path: '/',
        component: OneComponent,
      },
      {
        path: '/path',
        component: TwoComponent,
        persisted: persistedRoute,
        animation: animationRoute,
      },
    ]

    let wrapper = mountWithDirectorr(
      <Router persisted={persisted} animation={animation} routes={routes} />,
      directorr,
    )

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)

    history.push(routes[1].path)

    await flushTimeouts()

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animationRoute.prev,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children()

    expect(wrapper.childAt(0).prop('style')).toStrictEqual({
      ...childStyle,
      ...hideStyle,
      ...disableInteractionStyle,
    })
    expect(wrapper.childAt(1).prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animationRoute.next,
    })

    wrapper.childAt(1).simulate('animationEnd')

    wrapper = wrapper.update().children().children()

    expect(wrapper.childAt(0).prop('style')).toStrictEqual({
      ...childStyle,
      ...hideStyle,
      ...disableInteractionStyle,
    })
    expect(wrapper.childAt(1).prop('style')).toStrictEqual(childStyle)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(2)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(1)

    // wait RouterStore logic
    await flushTimeouts()

    // go back
    history.back()

    await flushTimeouts()

    wrapper = wrapper.update().children().children()

    expect(wrapper.childAt(1).prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animationRoute.prev,
    })

    wrapper.childAt(1).simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animationRoute.next,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual(childStyle)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)
  })

  it('should overwritten animation and persisted per route when push - push', async () => {
    const persisted = PERSISTED.ALWAYS
    const animation = ANIMATIONS.FADE
    const persistedRoute = PERSISTED.NEVER
    const animationRoute = ANIMATIONS.NONE
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const OneComponent = () => null
    const TwoComponent = () => null
    const routes = [
      {
        path: '/',
        component: OneComponent,
      },
      {
        path: '/path',
        component: TwoComponent,
        persisted: persistedRoute,
        animation: animationRoute,
      },
    ]

    let wrapper = mountWithDirectorr(
      <Router persisted={persisted} animation={animation} routes={routes} />,
      directorr,
    )

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)

    history.push(routes[1].path)

    await flushTimeouts()

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animationRoute.prev,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children()

    expect(wrapper.childAt(0).prop('style')).toStrictEqual({
      ...childStyle,
      ...hideStyle,
      ...disableInteractionStyle,
    })
    expect(wrapper.childAt(1).prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animationRoute.next,
    })

    wrapper.childAt(1).simulate('animationEnd')

    wrapper = wrapper.update().children().children()

    expect(wrapper.childAt(0).prop('style')).toStrictEqual({
      ...childStyle,
      ...hideStyle,
      ...disableInteractionStyle,
    })
    expect(wrapper.childAt(1).prop('style')).toStrictEqual(childStyle)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(2)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(1)

    // wait RouterStore logic
    await flushTimeouts()

    // go back
    history.push(routes[0].path)

    await flushTimeouts()

    wrapper = wrapper.update().children().children()

    expect(wrapper.childAt(1).prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.prev,
    })

    wrapper.childAt(1).simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.next,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual(childStyle)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)
  })

  it('render with routes redirect', async () => {
    const persisted = PERSISTED.NEVER
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const OneComponent = () => null
    const TwoComponent = () => null
    const routes = [
      {
        path: '/',
        component: OneComponent,
        redirect: '/path',
      },
      {
        path: '/path',
        component: TwoComponent,
      },
    ]

    let wrapper = mountWithDirectorr(<Router persisted={persisted} routes={routes} />, directorr)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(0)

    await flushTimeouts()

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...ANIMATIONS.NONE.prev,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...ANIMATIONS.NONE.next,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual(childStyle)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(0)
    expect(wrapper.find(TwoComponent)).toHaveLength(1)
  })

  it('not switch component when history push to redirect route', async () => {
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const OneComponent = () => null
    const TwoComponent = () => null
    const routes = [
      {
        path: '/',
        component: OneComponent,
      },
      {
        path: '/path',
        component: TwoComponent,
        redirect: '/',
      },
    ]

    let wrapper = mountWithDirectorr(<Router routes={routes} />, directorr)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)

    history.push(routes[1].path)

    await flushTimeouts()

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual(childStyle)
    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)
  })

  it('switch component when history push to redirect route', async () => {
    const persisted = PERSISTED.NEVER
    const animation = ANIMATIONS.NONE
    const history = createMemoryHistory()
    const directorr = createDirectorr(history)
    const OneComponent = () => null
    const TwoComponent = () => null
    const ThreeComponent = () => null
    const routes = [
      {
        path: '/',
        component: OneComponent,
      },
      {
        path: '/path',
        component: TwoComponent,
        redirect: '/anotherpath',
      },
      {
        path: '/anotherpath',
        component: ThreeComponent,
      },
    ]

    let wrapper = mountWithDirectorr(
      <Router persisted={persisted} animation={animation} routes={routes} />,
      directorr,
    )

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(1)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)
    expect(wrapper.find(ThreeComponent)).toHaveLength(0)

    history.push(routes[1].path)

    await flushTimeouts()

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.prev,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual({
      ...childStyle,
      ...disableInteractionStyle,
      ...animation.next,
    })

    wrapper.simulate('animationEnd')

    wrapper = wrapper.update().children().children().children()

    expect(wrapper.prop('style')).toStrictEqual(childStyle)

    expect(wrapper.find(ComponentWrapper)).toHaveLength(1)
    expect(wrapper.find(OneComponent)).toHaveLength(0)
    expect(wrapper.find(TwoComponent)).toHaveLength(0)
    expect(wrapper.find(ThreeComponent)).toHaveLength(1)
  })
})
