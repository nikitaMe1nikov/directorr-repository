import React, { FC, ComponentType, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { InitOptions, AppInitStore } from '@nimel/directorr-appinitializer';
import { useStore } from '@nimel/directorr-react';
import { configure, action } from 'mobx';
import { config } from '@nimel/directorr';

configure({ enforceActions: 'observed', useProxies: 'never' });

config.configure({ batchFunction: action });

export const AppInit: FC<{ stores: InitOptions; LoadingComponent?: ComponentType }> = ({
  stores,
  children,
  LoadingComponent,
}) => {
  const { isInitComplated, loadStores } = useStore(AppInitStore);

  useEffect(() => {
    loadStores(stores);
  }, [stores]);

  if (!isInitComplated) return LoadingComponent ? <LoadingComponent /> : null;

  return <>{children}</>;
};

export default observer(AppInit);
