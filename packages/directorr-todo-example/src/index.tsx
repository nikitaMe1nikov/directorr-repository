import './config';
import React from 'react';
import ReactDOM from 'react-dom';
import { Directorr } from '@nimel/directorr';
import { DirectorrProvider } from '@nimel/directorr-react';
import createSagaMiddleware from 'redux-saga';
import { logMiddleware } from '@nimel/directorr-middlewares';

import Page from 'page/Page';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
const director = new Directorr();

director.addMiddlewares(logMiddleware);
director.addReduxMiddlewares(sagaMiddleware);
sagaMiddleware.run(sagas);

const app = (
  <DirectorrProvider value={director}>
    <Page />
  </DirectorrProvider>
);

ReactDOM.render(app, document.getElementById('app'));
