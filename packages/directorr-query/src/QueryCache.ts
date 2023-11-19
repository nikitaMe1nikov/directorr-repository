import { UniqKey } from './types'

export type CacheValue = {
  value: unknown
  timestamp: number
  ttl: number
}

export const DEFAULT_TTL = 1000

export type QueryCacheOptions = {
  ttl?: number
}

export class QueryCache {
  ttl: number

  cache = new Map<string, CacheValue>()

  constructor({ ttl = DEFAULT_TTL }: QueryCacheOptions = {}) {
    this.ttl = ttl
  }

  has(cacheKey: UniqKey) {
    return this.isStale(cacheKey) ? false : this.cache.has(cacheKey)
  }

  set(cacheKey: UniqKey, value: any, ttl = this.ttl) {
    return this.cache.set(cacheKey, { value, timestamp: Date.now(), ttl })
  }

  get(cacheKey: UniqKey) {
    if (this.isStale(cacheKey)) {
      this.cache.delete(cacheKey)

      return
    }

    return this.cache.get(cacheKey)?.value
  }

  isStale(cacheKey: string) {
    if (this.cache.has(cacheKey)) {
      const cacheValue = this.cache.get(cacheKey)

      if (cacheValue && cacheValue.ttl && Date.now() - cacheValue.timestamp > cacheValue.ttl) {
        return true
      }
    }

    return false
  }
}
