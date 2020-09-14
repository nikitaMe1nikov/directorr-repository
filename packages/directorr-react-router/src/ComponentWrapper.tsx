import React, { FC, memo } from 'react';

import { RouteComponentType } from './types';

const ComponentWrapper: FC<{ component: RouteComponentType }> = ({ component: SomeComponent }) => (
  <SomeComponent />
);

export default memo(ComponentWrapper);
