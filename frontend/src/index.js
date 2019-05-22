import * as Sentry from '@sentry/browser';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './index.css';
import App from './components/App';
import configureStore from './configureStore';

Sentry.init({
  dsn: 'https://27601cbc6b7a47a9a2845b3777c1aea5@sentry.io/1465698'
});

const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={configureStore(history)}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
