import React, { useCallback, FC } from 'react';
import { SimpleToggle } from 'components/Toggle/Toggle';
import { observer } from 'mobx-react-lite';
import TodoItemStore from 'page/TodoItem/TodoItemStore';
import styles from './TodoItem.css';

const TodoItem: FC<{
  item: TodoItemStore;
  removeTodo: (todo: any) => void;
  checkedTodo: (id: string, checked: boolean) => void;
}> = ({ item, removeTodo, checkedTodo }) => {
  const onRemove = useCallback(() => {
    removeTodo(item);
  }, [item, removeTodo]);
  const onChecked = useCallback(() => {
    checkedTodo(item.id, !item.checked);
  }, [item, checkedTodo]);

  return (
    <div className={styles.container}>
      <SimpleToggle value={item.checked} onChange={onChecked} />
      <div className={styles.text}>{item.text}</div>
      <button className={styles.button} type="button" onClick={onRemove}>
        𐄂
      </button>
    </div>
  );
};

export default observer(TodoItem);
