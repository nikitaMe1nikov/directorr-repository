import { Directorr } from '@nimel/directorr'

export function isContext(context: any) {
  return !!(context.Provider && context.Consumer)
}

export function isFunction(v: any): boolean {
  return !!(v && v.call && v.apply)
}

export function isDirrectorInstance(v: any): v is Directorr {
  return !!(v && v.stores && v.addStoreDependency && v.removeStoreDependency)
}
