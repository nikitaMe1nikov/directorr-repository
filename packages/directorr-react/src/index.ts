import { createContext } from 'react'
import { Directorr } from '@nimel/directorr'
import createConnector from './createConnector'
import createUseStoreHooks from './createUseStoreHooks'

const DirectorrContext = createContext<Directorr>(null as unknown as Directorr)
const DirectorrProvider = DirectorrContext.Provider
const useStore = createUseStoreHooks(DirectorrContext)
const connector = createConnector(useStore)

export { DirectorrContext, DirectorrProvider, useStore, connector }

export { default as useLocalStore } from './useLocalStore'
export { default as createConnector } from './createConnector'
export { default as createUseStoreHooks } from './createUseStoreHooks'
