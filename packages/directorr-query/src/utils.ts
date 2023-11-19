import { Key, UniqKey } from 'types'

export function delay<R, F extends () => R = () => R>(timeout: number, func?: F) {
  return new Promise<typeof func extends undefined ? undefined : R>(resolve =>
    setTimeout(() => resolve(func && (func() as any)), timeout),
  )
}

export function createUniqKey(key: Key): UniqKey {
  return JSON.stringify(key)
}
