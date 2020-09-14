# directorr-next

> Directorr HOC for Next.js

## Installation

Run `npm install @nimel/directorr-next --save` or `yarn add @nimel/directorr-next`

## API

### nextWithDirectorr(ReactComponent)

Commonly used in _app.js

```javascript
import createSagaMiddleware from 'redux-saga';
import App from 'next/app';
import nextWithDirectorr, { MakeDirectorr, IWithDirectorrAppProps } from '@nimel/directorr-next';

export const makeDirectorr: MakeDirectorr = (ctx, initialState?: IDirectorrStoresState) => {
  const sagaMiddleware = createSagaMiddleware();
  const logMiddleware = createLogMiddleware();
  const directorr = new Directorr();

  directorr.addInitState(initialState);

  directorr.addReduxMiddlewares(logMiddleware, sagaMiddleware);
  sagaMiddleware.run(sagas);

  return directorr;
};

class CustomApp extends App<IWithDirectorrAppProps> {
  render() {
    const { Component } = this.props;

    return (
      <>
        <Head>
          <title>aggregion-test</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component />
      </>
    );
  }
}

export default nextWithDirectorr(makeDirectorr)(CustomApp);
```

And in some page file

```javascript
import { useTempStore } from '@nimel/directorr-react';
import { IDirectorr } from '@nimel/directorr';
import { observer } from 'mobx-react-lite';
import AppStore from 'stores/AppStore';

function ListItem({ job }) {
  return <li>{`${job.title}`}</li>;
}

function App() {
  const { somedata } = useTempStore(AppStore);
  return (
    <div>
      {somedata}
    </div>
  );
}

App.whenLoadDirectorr = async (directorr: IDirectorr) => {
  directorr.addStores(AppStore);
};

export default observer(App);
```

## License

[MIT](LICENSE)