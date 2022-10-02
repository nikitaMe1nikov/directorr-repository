import { reloadWindow, convertBracketToColonParams, convertColonToBracketParams } from '../utils'

describe('utils', () => {
  it('reloadWindow', () => {
    const reload = jest.fn()

    Object.defineProperty(global, 'window', {
      value: {
        location: {
          reload,
        },
      },
    })

    reloadWindow()

    expect(window.location.reload).toBeCalledTimes(1)
  })

  it('convertBracketToColonParams', () => {
    const root = '/'
    const idParam = 'id'
    const path = '/path'

    expect(convertBracketToColonParams(root)).toBe(root)
    expect(convertBracketToColonParams(path)).toBe(path)
    expect(convertBracketToColonParams(`${path}/[${idParam}]`)).toBe(`${path}/:${idParam}`)
  })

  it('convertColonToBracketParams', () => {
    const root = '/'
    const idParam = 'id'
    const path = '/path'

    expect(convertColonToBracketParams(root)).toBe(root)
    expect(convertColonToBracketParams(`${path}/:${idParam}`)).toBe(`${path}/[${idParam}]`)
  })
})
