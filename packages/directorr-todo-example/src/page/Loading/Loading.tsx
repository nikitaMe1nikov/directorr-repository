import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@nimel/directorr-react';

import Loader from 'components/Loader/Loader';
import PageStore from '../PageStore';
import styles from './Loading.css';

const Loading: FC = () => {
  const { isLoading } = useStore(PageStore);

  if (isLoading) {
    return <Loader className={styles.container} />;
  }

  return null;
};

export default observer(Loading);
