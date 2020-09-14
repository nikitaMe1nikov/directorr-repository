export function isContext(context: any) {
  return !!(context.Provider && context.Consumer);
}

export function isFunction(v: any): boolean {
  return !!(v && v.call && v.apply);
}

export function isDirrectorInstance(v: any): boolean {
  return !!(v && v.stores && v.addStoreDependency && v.removeStoreDependency);
}
