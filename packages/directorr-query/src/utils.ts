import { QueryPayload, UniqKey } from './types'
// import packageMeta from '../package.json'

export function createUniqKey(
  query: QueryPayload['query'],
  variables: QueryPayload['variables'],
): UniqKey {
  return JSON.stringify([query.name, variables])
}

export function createMessage(moduleName: string, message: string) {
  return `@nimel/directorr-query: ${moduleName}: ${message}`
}
