import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import ToggleStore from './ToggleStore';
import styles from './Toggle.css';

interface SimpleToggleProps {
  className?: string;
  value: any;
  onChange: (e: any) => any;
  disabled?: boolean;
}

const TYPE = 'checkbox';

export const SimpleToggle: FC<SimpleToggleProps> = ({ className, value, onChange, disabled }) => (
  <label className={clsx([styles.container, className])}>
    <input type={TYPE} checked={value} onChange={onChange} disabled={disabled} />
    <span className={styles.check} />
  </label>
);

const Toggle: FC<{ className?: string; store: ToggleStore }> = ({ className, store }) => (
  <SimpleToggle
    className={className}
    value={store.value}
    onChange={store.onChange}
    disabled={store.disabled}
  />
);

export default observer(Toggle);
