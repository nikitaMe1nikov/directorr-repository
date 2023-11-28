import { FC, ComponentType, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { InitOptions, AppInitStore, SomeClassConstructor } from '@nimel/directorr-appinitializer'
import { useStore } from '@nimel/directorr-react'

export type AppInitProps = {
  stores: InitOptions
  LoadingComponent?: ComponentType
  ErrorComponent?: ComponentType<{ store: SomeClassConstructor<any, any> }>
}

const AppInitDefault: FC<AppInitProps> = ({
  stores,
  children,
  LoadingComponent,
  ErrorComponent,
}) => {
  const { isInitComplated, loadStores, storeWithError } = useStore(AppInitStore)

  useEffect(() => {
    loadStores(stores)
  }, [stores, loadStores])

  if (storeWithError) return ErrorComponent ? <ErrorComponent store={storeWithError} /> : null

  if (!isInitComplated) return LoadingComponent ? <LoadingComponent /> : null

  return <>{children}</>
}

export const AppInit = observer(AppInitDefault)
