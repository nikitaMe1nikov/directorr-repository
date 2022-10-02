import {
  Cache,
  calcPath,
  generatePath,
  calcParams,
  matchPath,
  ANY_PATH,
  reloadWindow,
} from '../utils'

describe('utils', () => {
  it('Cache', () => {
    const cache = new Cache(1)
    const keyOne = 'keyOne'
    const valueOne = {}
    const keyTwo = 'keyTwo'
    const valueTwo = {}
    const keyThree = 'keyThree'
    const valueThree = {}

    expect(cache.size).toBe(0)

    cache.set(keyOne, valueOne)

    expect(cache.size).toBe(1)
    expect(cache.has(keyOne)).toBeTruthy()
    expect(cache.get(keyOne)).toBe(valueOne)

    cache.set(keyTwo, valueTwo)

    expect(cache.size).toBe(2)
    expect(cache.has(keyOne)).toBeTruthy()
    expect(cache.has(keyTwo)).toBeTruthy()
    expect(cache.get(keyTwo)).toBe(valueTwo)

    cache.set(keyThree, valueThree)

    expect(cache.has(keyOne)).toBeFalsy()
    expect(cache.has(keyTwo)).toBeTruthy()
    expect(cache.has(keyThree)).toBeTruthy()
    expect(cache.get(keyThree)).toBe(valueThree)
  })

  it('matchPath', () => {
    const pathname = '/pathname'
    const urlPatternSame = pathname
    const urlPatternSameInner = `${pathname}/some`
    const urlPatternOther = '/other'
    const id = '12'
    const pathnameWithId = `${pathname}/${id}`
    const urlPatternSameWith = `${pathname}/:id`

    expect(matchPath(pathname, urlPatternOther)).toBeUndefined()

    expect(matchPath(urlPatternSameInner, `${pathname}/${ANY_PATH}`)?.patterns[0]).toBe(
      urlPatternSameInner,
    )
    expect(matchPath(urlPatternSameInner, `${pathname}/${ANY_PATH}`)?.keys).toStrictEqual([
      {
        modifier: '',
        name: 0,
        pattern: '.*',
        prefix: '/',
        suffix: '',
      },
    ])

    expect(matchPath(pathname, urlPatternSame)?.patterns[0]).toBe(pathname)
    expect(matchPath(pathname, urlPatternSame)?.keys).toStrictEqual([])

    expect(matchPath(pathnameWithId, urlPatternSameWith)?.patterns[0]).toBe(pathnameWithId)
    expect(matchPath(pathnameWithId, urlPatternSameWith)?.keys).toStrictEqual([
      {
        modifier: '',
        name: 'id',
        pattern: '[^\\/#\\?]+?',
        prefix: '/',
        suffix: '',
      },
    ])
  })

  it('calcParams', () => {
    const someValue = 'someValue'
    const name = 'name'
    const patterns = ['', someValue]
    const keys: any = [{ name }, {}]

    expect(calcParams(patterns, keys)).toStrictEqual({
      [name]: someValue,
    })
  })

  it('calcPath', () => {
    const path = '/path'
    const queryObject = {
      propOne: 'one',
      propTwo: 'two',
    }

    expect(calcPath(path)).toBe(path)
    expect(calcPath(path, queryObject)).toBe(`${path}?propOne=one&propTwo=two`)
  })

  it('generatePath', () => {
    const root = '/'
    const idParam = ':id'
    const path = '/path'
    const params = {
      id: '12',
    }

    expect(generatePath(root)).toBe(root)
    expect(generatePath()).toBe(root)
    expect(generatePath(`${path}/${idParam}`, params)).toBe(`${path}/${params.id}`)
    expect(generatePath(`${path}/${idParam}`, params)).toBe(`${path}/${params.id}`)
  })

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
})
