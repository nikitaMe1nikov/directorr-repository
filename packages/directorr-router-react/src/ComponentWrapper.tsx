import { FC, memo, ComponentType } from 'react'

const ComponentWrapper: FC<{ component: ComponentType<any> }> = ({ component: SomeComponent }) => (
  <SomeComponent />
)

export default memo(ComponentWrapper)
