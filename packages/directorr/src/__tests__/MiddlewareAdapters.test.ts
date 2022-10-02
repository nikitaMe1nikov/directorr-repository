import { MiddlewareAdapter, ReduxMiddlewareAdapter } from '../MiddlewareAdapters'
import { action } from '../__mocks__/mocks'

describe('MiddlewareAdapters', () => {
  it('MiddlewareAdapter', () => {
    const middleware = jest.fn()
    const runNextMiddleware = jest.fn()
    const index = 1
    const directorr = {} as any

    const obj = new MiddlewareAdapter(middleware, runNextMiddleware, index, directorr)

    obj.run(action)

    expect(middleware).toBeCalledTimes(1)
    expect(middleware).lastCalledWith(action, obj.next, directorr)

    obj.next(action)

    expect(runNextMiddleware).toBeCalledTimes(1)
    expect(runNextMiddleware).lastCalledWith(index, action)
  })

  it('ReduxMiddlewareAdapter', () => {
    const middlewareLogic = jest.fn()
    const middleware = (store: any) => (next: any) => (action: any) => {
      middlewareLogic(store, next, action)
    }
    const runNextMiddleware = jest.fn()
    const index = 1
    const directorr = {} as any
    const store = {} as any

    const obj = new ReduxMiddlewareAdapter(middleware, runNextMiddleware, index, directorr, store)

    obj.run(action)

    expect(middlewareLogic).toBeCalledTimes(1)
    expect(middlewareLogic).lastCalledWith(store, obj.next, action)

    obj.next(action)

    expect(runNextMiddleware).toBeCalledTimes(1)
    expect(runNextMiddleware).lastCalledWith(index, action)
  })
})
