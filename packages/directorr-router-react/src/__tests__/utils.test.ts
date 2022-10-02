import { findRouteAndComponent, calcAnimationFromAction, styleInjector } from '../utils'
import { ACTION } from '@nimel/directorr-router'

describe('utils', () => {
  it('findRouteAndComponent', () => {
    const component = () => null
    const path = '/path'
    const otherPath = '/otherPath'
    const routes = [
      { path, component },
      { path: '/somePath', component },
    ]

    expect(findRouteAndComponent(routes, path)).toStrictEqual({ component, route: routes[0] })
    expect(findRouteAndComponent(routes, otherPath)).toStrictEqual({})
  })

  it('calcAnimationFromAction', () => {
    const prevAnimation: any = {}
    const nextAnimation: any = {}

    expect(calcAnimationFromAction(ACTION.POP, prevAnimation, nextAnimation)).toBe(prevAnimation)
    expect(calcAnimationFromAction(ACTION.PUSH, prevAnimation, nextAnimation)).toBe(nextAnimation)
    expect(calcAnimationFromAction(ACTION.REPLACE, prevAnimation, nextAnimation)).toBe(
      nextAnimation,
    )
  })

  it('styleInjector', () => {
    const animation: any = {
      prevAnimation: {},
      nextAnimation: {},
      keyFrames: 'keyFrames',
    }
    const document = {
      createElement: jest.fn().mockReturnValue({ innerHTML: '' }),
      head: {
        append: jest.fn(),
      },
    }
    Object.defineProperty(global, 'document', { value: document })

    styleInjector(animation)

    expect(document.createElement).toBeCalledTimes(1)
    expect(document.createElement).toBeCalledWith('style')
    expect(document.head.append).toBeCalledTimes(1)
    expect(document.head.append).toBeCalledWith({ innerHTML: animation.keyFrames })

    styleInjector(animation)

    // not add keyFrames in style
    expect(document.createElement).toBeCalledTimes(1)
    expect(document.head.append).toBeCalledTimes(1)
  })
})
