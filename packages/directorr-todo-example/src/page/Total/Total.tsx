import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@nimel/directorr-react';
import clsx from 'clsx';
import Toggle from 'components/Toggle/Toggle';
import { FILTER_TYPE } from 'page/PageStore';
import TotalStore from './TotalStore';
import styles from './Total.css';

const Total: FC = () => {
  const { clearComplated, allToggle } = useStore(TotalStore);

  return (
    <div className={styles.container}>
      <Toggle store={allToggle} />
      <Filters />
      <button type="button" className={styles.clear_button} onClick={clearComplated}>
        Clear completed
      </button>
    </div>
  );
};

export default observer(Total);

const FiltersUncompose: FC = () => {
  const { filter, changeFilterToAll, changeFilterToActive, changeFilterToComplated } = useStore(
    TotalStore
  );

  return (
    <div className={styles.buttons}>
      <button
        type="button"
        className={clsx([
          styles.filter_button,
          filter === FILTER_TYPE.ALL ? styles.filter_button__active : null,
        ])}
        onClick={changeFilterToAll}
      >
        All
      </button>
      <button
        type="button"
        className={clsx([
          styles.filter_button,
          filter === FILTER_TYPE.ACTIVE ? styles.filter_button__active : null,
        ])}
        onClick={changeFilterToActive}
      >
        Active
      </button>
      <button
        type="button"
        className={clsx([
          styles.filter_button,
          filter === FILTER_TYPE.COMPLATED ? styles.filter_button__active : null,
        ])}
        onClick={changeFilterToComplated}
      >
        Complated
      </button>
    </div>
  );
};

export const Filters = observer(FiltersUncompose);
