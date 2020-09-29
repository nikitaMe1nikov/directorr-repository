import { createElement, ComponentClass, FunctionComponent } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { DirectorrStoreClassConstructor } from '@nimel/directorr';
import createUseStoreHooks from './createUseStoreHooks';

export function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function getStoreName(StoreConstructor: DirectorrStoreClassConstructor<any>) {
  return lowercaseFirstLetter(StoreConstructor.storeName || StoreConstructor.name);
}

export default function createConnector(useStoreHook: ReturnType<typeof createUseStoreHooks>) {
  return function connector(
    StoreConstructor: DirectorrStoreClassConstructor<any>,
    storeNameInProps: string = getStoreName(StoreConstructor)
  ) {
    return function connectorWrapper<P>(component: FunctionComponent<P> | ComponentClass<P, any>) {
      function Connector(props: P) {
        const store = useStoreHook(StoreConstructor);

        return createElement(component, {
          ...props,
          [storeNameInProps]: store,
        });
      }

      hoistStatics(Connector, component);

      return Connector as FunctionComponent<P>;
    };
  };
}
