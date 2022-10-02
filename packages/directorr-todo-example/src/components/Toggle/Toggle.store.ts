import { observable, makeObservable } from 'mobx'
import { createActionAndEffect } from '@nimel/directorr'

export interface TogglePayload {
  value: boolean
}

export const [actionToggle, effectToggle] = createActionAndEffect<TogglePayload>('TOGGLE.CHANGE')

export default class Toggle {
  @observable value: boolean

  @observable disabled = false

  constructor(v = false) {
    makeObservable(this)
    this.value = v
  }

  @actionToggle
  onChange = (e: any) => ({ value: e.target.checked })

  @effectToggle
  toToggle = ({ value }: TogglePayload) => {
    this.value = value
  }
}
