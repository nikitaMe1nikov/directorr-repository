import { FC } from 'react'
import clsx from 'clsx'
import styles from './Loader.css'

const Loader: FC<{ className?: string }> = ({ className }) => (
  <div className={clsx([styles.container, className])}>
    <div className={styles.ball_1} />
    <div className={styles.ball_2} />
    <div className={styles.ball_3} />
  </div>
)

export default Loader
