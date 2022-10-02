import { callWithWrongSchema } from './messages'

export const DEFAULT_VALIDATE_OPTIONS = {
  abortEarly: false,
  strict: true,
  payloadProp: 'connectStoreProperty',
}

export function isLikeYUPSchema(schema: any) {
  return !!schema.fields
}

export default function createSchemaContext(moduleName: string, schema: any, options = {}) {
  if (!isLikeYUPSchema(schema)) throw new TypeError(callWithWrongSchema(moduleName, schema))

  return [schema, { ...DEFAULT_VALIDATE_OPTIONS, ...options }, Object.keys(schema.fields)]
}
