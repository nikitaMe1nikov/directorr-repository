import { types, Instance } from 'mobx-state-tree'

export type RootModelType = Instance<typeof RootModel>

export const RootModel = types
  .model('RootModel')
  .props({
    one: types.optional(types.string, 'somestring'),
    two: types.optional(types.number, 11),
  })
  .actions(self => ({
    changeOne() {
      self.one += 'bla'
    },
    changeTwo() {
      self.two += 1
    },
  }))
