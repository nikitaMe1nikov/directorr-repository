# Directorr

>Does the same as [Redux](https://github.com/reduxjs/redux), but more OOP and less coding

## Why

Ability to write less code and easily separate business logic from different frameworks(React, Inferno and other).

## What

The design principle is very simple: decorators + action + middleware(and redux like). And it works well with observable libraries like [MobX](https://mobx.js.org/README.html)

## Installation

Run `npm install @nimel/directorr --save` or `yarn add @nimel/directorr` and enable decorators for babel or typescript

## API

### action(type: ActionType)

```javascript
import { action } from "directorr";

const CHANGE_TEXT = 'change_text';

class TodoItem {
  text = ''

  @action(CHANGE_TEXT) toChangeText = (newText) => newText
}

const todo = new TodoItem();

todo.toChangeText('someText');
```

If the decorated property(toChangeText) of the class instance is called, then the action object will be created and dispatched. The action object will have fields:

```javascript
{
  type: CHANGE_TEXT,
  payload: 'someText'
}
```

If toChangeText returns null, then the action will not be dispatched.

### effect(type: ActionType)

```javascript
import { action, effect } from "directorr";

const CHANGE_TEXT = 'change_text';

class TodoItem {
  text = ''

  @action(CHANGE_TEXT) toChangeText = (newText) => newText

  @effect(CHANGE_TEXT) changeText = (newText) => {
    this.text = newText;
  }

  @effect(CHANGE_TEXT) andChangeLog = (newText) => {
    console.log('andChangeSome');
  }
}

const todo = new TodoItem();

todo.toChangeText('someText');

expect(todo.text === 'someText');
```

After calling toChangeText, all property(changeText, andChangeSome) decorated with an effect with the same action type will be called.

### connectStore(prefix: ActionType)

```javascript
import { action, effect, connectStore } from "directorr";

const CHANGE_TEXT = 'change_text';

class TodoItem {
  text = ''

  @action(CHANGE_TEXT) toChangeText = (newText) => newText

  @effect(CHANGE_TEXT) changeText = (newText) => {
    this.text = newText;
  }
}

class Store {
  someText = ''

  @connectStore(CHANGE_TEXT) todo = new TodoItem()

  @effect([TodoItem, CHANGE_TEXT])
  changeText = (newText) => {
    this.someText = newText;
  }
}

const store = new Store();

store.todo.toChangeText('someText');

expect(store.someText === 'someText');
```

Dispatch all actions from TodoItem in the Store.

### Directorr

```javascript
import { action, effect, Directorr } from "directorr";

const CHANGE_TEXT = 'change_text';

class TodoItem {
  text = ''

  @action(CHANGE_TEXT) toChangeText = (newText) => newText

  @effect(CHANGE_TEXT) changeText = (newText) => {
    this.text = newText;
  }
}

const director = new Directorr();

const logMiddleware = () => (next: any) => (action: any) => {
  console.log('log action:', action);
  next(action);
};

director.addReduxMiddlewares(logMiddleware);

director.addStores(PageStore, TotalStore);

const todo = director.stores.get(TodoItem);

todo.toChangeText('someText');

expect(todo.text === 'someText');
```
`
  log action: {type: "change_text", payload: 'someText'}
`

### injectStore(class: DirectorrStoreClass)

```javascript
import { action, effect, Directorr } from "directorr";

const ACTION_ONE = 'action_one';

class FirstStore {
  text = ''

  @action(ACTION_ONE) toChangeText = (newText) => newText

  @effect(ACTION_ONE) changeText = (newText) => {
    this.text = newText;
  }
}

const ACTION_TWO = 'action_two';

class SecondStore {
  @injectStore(OneStore) injectFirstStore: FirstStore

  text = ''

  @action(ACTION_TWO) toChangeText = (newText) => newText

  @effect(ACTION_TWO) changeText = (newText) => {
    this.text = newText;
  }
}

const director = new Directorr();

director.addStores(FirstStore, SecondStore);

const firstStore = director.stores.get(FirstStore);
const secondStore = director.stores.get(SecondStore);

firstStore.toChangeText('someText');

expect(firstStore.text === 'someText');
expect(secondStore.injectFirstStore.text === 'someText');
```

## Examples

- [**ToDoExample**](https://github.com/nikitaMe1nikov/directorr-todo-example)

## License

[MIT](LICENSE)