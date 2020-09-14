import { observable } from 'mobx';

// import ToggleStore, { TOGGLE } from 'components/Toggle/ToggleStore';
// import { connectStore } from '@nimel/directorr';

// export const TOGGLE_ITEM = [ToggleStore, TOGGLE];

// export default class TodoItemStore {
//   id: number;

//   text: string;

//   @connectStore() toggleStore = new ToggleStore();

//   @computed get checked() {
//     return this.toggleStore.value;
//   }

//   set checked(v) {
//     this.toggleStore.value = v;
//   }

//   constructor({ id, text }: { id: number; text: string }) {
//     this.id = id;
//     this.text = text;
//   }

//   check() {
//     this.checked = true;
//   }

//   uncheck() {
//     this.checked = false;
//   }
// }

export default class TodoItemStore {
  id: number;

  text: string;

  @observable checked: boolean;

  constructor({ id, text, checked = false }: TodoItemStore) {
    this.id = id;
    this.text = text;
    this.checked = checked;
  }
}
