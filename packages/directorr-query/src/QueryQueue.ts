import { UniqKey } from './types'

export class QueryQueue {
  queryPending = new Set<UniqKey>()

  has(uniqKey: UniqKey) {
    return this.queryPending.has(uniqKey)
  }

  setPending(uniqKey: UniqKey) {
    return this.queryPending.add(uniqKey)
  }

  removePending(uniqKey: UniqKey) {
    return this.queryPending.delete(uniqKey)
  }
}
