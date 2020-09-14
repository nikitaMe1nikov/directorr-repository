import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@nimel/directorr-react';

import TodoItem from './TodoItem/TodoItem';
import PageStore from './PageStore';

const TodosList: FC = () => {
  const { todos, removeTodo, todosStore } = useStore(PageStore);

  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          item={todo}
          removeTodo={removeTodo}
          checkedTodo={todosStore.changeTodoToggle}
        />
      ))}
    </div>
  );
};

export default observer(TodosList);
