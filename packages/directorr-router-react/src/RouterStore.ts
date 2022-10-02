import { injectStore } from '@nimel/directorr'
import {
  HistoryStore,
  effectHistoryPop,
  effectHistoryPush,
  effectHistoryReplace,
  HistoryActionPayload,
} from '@nimel/directorr-router'
import { RouterHandler, RouterTask } from './types'

export class RouterStore {
  historyQueue: RouterTask[] = []

  handlersStack: RouterHandler[] = []

  @injectStore(HistoryStore) historyStore: HistoryStore

  get path() {
    return this.historyStore.path
  }

  get action() {
    return this.historyStore.action
  }

  subscribe = (handler: RouterHandler) => {
    this.handlersStack = [...this.handlersStack, handler]
  }

  unsubscribe = (handler: RouterHandler) => {
    this.handlersStack = this.handlersStack.filter(h => h !== handler)
  }

  @effectHistoryPop
  @effectHistoryPush
  @effectHistoryReplace
  whenChangeHistory = (task: HistoryActionPayload) => {
    this.historyQueue.push(task)

    if (this.historyQueue.length === 1) this.findNextTask()
  }

  private findNextTask() {
    const {
      historyQueue: [newRouterState],
      handlersStack,
    } = this

    const routersTookTask: Promise<any>[] = []

    for (const handler of handlersStack) {
      const task = handler(newRouterState)

      if (task) {
        routersTookTask.push(task)
      }
    }

    if (routersTookTask.length) {
      void Promise.all(routersTookTask).then(this.runNextTask)
    } else {
      this.runNextTask()
    }
  }

  private runNextTask = () => {
    this.historyQueue.shift()

    if (this.historyQueue.length) this.findNextTask()
  }
}

export default RouterStore
