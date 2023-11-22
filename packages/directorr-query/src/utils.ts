import { Key, UniqKey } from 'types'

export function createUniqKey(key: Key): UniqKey {
  return JSON.stringify(key)
}
