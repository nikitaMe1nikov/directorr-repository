import React, { FC } from 'react';
import { HistoryStore } from '@nimel/directorr-router';
// eslint-disable-next-line css-modules/no-unused-class
import styles from './index.css';
import { useStore } from './utils';

const PageOne: FC = () => {
  const router = useStore(HistoryStore);

  return (
    <div className={styles.page_one}>
      <button onClick={() => router.push('/two')}>PageOne</button>
    </div>
  );
};

export default PageOne;
