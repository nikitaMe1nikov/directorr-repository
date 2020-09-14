import { action, effect, connectStore, injectStore } from '@nimel/directorr';
import ToggleStore, { TOGGLE_CHANGE } from 'components/Toggle/ToggleStore';
import PageStore, {
  FILTER_TYPE,
  ALL_TODO_COMPLATED,
  ALL_TODO_ACTIVE,
  CLEAR_COMPLATED_TODO,
  CHANGE_FILTER,
  CHANGE_TODO_TOGGLE,
  CHANGE_TODOS_LIST,
} from 'page/PageStore';
import { REMOVE_TODO_SUCCESS } from '../../sagas';

export default class TotalStore {
  @injectStore(PageStore) pageStore: PageStore;

  @connectStore() allToggle = new ToggleStore();

  @effect([ToggleStore, TOGGLE_CHANGE])
  onToggleAll = ({ value: checked }: any) => {
    if (checked) {
      this.toAllComplate();
    } else {
      this.toAllActive();
    }
  };

  @action(ALL_TODO_COMPLATED)
  toAllComplate = () => {};

  @action(ALL_TODO_ACTIVE)
  toAllActive = () => {};

  @action(CLEAR_COMPLATED_TODO)
  clearComplated = () => {};

  @effect(REMOVE_TODO_SUCCESS)
  toClearComplated = () => {
    this.allToggle.value = false;
  };

  get filter() {
    return this.pageStore.filter;
  }

  @action(CHANGE_FILTER)
  changeFilterToAll = () => FILTER_TYPE.ALL;

  @action(CHANGE_FILTER)
  changeFilterToActive = () => FILTER_TYPE.ACTIVE;

  @action(CHANGE_FILTER)
  changeFilterToComplated = () => FILTER_TYPE.COMPLATED;

  @effect(CHANGE_TODO_TOGGLE)
  onToggleItem = () => {
    const { list: todosList } = this.pageStore.todosStore;

    const checkedList = todosList.filter(({ checked }) => checked);

    this.allToggle.value = checkedList.length === todosList.length;
  };

  @effect(CHANGE_TODOS_LIST)
  whenChangeTodosList = () => {
    this.allToggle.disabled = !this.pageStore.todosStore.list.length;
  };
}
