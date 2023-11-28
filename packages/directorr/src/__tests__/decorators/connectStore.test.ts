import connectStore, {
  initializer,
  addDispatchAction,
  dispatchProxyAction,
  MODULE_NAME,
} from '../../decorators/connectStore'
import {
  // DISPATCH_ACTION_FIELD_NAME,
  // DISPATCH_EFFECTS_FIELD_NAME,
  createActionType,
  createAction,
  // ACTION_TYPE_DIVIDER,
  // defineProperty,
  // createValueDescriptor,
} from '../../Directorr/directorrUtils'
import { useForPropNotEquallObject } from '../../messages'
import { someValue, someFunc, actionType, someProperty, action } from '../../__mocks__/mocks'
import {
  ACTION_TYPE_DIVIDER,
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
} from '../../constants'
import { defineProperty } from '../../utils/primitives'
import { createValueDescriptor } from '../../utils/decoratorsUtils'

describe('connectStore', () => {
  it('dispatchProxyAction', () => {
    class InnerStoreNameOne {
      [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn()
    }
    class InnerStoreNameTwo {
      static storeName = 'storeName';

      [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn()
    }
    class OuterStoreName {
      [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn()
    }

    const connectStoreProperty = 'connectStoreProperty'
    const prefixActionType = 'prefixActionType'
    const innerStoreOne = new InnerStoreNameOne()
    const innerStoreTwo = new InnerStoreNameTwo()
    const outerStore = new OuterStoreName()

    dispatchProxyAction(action, innerStoreOne, outerStore, connectStoreProperty)

    expect(innerStoreOne[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(1)
    expect(innerStoreOne[DISPATCH_EFFECTS_FIELD_NAME]).lastCalledWith(action)

    expect(outerStore[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(1)
    expect(outerStore[DISPATCH_EFFECTS_FIELD_NAME]).lastCalledWith(
      createAction(createActionType(action.type, ACTION_TYPE_DIVIDER), {
        ...action.payload,
        connectStoreProperty,
      }),
    )

    dispatchProxyAction(action, innerStoreTwo, outerStore, connectStoreProperty, prefixActionType)

    expect(innerStoreTwo[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(1)
    expect(innerStoreTwo[DISPATCH_EFFECTS_FIELD_NAME]).lastCalledWith(action)

    expect(outerStore[DISPATCH_EFFECTS_FIELD_NAME]).toBeCalledTimes(2)
    expect(outerStore[DISPATCH_EFFECTS_FIELD_NAME]).lastCalledWith(
      createAction(createActionType([prefixActionType, action.type], ACTION_TYPE_DIVIDER), {
        ...action.payload,
        connectStoreProperty,
      }),
    )
  })

  it('addDispatchAction', () => {
    const innerStoreOne: any = {}
    const innerStoreTwo: any = {}
    const outerStore = {}
    const dispatchActionOne = jest.fn()
    const dispatchActionTwo = jest.fn()
    const prefixActionType = 'prefixActionType'

    expect(
      addDispatchAction(innerStoreOne, outerStore, actionType, undefined, dispatchActionOne),
    ).toBe(innerStoreOne)

    expect(innerStoreOne[DISPATCH_ACTION_FIELD_NAME]).toBeDefined()

    innerStoreOne[DISPATCH_ACTION_FIELD_NAME](action)

    expect(dispatchActionOne).toBeCalledTimes(1)
    expect(dispatchActionOne).lastCalledWith(
      action,
      innerStoreOne,
      outerStore,
      actionType,
      undefined,
    )

    expect(
      addDispatchAction(innerStoreTwo, outerStore, actionType, prefixActionType, dispatchActionTwo),
    ).toBe(innerStoreTwo)

    expect(innerStoreTwo[DISPATCH_ACTION_FIELD_NAME]).toBeDefined()

    innerStoreTwo[DISPATCH_ACTION_FIELD_NAME](action)

    expect(dispatchActionTwo).toBeCalledTimes(1)
    expect(dispatchActionTwo).lastCalledWith(
      action,
      innerStoreTwo,
      outerStore,
      actionType,
      prefixActionType,
    )
  })

  it('initializer', () => {
    const addDispatchAction = jest.fn().mockReturnValue(someValue)
    const addFields = jest.fn()
    const store: any = {}

    expect(() =>
      initializer(store, someFunc, someProperty, actionType, addDispatchAction, addFields),
    ).toThrowError(useForPropNotEquallObject(MODULE_NAME, someProperty))

    expect(
      initializer(store, someValue, someProperty, actionType, addDispatchAction, addFields),
    ).toBe(someValue)

    expect(addDispatchAction).toBeCalledTimes(1)
    expect(addDispatchAction).lastCalledWith(someValue, store, someProperty, actionType)
    expect(addFields).toBeCalledTimes(1)
  })

  it('use connectStore in class', () => {
    const dispatchEffectsConnectStore = jest.fn()
    const dispatchEffects = jest.fn()
    const conectedStorePropName = 'connectedStore'
    class SomeConnectStore {
      [DISPATCH_ACTION_FIELD_NAME] = dispatchEffectsConnectStore;

      [DISPATCH_EFFECTS_FIELD_NAME] = dispatchEffectsConnectStore
    }
    const someConnectStore = new SomeConnectStore()

    class SomeClass {
      @connectStore()
      connectedStore = someConnectStore
    }
    const connectStoreAction = createAction(actionType, { someValue })
    const action = createAction(createActionType(actionType, ACTION_TYPE_DIVIDER), {
      someValue,
      connectStoreProperty: conectedStorePropName,
    })

    const obj = new SomeClass()

    defineProperty(obj, DISPATCH_EFFECTS_FIELD_NAME, createValueDescriptor(dispatchEffects))
    someConnectStore[DISPATCH_ACTION_FIELD_NAME](connectStoreAction)

    expect(dispatchEffectsConnectStore).toBeCalledTimes(1)
    expect(dispatchEffectsConnectStore).lastCalledWith(connectStoreAction)

    expect(dispatchEffects).toBeCalledTimes(1)
    expect(dispatchEffects).lastCalledWith(action)
  })

  it('use connectStore in class with prefix', () => {
    const prefix = 'prefix'
    const dispatchEffectsConnectStore = jest.fn()
    const dispatchEffects = jest.fn()
    const conectedStorePropName = 'connectedStore'
    class SomeConnectStore {
      [DISPATCH_ACTION_FIELD_NAME] = dispatchEffectsConnectStore;

      [DISPATCH_EFFECTS_FIELD_NAME] = dispatchEffectsConnectStore
    }
    const someConnectStore = new SomeConnectStore()
    class SomeClass {
      @connectStore(prefix)
      connectedStore = someConnectStore
    }
    const connectStoreAction = createAction(actionType, { someValue })
    const action = createAction(createActionType([prefix, actionType], ACTION_TYPE_DIVIDER), {
      someValue,
      connectStoreProperty: conectedStorePropName,
    })

    const obj = new SomeClass()

    defineProperty(obj, DISPATCH_EFFECTS_FIELD_NAME, createValueDescriptor(dispatchEffects))
    someConnectStore[DISPATCH_ACTION_FIELD_NAME](connectStoreAction)

    expect(dispatchEffectsConnectStore).toBeCalledTimes(1)
    expect(dispatchEffectsConnectStore).lastCalledWith(connectStoreAction)

    expect(dispatchEffects).toBeCalledTimes(1)
    expect(dispatchEffects).lastCalledWith(action)
  })
})
