export interface ChangeFilterPayload {
  filter: FilterType
}

export interface Todo {
  id: string
  text: string
  checked: boolean
}

export type ChangeTodoTogglePayload = Pick<Todo, 'id' | 'checked'>

export interface TodosSuccessPayload {
  todos: Todo[]
}

export type AddTodoPayload = Todo

export type AddTodoSuccessPayload = Todo
export type RemoveTodoPayload = Pick<Todo, 'id'>
export type RemoveTodoSuccessPayload = RemoveTodoPayload

export enum FilterType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLATED = 'COMPLATED',
}
