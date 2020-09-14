import { injectStore, whenInit, whenDestroy } from '@nimel/directorr';
import { HistoryStore } from '@nimel/directorr-router';
import { RouterHandler, RouterTask } from './types';

export default class RouterStore {
  private historyQueue: RouterTask[] = [];
  private handlersStack: RouterHandler[] = [];

  @injectStore(HistoryStore) historyStore: HistoryStore;

  @whenInit
  toInit = () => this.historyStore.subscribe(this.whenChangeHistory);

  @whenDestroy
  toDestroy = () => this.historyStore.unsubscribe(this.whenChangeHistory);

  subscribe = (handler: RouterHandler) => this.handlersStack.push(handler);

  unsubscribe = (handler: RouterHandler) => {
    const index = this.handlersStack.indexOf(handler);
    if (index !== -1) this.handlersStack.splice(index, 1);
  };

  whenChangeHistory = (task: RouterTask) => {
    this.historyQueue.push(task);

    if (this.historyQueue.length === 1) this.findNextTask();
  };

  private findNextTask() {
    const {
      historyQueue: [newRouterState],
      handlersStack,
    } = this;

    const routersTookTask = [];

    for (let i = 0, l = handlersStack.length, task; i < l; ++i) {
      task = handlersStack[i](newRouterState);

      if (task) {
        routersTookTask.push(task);
      }
    }

    if (routersTookTask.length) {
      Promise.all(routersTookTask).then(this.runNextTask);
    } else {
      this.runNextTask();
    }
  }

  private runNextTask = () => {
    this.historyQueue.shift();

    if (this.historyQueue.length) this.findNextTask();
  };
}
