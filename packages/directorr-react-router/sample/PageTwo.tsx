import React, { FC } from 'react';
import { HistoryStore } from '@nimel/directorr-router';
import { Router, ANIMATIONS } from '../src';
import { useStore } from './utils';
import PageThree from './PageThree';
import PageFour from './PageFour';
// eslint-disable-next-line css-modules/no-unused-class
import styles from './index.css';

const routes = [
  {
    path: '/two',
    component: PageThree,
  },
  {
    path: '/two/four',
    component: PageFour,
  },
];

const PageTwo: FC = () => {
  const router = useStore(HistoryStore);

  return (
    <div className={styles.container}>
      <button onClick={() => router.push('/')}>PageTwo</button>
      <div className={styles.sub_container}>
        <Router animation={ANIMATIONS.FADE} routes={routes} />
      </div>
    </div>
  );
};

export default PageTwo;
