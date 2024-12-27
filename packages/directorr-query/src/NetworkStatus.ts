import { whenDestroy } from '@nimel/directorr'
import { actionNetworkStatus } from './decorators'
import { isServer } from './constants'

export const ONLINE_EVENT_NAME = 'online'
export const OFFLINE_EVENT_NAME = 'offline'
// type Listener = (online: boolean) => void

export class NetworkStatus {
  online = true

  @whenDestroy
  unsubscribe: () => void

  // eventListeners: Listener[] = []

  constructor() {
    if (!isServer) {
      // Listen to online
      window.addEventListener(ONLINE_EVENT_NAME, this.onlineListener, { passive: true })
      window.addEventListener(OFFLINE_EVENT_NAME, this.offlineListener, { passive: true })

      this.unsubscribe = () => {
        // Be sure to unsubscribe if a new handler is set
        window.removeEventListener(ONLINE_EVENT_NAME, this.onlineListener)
        window.removeEventListener(OFFLINE_EVENT_NAME, this.offlineListener)
      }
    }
  }

  private onlineListener = () => this.setStatus(true)

  private offlineListener = () => this.setStatus(false)

  @actionNetworkStatus
  setStatus = (isOnline: boolean) => {
    const isChanged = this.online !== isOnline

    if (isChanged) {
      this.online = isOnline

      return { status: isOnline }
    }

    return null
  }

  // addEventListener = (handler: Listener) => {
  //   this.eventListeners = [...this.eventListeners, handler]
  // }

  // removeEventHandlers = (handler: Listener) => {
  //   const index = this.eventListeners.indexOf(handler)

  //   if (index >= 0) this.eventListeners = [...this.eventListeners.splice(index, 1)]
  // }
}
