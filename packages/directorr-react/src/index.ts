import { createContext } from 'react'
import { Directorr } from '@nimel/directorr'
import { createConnector } from './createConnector'
import { createUseStoreHook } from './createUseStoreHook'

export { useLocalStore } from './useLocalStore'
export { createUseStoreHook } from './createUseStoreHook'
export { createConnector } from './createConnector'

export const DirectorrContext = createContext<Directorr | undefined>(undefined)
export const DirectorrProvider = DirectorrContext.Provider
export const useStore = createUseStoreHook(DirectorrContext)
export const connector = createConnector(useStore)
