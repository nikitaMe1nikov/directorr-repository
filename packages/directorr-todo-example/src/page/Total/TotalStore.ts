import { effect, connectStore, injectStore } from '@nimel/directorr';
import ToggleStore, { actionToggle, TogglePayload } from 'components/Toggle/ToggleStore';
import PageStore from 'page/PageStore';
import {
  effectRemoveTodoSuccess,
  actionAllTodoComplated,
  actionAllTodoActive,
  actionClearComplatedTodo,
  actionChangeFilter,
  effectChangeTodoToggle,
  effectChangeTodosList,
} from 'decorators';
import { FilterType } from 'types';

export default class TotalStore {
  @injectStore(PageStore) pageStore: PageStore;

  @connectStore() allToggle = new ToggleStore();

  @effect<TogglePayload>([ToggleStore, actionToggle])
  onToggleAll = ({ value: checked }: TogglePayload) => {
    if (checked) {
      this.toAllComplate();
    } else {
      this.toAllActive();
    }
  };

  @actionAllTodoComplated
  toAllComplate = () => {};

  @actionAllTodoActive
  toAllActive = () => {};

  @actionClearComplatedTodo
  clearComplated = () => {};

  @effectRemoveTodoSuccess
  toClearComplated = () => {
    this.allToggle.value = false;
  };

  get filter() {
    return this.pageStore.filter;
  }

  @actionChangeFilter
  changeFilterToAll = () => ({ filter: FilterType.ALL });

  @actionChangeFilter
  changeFilterToActive = () => ({ filter: FilterType.ACTIVE });

  @actionChangeFilter
  changeFilterToComplated = () => ({ filter: FilterType.COMPLATED });

  @effectChangeTodoToggle
  onToggleItem = () => {
    const { list: todosList } = this.pageStore.todosStore;

    const checkedList = todosList.filter(({ checked }) => checked);

    this.allToggle.value = checkedList.length === todosList.length;
  };

  @effectChangeTodosList
  whenChangeTodosList = () => {
    this.allToggle.disabled = !this.pageStore.todosStore.list.length;
  };
}
