/**
 * @jest-environment jsdom
 */
import { FC } from 'react'
import { action, effect } from '@nimel/directorr'
import { initStoreSuccessEffect, initStoreErrorEffect } from '@nimel/directorr-appinitializer'
import { AppInit } from '../AppInit'
import { createDirectorr, mountWithDirectorr } from '../__mocks__/utils'
import { flushPromises } from '../../../../tests/utils'

const CHANGE_READY = 'CHANGE_READY'
const CHANGE_ERROR = 'CHANGE_ERROR'

class StoreOne {
  isReady = false

  @action(CHANGE_READY)
  changeReady = () => ({
    isReady: !this.isReady,
  })

  @effect(CHANGE_READY)
  toChangeReady = ({ isReady }: { isReady: boolean }) => {
    this.isReady = isReady
  }

  @initStoreSuccessEffect
  toReadyAppinit = jest.fn()
}

class StoreError {
  isError = false

  @action(CHANGE_ERROR)
  changeError = () => ({
    isError: !this.isError,
  })

  @effect(CHANGE_ERROR)
  toChangeReady = ({ isError }: { isError: boolean }) => {
    this.isError = isError
  }

  @initStoreErrorEffect
  toErrorAppinit = jest.fn()
}

const SomeComponent: FC = () => null

const ChildComponent: FC = () => <SomeComponent />

const ErrorComponent: FC = () => null

describe('AppInit', () => {
  it('with not ready stores', () => {
    const directorr = createDirectorr()

    const wrapper = mountWithDirectorr(
      <AppInit stores={[StoreOne]}>
        <ChildComponent />
      </AppInit>,
      directorr,
    )

    expect(wrapper.find(SomeComponent)).toHaveLength(0)
    expect(wrapper.find(ErrorComponent)).toHaveLength(0)
  })

  it('with not ready stores and LoadingComponent', () => {
    const directorr = createDirectorr()
    const LoadingComponent: FC = () => null

    const wrapper = mountWithDirectorr(
      <AppInit stores={[StoreOne]} LoadingComponent={LoadingComponent}>
        <ChildComponent />
      </AppInit>,
      directorr,
    )

    expect(wrapper.find(SomeComponent)).toHaveLength(0)
    expect(wrapper.find(LoadingComponent)).toHaveLength(1)
  })

  it('with stores where change state to ready', async () => {
    const directorr = createDirectorr()
    const stores = [StoreOne]

    const wrapper = mountWithDirectorr(
      <AppInit stores={stores} ErrorComponent={ErrorComponent}>
        <ChildComponent />
      </AppInit>,
      directorr,
    )

    expect(wrapper.find(SomeComponent)).toHaveLength(0)
    expect(wrapper.find(ErrorComponent)).toHaveLength(0)

    const storeOne = directorr.getStore(StoreOne) as StoreOne

    expect(storeOne).toBeInstanceOf(StoreOne)
    expect(wrapper.update().find(SomeComponent)).toHaveLength(0)
    expect(wrapper.update().find(ErrorComponent)).toHaveLength(0)

    storeOne.changeReady()

    await flushPromises()

    expect(storeOne.toReadyAppinit).toBeCalledTimes(1)
    expect(storeOne.toReadyAppinit).toBeCalledWith({ stores })
    expect(wrapper.update().find(SomeComponent)).toHaveLength(1)
    expect(wrapper.update().find(ErrorComponent)).toHaveLength(0)
  })

  it('with stores where some have error state', async () => {
    const directorr = createDirectorr()
    const stores = [StoreOne, StoreError]

    const wrapper = mountWithDirectorr(
      <AppInit stores={stores} ErrorComponent={ErrorComponent}>
        <ChildComponent />
      </AppInit>,
      directorr,
    )

    expect(wrapper.find(SomeComponent)).toHaveLength(0)
    expect(wrapper.find(ErrorComponent)).toHaveLength(0)

    const storeError = directorr.getStore(StoreError) as StoreError

    expect(storeError).toBeInstanceOf(StoreError)
    expect(wrapper.update().find(SomeComponent)).toHaveLength(0)
    expect(wrapper.update().find(ErrorComponent)).toHaveLength(0)

    storeError.changeError()

    await flushPromises()

    expect(storeError.toErrorAppinit).toBeCalledTimes(1)
    expect(storeError.toErrorAppinit).toBeCalledWith({ store: storeError, stores })
    expect(wrapper.update().find(SomeComponent)).toHaveLength(0)
    expect(wrapper.update().find(ErrorComponent)).toHaveLength(1)
  })
})
