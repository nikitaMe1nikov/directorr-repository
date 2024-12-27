// import {
//   createAction,
//   DISPATCH_ACTION_FIELD_NAME,
//   dispatchEffectInStore,
//   Directorr,
//   // action,
//   // effect,
// } from '@nimel/directorr'
import { actionQuery, actionQueryLoading, actionQuerySuccess } from '../decorators'
import { subscribeOnDirectorrStore } from '@nimel/directorr'
import { createUniqKey } from '../utils'
import { DEFAULT_OPTIONS, QueryStore } from '../QueryStore'
// import { flushTimeouts } from '../../../../tests/utils'
import { QueryStatus } from '../types'
// import { SomeClassConstructor } from '../types'

export function delay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
// console.log(actionQuerySuccess)
// const CHANGE_READY = 'CHANGE_READY'
// const CHANGE_ERROR = 'CHANGE_ERROR'

// class StoreOne {
//   isStoreStateReady = false

//   @action(CHANGE_READY)
//   changeReady = () => ({
//     isStoreStateReady: !this.isStoreStateReady,
//   })

//   @effect(CHANGE_READY)
//   toChangeReady = ({ isStoreStateReady }: { isStoreStateReady: boolean }) => {
//     this.isStoreStateReady = isStoreStateReady
//   }

//   @initStoreSuccessEffect
//   toReadyAppinit = jest.fn()
// }

// class StoreError {
//   isStoreStateError = false

//   @action(CHANGE_ERROR)
//   changeError = () => ({
//     isStoreStateError: !this.isStoreStateError,
//   })

//   @effect(CHANGE_ERROR)
//   toChangeReady = ({ isStoreStateError }: { isStoreStateError: boolean }) => {
//     this.isStoreStateError = isStoreStateError
//   }

//   @initStoreErrorEffect
//   toErrorAppinit = jest.fn()
// }

