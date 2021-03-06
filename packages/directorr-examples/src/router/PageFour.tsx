import React, { FC } from 'react';
import { HistoryStore } from '@nimel/directorr-router-react';
import { useStore } from '@nimel/directorr-react';
// eslint-disable-next-line css-modules/no-unused-class
import styles from './index.css';

const PageFour: FC = () => {
  const router = useStore(HistoryStore);

  return (
    <div className={styles.page_four}>
      <button onClick={() => router.push('/two')}>PageFour</button>
    </div>
  );
};

export default PageFour;
