# dirrector-react

React bindings for [Directorr](https://github.com/nikitaMe1nikov/directorr).  

## Installation

dirrector-react tested on React 16.8.3 or later, but maybe it works on earlier versions.

Run `npm install @nimel/directorr-react --save` or `yarn add @nimel/directorr-react --save`

## API

### useLocalStore(class: ISomeClass)

Returns an instance of the class that will be preserved during the whole lifetime of the component.

```javascript
import { createContext } from 'react';
import { useLocalStore } from 'directorr-react';
import PageStore from './PageStore';

const Page = () => {
  const {
    value,
  } = useLocalStore(PageStore);

  return (
    <div>
      {value}
    </div>
  );
};
```

### createUseStoreHooks(context: Context)

Returns a hook that returns an instance of the class from the stores of the Director.

```javascript
import { createContext } from 'react';
import { createUseStoreHooks } from 'directorr-react';
import PageStore from './PageStore';

const context = createContext(null);
const { Provider } = context;
const useStore = createUseStoreHooks(context);
const director = new Directorr();

director.addStores(PageStore);

const Page = () => {
  const {
    value,
  } = useStore(PageStore);

  return (
    <div>
      {value}
    </div>
  );
};

const app = (
  <Provider value={director}>
    <Page />
  </Provider>
);

ReactDOM.render(app, document.getElementById('app'));
```

### createUseTempStoreHooks(context: Context)

Returns an instance of the class that will be preserved during the whole lifetime of the component. And all the actions are dispatch to the director.

```javascript
import { createContext } from 'react';
import { createUseTempStoreHooks } from 'directorr-react';
import PageStore from './PageStore';

const context = createContext(null);
const { Provider } = context;
const useTempStore = createUseTempStoreHooks(context);
const director = new Directorr();

const Page = () => {
  const {
    value,
  } = useTempStore(PageStore);

  return (
    <div>
      {value}
    </div>
  );
};

const app = (
  <Provider value={director}>
    <Page />
  </Provider>
);

ReactDOM.render(app, document.getElementById('app'));
```

### createHooks

Creates context and hooks.

```javascript
import { createHooks } from 'directorr-react';
import PageStore from './PageStore';

const {
  Provider,
  useStore,
  useLocalStore,
  useTempStore,
} = createHooks();
const director = new Directorr();

const Page = () => {
  const {
    value,
  } = useLocalStore(PageStore);

  return (
    <div>
      {value}
    </div>
  );
};
```

## Examples

- [**ToDoExample**](https://github.com/nikitaMe1nikov/directorr-todo-example)

## License

[MIT](LICENSE)