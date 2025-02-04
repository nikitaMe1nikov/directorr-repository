import {
  createConnector,
  createUseStoreHooks,
  DirectorrContext,
  DirectorrProvider,
  useStore,
  useLocalStore,
  connector,
} from '../index'

describe('index', () => {
  it('check exports', () => {
    expect(createConnector).not.toBeUndefined()
    expect(createUseStoreHooks).not.toBeUndefined()
    expect(connector).not.toBeUndefined()
    expect(DirectorrContext).not.toBeUndefined()
    expect(DirectorrProvider).not.toBeUndefined()
    expect(useStore).not.toBeUndefined()
    expect(useLocalStore).not.toBeUndefined()
  })
})
