import connectStore, {
  initializer,
  addDispatchAction,
  dispatchProxyAction,
  MODULE_NAME,
} from '../connectStore';
import {
  DISPATCH_ACTION_FIELD_NAME,
  DISPATCH_EFFECTS_FIELD_NAME,
  createActionType,
  createAction,
  ACTION_TYPE_DIVIDER,
  defineProperty,
  createValueDescriptor,
} from '../utils';
import { useForPropNotEquallObject } from '../messages';
import { someValue, someFunc, actionType, someProperty, action } from '../__mocks__/mocks';

describe('connectStore', () => {
  it('dispatchProxyAction', () => {
    class InnerStoreNameOne {
      [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn();
    }
    class InnerStoreNameTwo {
      static storeName = 'storeName';
      [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn();
    }
    class OuterStoreName {
      [DISPATCH_EFFECTS_FIELD_NAME] = jest.fn();
    }

    const connectStoreProperty = 'connectStoreProperty';
    const prefixActionType = 'prefixActionType';
    const innerStoreOne = new InnerStoreNameOne();
    const innerStoreTwo = new InnerStoreNameTwo();
    const outerStore = new OuterStoreName();

    dispatchProxyAction(action, innerStoreOne, outerStore, connectStoreProperty);

    expect(innerStoreOne[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(1);
    expect(innerStoreOne[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenLastCalledWith(action);

    expect(outerStore[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(1);
    expect(outerStore[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenLastCalledWith(
      createAction(createActionType([InnerStoreNameOne.name, action.type], ACTION_TYPE_DIVIDER), {
        ...action.payload,
        connectStoreProperty,
      })
    );

    dispatchProxyAction(action, innerStoreTwo, outerStore, connectStoreProperty, prefixActionType);

    expect(innerStoreTwo[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(1);
    expect(innerStoreTwo[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenLastCalledWith(action);

    expect(outerStore[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenCalledTimes(2);
    expect(outerStore[DISPATCH_EFFECTS_FIELD_NAME]).toHaveBeenLastCalledWith(
      createAction(
        createActionType(
          [prefixActionType, InnerStoreNameTwo.storeName, action.type],
          ACTION_TYPE_DIVIDER
        ),
        {
          ...action.payload,
          connectStoreProperty,
        }
      )
    );
  });

  it('addDispatchAction', () => {
    const innerStoreOne: any = {};
    const innerStoreTwo: any = {};
    const outerStore = {};
    const dispatchActionOne = jest.fn();
    const dispatchActionTwo = jest.fn();
    const prefixActionType = 'prefixActionType';

    expect(
      addDispatchAction(innerStoreOne, outerStore, actionType, undefined, dispatchActionOne)
    ).toEqual(innerStoreOne);

    expect(innerStoreOne[DISPATCH_ACTION_FIELD_NAME]).toBeDefined();

    innerStoreOne[DISPATCH_ACTION_FIELD_NAME](action);

    expect(dispatchActionOne).toHaveBeenCalledTimes(1);
    expect(dispatchActionOne).toHaveBeenLastCalledWith(
      action,
      innerStoreOne,
      outerStore,
      actionType,
      undefined
    );

    expect(
      addDispatchAction(innerStoreTwo, outerStore, actionType, prefixActionType, dispatchActionTwo)
    ).toEqual(innerStoreOne);

    expect(innerStoreTwo[DISPATCH_ACTION_FIELD_NAME]).toBeDefined();

    innerStoreTwo[DISPATCH_ACTION_FIELD_NAME](action);

    expect(dispatchActionTwo).toHaveBeenCalledTimes(1);
    expect(dispatchActionTwo).toHaveBeenLastCalledWith(
      action,
      innerStoreTwo,
      outerStore,
      actionType,
      prefixActionType
    );
  });

  it('initializer', () => {
    const addDispatchAction = jest.fn().mockReturnValue(someValue);
    const addFields = jest.fn();
    const store: any = {};

    expect(() =>
      initializer(store, someFunc, someProperty, actionType, addDispatchAction, addFields)
    ).toThrowError(useForPropNotEquallObject(MODULE_NAME, someProperty));

    expect(
      initializer(store, someValue, someProperty, actionType, addDispatchAction, addFields)
    ).toEqual(someValue);

    expect(addDispatchAction).toHaveBeenCalledTimes(1);
    expect(addDispatchAction).toHaveBeenLastCalledWith(someValue, store, someProperty, actionType);
    expect(addFields).toHaveBeenCalledTimes(1);
  });

  it('use connectStore in class', () => {
    const dispatchEffectsConnectStore = jest.fn();
    const dispatchEffects = jest.fn();
    const conectedStorePropName = 'connectedStore';
    class SomeConnectStore {
      [DISPATCH_ACTION_FIELD_NAME] = dispatchEffectsConnectStore;
      [DISPATCH_EFFECTS_FIELD_NAME] = dispatchEffectsConnectStore;
    }
    const someConnectStore = new SomeConnectStore();

    class SomeClass {
      @connectStore()
      connectedStore = someConnectStore;
    }
    const connectStoreAction = createAction(actionType, { someValue });
    const action = createAction(
      createActionType([SomeConnectStore, actionType], ACTION_TYPE_DIVIDER),
      { someValue, connectStoreProperty: conectedStorePropName }
    );

    const obj = new SomeClass();

    defineProperty(obj, DISPATCH_EFFECTS_FIELD_NAME, createValueDescriptor(dispatchEffects));
    someConnectStore[DISPATCH_ACTION_FIELD_NAME](connectStoreAction);

    expect(dispatchEffectsConnectStore).toHaveBeenCalledTimes(1);
    expect(dispatchEffectsConnectStore).toHaveBeenLastCalledWith(connectStoreAction);

    expect(dispatchEffects).toHaveBeenCalledTimes(1);
    expect(dispatchEffects).toHaveBeenLastCalledWith(action);
  });

  it('use connectStore in class with prefix', () => {
    const prefix = 'prefix';
    const dispatchEffectsConnectStore = jest.fn();
    const dispatchEffects = jest.fn();
    const conectedStorePropName = 'connectedStore';
    class SomeConnectStore {
      [DISPATCH_ACTION_FIELD_NAME] = dispatchEffectsConnectStore;
      [DISPATCH_EFFECTS_FIELD_NAME] = dispatchEffectsConnectStore;
    }
    const someConnectStore = new SomeConnectStore();
    class SomeClass {
      @connectStore(prefix)
      connectedStore = someConnectStore;
    }
    const connectStoreAction = createAction(actionType, { someValue });
    const action = createAction(
      createActionType([prefix, SomeConnectStore, actionType], ACTION_TYPE_DIVIDER),
      { someValue, connectStoreProperty: conectedStorePropName }
    );

    const obj = new SomeClass();

    defineProperty(obj, DISPATCH_EFFECTS_FIELD_NAME, createValueDescriptor(dispatchEffects));
    someConnectStore[DISPATCH_ACTION_FIELD_NAME](connectStoreAction);

    expect(dispatchEffectsConnectStore).toHaveBeenCalledTimes(1);
    expect(dispatchEffectsConnectStore).toHaveBeenLastCalledWith(connectStoreAction);

    expect(dispatchEffects).toHaveBeenCalledTimes(1);
    expect(dispatchEffects).toHaveBeenLastCalledWith(action);
  });
});
