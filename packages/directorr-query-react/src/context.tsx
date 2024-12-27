import { QueryStore } from '@nimel/directorr-query'
import { createContext, FC, useContext } from 'react'
import { DirectorrContext, useLocalStore, useStore } from '@nimel/directorr-react'

export const QueryStoreContext = createContext<QueryStore | undefined>(undefined)

export type QueryStoreProviderProps = {
  value?: QueryStore
}

export const QueryStoreProvider: FC<QueryStoreProviderProps> = ({ children, value }) => {
  const currentStore = useContext(QueryStoreContext)

  if (currentStore && !value) return <>{children}</>

  const dir = useContext(DirectorrContext)

  const store = value || dir ? useStore(QueryStore) : useLocalStore(QueryStore)

  return <QueryStoreContext.Provider value={store}>{children}</QueryStoreContext.Provider>
}
