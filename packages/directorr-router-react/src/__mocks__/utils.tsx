import { ReactElement, FC } from 'react'
import { Directorr } from '@nimel/directorr'
import { DirectorrProvider } from '@nimel/directorr-react'
import { HistoryStore } from '@nimel/directorr-router'
import { createMemoryHistory } from 'history'
import { mount } from 'enzyme'

type History = ReturnType<typeof createMemoryHistory>

class HistoryStoreWithHistory extends HistoryStore {
  static storeName = HistoryStore.name

  static storeInitOptions: History
}

export function createDirectorr(history: History) {
  HistoryStoreWithHistory.storeInitOptions = history
  const directorr = new Directorr()
  directorr.addStores([HistoryStoreWithHistory])

  return directorr
}

export function mountWithDirectorr(children: ReactElement<any>, directorr: Directorr) {
  const wrappingComponent: FC = ({ children }) => (
    <DirectorrProvider value={directorr}>{children}</DirectorrProvider>
  )
  const root = mount(children, { wrappingComponent })
  const wrapper = root.children()

  wrapper.unmount = () => root.unmount()

  return wrapper
}