describe.skip('QueryStore', () => {
  it('init with empty options', () => {
    const store = new QueryStore()

    expect(store.options).toMatchObject(DEFAULT_OPTIONS)
  })

  it('init with predefined options', () => {
    const options = {
      ttl: 11_111,
    }
    const store = new QueryStore(options)

    expect(store.options).toMatchObject({ ...DEFAULT_OPTIONS, ...options })
  })

  it('success query', async () => {
    const store = new QueryStore()
    const data = 5
    const query = async () => {
      await delay(0)

      return data
    }
    const variables = { someProp: 111 }
    const options = {}
    const key = createUniqKey(query, variables)
    const subscribe = jest.fn()
    const loading: QueryStatus = 'loading'
    const success: QueryStatus = 'success'

    subscribeOnDirectorrStore(store, subscribe)

    const promise = store.fetchQuery({ query, variables, options })
    // console.log('store.isLoading(key)', store.isLoading(key))
    expect(store.isLoading(key)).toMatchObject({
      query,
      variables,
      options: store.options,
      status: loading,
    })
    expect(store.isLoading(key)?.abortController).toBeInstanceOf(AbortController)
    expect(store.isLoading(key)?.promise).toBeInstanceOf(Promise)
    expect(subscribe).toBeCalledTimes(2)
    // console.log('subscribe', subscribe.mock.calls)
    expect(subscribe).nthCalledWith(1, actionQuery.createAction({ query, variables, options }))
    expect(subscribe).nthCalledWith(
      2,
      actionQueryLoading.createAction({
        query,
        variables,
        options: store.options,
        status: loading,
      }),
    )

    // const promise = store.isLoading(key)?.promise

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await expect(promise).resolves.toEqual(data)

    // await flushTimeouts()

    expect(store.isSuccess(key)).toMatchObject({
      query,
      variables,
      options: store.options,
      status: success,
      data,
      errorCount: 0,
      errorCountDelay: undefined,
      abortController: undefined,
      promise: undefined,
    })
    expect(subscribe).toBeCalledTimes(3)
    expect(subscribe).nthCalledWith(
      3,
      actionQuerySuccess.createAction({
        query,
        variables,
        options: store.options,
        status: success,
        data,
      }),
    )
  })

  it('error query', async () => {
    const store = new QueryStore()
    const error = 'error message'
    const query = async () => {
      await delay(0)

      throw new Error(error)
    }
    const variables = { someProp: 111 }
    const options = {}
    const key = createUniqKey(query, variables)
    const subscribe = jest.fn()
    const loading: QueryStatus = 'loading'
    // const error: QueryStatus = 'error'
    // console.log('error', error)
    subscribeOnDirectorrStore(store, subscribe)

    const promise = store.fetchQuery({ query, variables, options })

    expect(store.isLoading(key)).toMatchObject({
      query,
      variables,
      options: store.options,
      status: loading,
    })
    expect(store.isLoading(key)?.abortController).toBeInstanceOf(AbortController)
    expect(store.isLoading(key)?.promise).toBeInstanceOf(Promise)
    expect(subscribe).toBeCalledTimes(2)
    // console.log('subscribe', subscribe.mock.calls[0])
    expect(subscribe).nthCalledWith(1, actionQuery.createAction({ query, variables, options }))
    expect(subscribe).nthCalledWith(
      2,
      actionQueryLoading.createAction({
        query,
        variables,
        options: store.options,
        status: loading,
      }),
    )

    // const promise = store.isLoading(key)?.promise

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await expect(promise).rejects.toEqual(new Error(error))

    // await flushTimeouts()
    // console.log(flushTimeouts, promise)
    // console.log(flushTimeouts)
    // console.log('promise', expect(promise).rejects)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    // expect(promise).rejects.toEqual(new Error(error))
    // expect(store.isSuccess(key)).toMatchObject({
    //   query,
    //   variables,
    //   options: store.options,
    //   status: success,
    //   data,
    //   errorCount: 0,
    //   errorCountDelay: undefined,
    //   abortController: undefined,
    //   promise: undefined,
    // })
    // expect(subscribe).toBeCalledTimes(3)
    // expect(subscribe).nthCalledWith(
    //   3,
    //   actionQuerySuccess.createAction({
    //     query,
    //     variables,
    //     options: store.options,
    //     status: success,
    //     data,
    //   }),
    // )
  })

  // it('change state isInitComplated', () => {
  //   const options = [] as SomeClassConstructor<any, any>[]
  //   const store: any = new AppInitStore(options)

  //   expect(store.isInitComplated).toBeFalsy()

  //   dispatchEffectInStore(store, initStoreSuccessAction.createAction({ stores: options }))

  //   expect(store.isInitComplated).toBeTruthy()
  // })

  // it('with stores where change state to ready', async () => {
  //   const directorr = new Directorr()
  //   const stores = [StoreOne]

  //   const initStore = directorr.addStore(AppInitStore)

  //   initStore.loadStores(stores)

  //   const storeOne = directorr.getStore(StoreOne) as StoreOne
  //   storeOne.changeReady()

  //   await flushPromises()

  //   expect(storeOne.toReadyAppinit).toBeCalledTimes(1)
  //   expect(storeOne.toReadyAppinit).toBeCalledWith({ stores })
  // })

  // it('with stores where some have error state', async () => {
  //   const directorr = new Directorr()
  //   const stores = [StoreOne, StoreError]
  //   jest.spyOn(directorr, 'unsubscribe')

  //   const initStore = directorr.addStore(AppInitStore)

  //   initStore.loadStores(stores)

  //   await flushPromises()

  //   expect(initStore.isInitComplated).toBeFalsy()

  //   const storeError = directorr.getStore(StoreError) as StoreError
  //   storeError.changeError()

  //   await flushPromises()

  //   expect(storeError.toErrorAppinit).toBeCalledTimes(1)
  //   expect(storeError.toErrorAppinit).toBeCalledWith({ store: storeError, stores })
  //   expect(directorr.unsubscribe).toBeCalledTimes(2)
  // })
})
