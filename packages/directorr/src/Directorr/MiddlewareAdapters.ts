import { Middleware as ReduxMiddleware, Dispatch, AnyAction, Store } from 'redux'
import {
  FindNextMiddleware,
  Middleware,
  DirectorrInterface,
  Action,
  Next,
  MiddlewareAdapterInterface,
  ReduxMiddlewareRunner,
} from '../types'

export class MiddlewareAdapter implements MiddlewareAdapterInterface {
  middleware: Middleware

  private directorr: DirectorrInterface

  next: Next

  constructor(
    middleware: Middleware,
    runNextMiddleware: FindNextMiddleware,
    index: number,
    directorr: DirectorrInterface,
  ) {
    this.middleware = middleware
    this.directorr = directorr
    this.next = action => runNextMiddleware(index, action)
  }

  run(action: Action) {
    void this.middleware(action, this.next, this.directorr)
  }
}

export class ReduxMiddlewareAdapter implements MiddlewareAdapterInterface {
  middleware: ReduxMiddlewareRunner

  next: Dispatch<AnyAction>

  constructor(
    middleware: ReduxMiddleware,
    runNextMiddleware: FindNextMiddleware,
    index: number,
    store: DirectorrInterface,
    reduxStore: Store,
  ) {
    // Keep for test
    this.next = action => runNextMiddleware(index, action)

    this.middleware = middleware(reduxStore)(this.next)
  }

  run(action: Action) {
    this.middleware(action)
  }
}
