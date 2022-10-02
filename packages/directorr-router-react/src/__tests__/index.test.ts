import {
  Router,
  RouterStore,
  ANIMATIONS,
  generatePath,
  historyChange,
  HistoryStore,
  ANY_PATH,
} from '../index'

describe('index', () => {
  it('check exports', () => {
    expect(Router).not.toBeUndefined()
    expect(RouterStore).not.toBeUndefined()
    expect(ANIMATIONS).not.toBeUndefined()
    expect(generatePath).not.toBeUndefined()
    expect(historyChange).not.toBeUndefined()
    expect(HistoryStore).not.toBeUndefined()
    expect(ANY_PATH).not.toBeUndefined()
  })
})
