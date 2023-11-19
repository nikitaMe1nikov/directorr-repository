import { createActionAndEffect } from '@nimel/directorr'
import { QueryPayload, QueryPayloadError, QueryPayloadSuccess } from './types'

export const [
  actionQuery,
  effectQuery,
  actionQuerySuccess,
  effectQuerySuccess,
  actionQueryError,
  effectQueryError,
  actionQueryLoading,
  effectQueryLoading,
] = createActionAndEffect<QueryPayload, QueryPayloadSuccess, QueryPayloadError, QueryPayload>(
  'QUERY',
)
