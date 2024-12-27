import { whenDestroy } from '@nimel/directorr'
import { actionNetworkStatus } from './decorators'
import { isServer } from './constants'

export const FOCUS_EVENT_NAME = 'focus'
export const BLUR_EVENT_NAME = 'blur'
// type Listener = (online: boolean) => void

export class WindowStatus {
  focus = true

  @whenDestroy
  unsubscribe: () => void

  // eventListeners: Listener[] = []

  constructor() {
    if (!isServer) {
      const onlineListener = () => this.setStatus(true)
      const offlineListener = () => this.setStatus(false)
      // Listen to online
      window.addEventListener(FOCUS_EVENT_NAME, onlineListener, { passive: true })
      window.addEventListener(BLUR_EVENT_NAME, offlineListener, { passive: true })

      this.unsubscribe = () => {
        // Be sure to unsubscribe if a new handler is set
        window.removeEventListener(FOCUS_EVENT_NAME, onlineListener)
        window.removeEventListener(BLUR_EVENT_NAME, offlineListener)
      }
    }
  }

  @actionNetworkStatus
  setStatus = (isOnline: boolean) => {
    const isChanged = this.focus !== isOnline

    if (isChanged) {
      this.focus = isOnline

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
