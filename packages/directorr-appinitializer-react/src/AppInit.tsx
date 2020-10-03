import React, { FC, ComponentType } from 'react';
import { observer } from 'mobx-react-lite';
import { InitOptions, AppInitStore } from '@nimel/directorr-appinitializer';
import { useStore } from '@nimel/directorr-react';

const AppInit: FC<{ stores: InitOptions; LoadingComponent?: ComponentType }> = ({
  stores,
  children,
  LoadingComponent,
}) => {
  const { isInitComplated } = useStore(AppInitStore, stores);

  if (!isInitComplated) return LoadingComponent ? <LoadingComponent /> : null;

  return <>{children}</>;
};

export default observer(AppInit);
