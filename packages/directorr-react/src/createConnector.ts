import { createElement, ComponentClass, FunctionComponent } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { DirectorrStoreClassConstructor, getStoreName } from '@nimel/directorr';
import { IAnyModelType } from 'mobx-state-tree';
import createUseStoreHooks from './createUseStoreHooks';

export function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export default function createConnector(useStoreHook: ReturnType<typeof createUseStoreHooks>) {
  function connector(
    StoreConstructorOrModel: DirectorrStoreClassConstructor<any>,
    storeNameInProps?: string
  ): <P>(component: FunctionComponent<P> | ComponentClass<P, any>) => FunctionComponent<P>;
  function connector(
    StoreConstructorOrModel: IAnyModelType,
    storeNameInProps?: string
  ): <P>(component: FunctionComponent<P> | ComponentClass<P, any>) => FunctionComponent<P>;
  function connector(
    StoreConstructorOrModel: any,
    storeNameInProps: string = lowercaseFirstLetter(getStoreName(StoreConstructorOrModel))
  ) {
    return function connectorWrapper<P>(component: FunctionComponent<P> | ComponentClass<P, any>) {
      function Connector(props: P) {
        const store = useStoreHook(StoreConstructorOrModel);

        return createElement(component, {
          ...props,
          [storeNameInProps]: store,
        });
      }

      hoistStatics(Connector, component);

      return Connector as FunctionComponent<P>;
    };
  }

  return connector;
}
