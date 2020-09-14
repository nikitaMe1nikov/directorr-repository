import { createElement, useContext, Context, ComponentClass, FunctionComponent } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { DirectorrStoreClassConstructor, Directorr } from '@nimel/directorr';
import {
  whenNotFoundStore,
  whenNotStoreConstructor,
  whenContextNotLikeDirrector,
} from './messages';
import { isFunction, isDirrectorInstance } from './utils';

export const MODULE_NAME = 'createConnector';

export function getStoreName(StoreConstructor: DirectorrStoreClassConstructor) {
  return StoreConstructor.storeName || StoreConstructor.name || MODULE_NAME;
}

export default function createConnector(
  context: Context<Directorr>,
  StoreConstructor: DirectorrStoreClassConstructor<any>
) {
  function connector(component: FunctionComponent<any> | ComponentClass<any, any>) {
    function Connector(props: any) {
      if (!isFunction(StoreConstructor))
        throw new Error(whenNotStoreConstructor(MODULE_NAME, StoreConstructor));

      const dir: any = useContext(context);

      if (!isDirrectorInstance(dir)) throw new Error(whenContextNotLikeDirrector(MODULE_NAME, dir));

      const store = dir.getStore(StoreConstructor);

      if (!store) throw new Error(whenNotFoundStore(MODULE_NAME, StoreConstructor));

      return createElement(component, {
        ...props,
        [getStoreName(StoreConstructor)]: store,
      });
    }

    hoistStatics(Connector, component);

    return Connector;
  }

  return connector;
}
