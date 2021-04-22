import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@nimel/directorr-react';

import TextInput from 'components/TextInput/TextInput';
import Header from './Header/Header';
import Total from './Total/Total';
import TodoList from './TodosList';
import Loading from './Loading/Loading';
import PageStore from './Page.store';
import styles from './Page.css';

const Page: FC = () => {
  const { input } = useStore(PageStore);

  return (
    <div className={styles.container}>
      <Header />
      <section className={styles.todos}>
        <Total />
        <TodoList />
        <TextInput autoFocus placeholder="Whats needs to be done?" store={input} />
        <Loading />
      </section>
    </div>
  );
};

export default observer(Page);
