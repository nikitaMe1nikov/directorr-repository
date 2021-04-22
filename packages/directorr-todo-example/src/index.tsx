import './config';
import React from 'react';
import ReactDOM from 'react-dom';
import { DirectorrProvider } from '@nimel/directorr-react';
import createSagaMiddleware from 'redux-saga';
import { logMiddleware, createConnectorToReduxDevTool } from '@nimel/directorr-middlewares';
import { Directorr } from '@nimel/directorr';

import Page from 'page/Page';
import sagas from './sagas';

const isDev = process.env.NODE_ENV === 'development';

const sagaMiddleware = createSagaMiddleware();
const director = new Directorr();

director.addMiddlewares([logMiddleware, createConnectorToReduxDevTool()]);
director.addReduxMiddlewares([sagaMiddleware]);
let sagaTask = sagaMiddleware.run(sagas);

if (import.meta.webpackHot) {
  import.meta.webpackHot?.accept('./sagas', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const getNewSagas = require('./sagas').default;
    sagaTask.cancel();
    sagaTask.toPromise().then(() => {
      sagaTask = sagaMiddleware.run(getNewSagas);
    });
  });
}

if (isDev) {
  (window as any).dirtr = director;
}

const app = (
  <DirectorrProvider value={director}>
    <Page />
  </DirectorrProvider>
);

ReactDOM.render(app, document.getElementById('app'));
