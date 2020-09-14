import React from 'react';
import ReactDOM from 'react-dom';
import { Directorr } from '@nimel/directorr';
import { HistoryStore, historyChange } from '@nimel/directorr-router';
import { Router, RouterStore, RouterProvider } from '../src';
import './index.css';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
import logMiddleware from './logMiddleware';
import { Provider } from './utils';

class TestStore {
  @historyChange('/two')
  ToAction = (payload: any) => {
    console.log('ToAction', payload);
  };
}

const director = new Directorr();

director.addReduxMiddlewares(logMiddleware);
director.addStores(HistoryStore, RouterStore, TestStore);

const routes = [
  {
    path: '/',
    component: PageOne,
  },
  {
    path: '/two(.*)',
    component: PageTwo,
  },
];

const app = (
  <Provider value={director}>
    <RouterProvider value={director}>
      <Router routes={routes} />
    </RouterProvider>
  </Provider>
);

ReactDOM.render(app, document.getElementById('app'));
