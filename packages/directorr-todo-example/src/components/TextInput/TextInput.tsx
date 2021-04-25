import React, { useCallback, FC } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import TextInputStore from './TextInput.store';
import styles from './TextInput.css';

interface TextInputProps {
  className?: string;
  placeholder?: string;
  store: TextInputStore;
  autoFocus: boolean;
}

const ENTER_KEY = 13;

const TextInput: FC<TextInputProps> = ({ className, placeholder, store, autoFocus }) => {
  const onKeyDown = useCallback(
    ({ keyCode }) => {
      if (keyCode === ENTER_KEY) store.onComplate();
    },
    [store]
  );

  return (
    <input
      className={clsx([className, styles.input])}
      value={store.value}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      onChange={store.onChange}
      disabled={store.disabled}
      autoFocus={autoFocus}
    />
  );
};

export default observer(TextInput);
