import React, { FC } from 'react';
import { HistoryStore } from '@nimel/directorr-router';
import { useStore } from './utils';
// eslint-disable-next-line css-modules/no-unused-class
import styles from './index.css';

const PageThree: FC = () => {
  const router = useStore(HistoryStore);

  return (
    <div className={styles.page_three}>
      <button onClick={() => router.push('/two/four')}>PageThree</button>
    </div>
  );
};

export default PageThree;
