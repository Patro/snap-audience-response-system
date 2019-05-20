import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import Immutable from 'immutable';
import rootEpic from './epics';
import rootReducer from './reducers';
import api from './api';

const configureStore = (history) => {
  const initialState = Immutable.Map();

  const epicMiddleware = createEpicMiddleware({
    dependencies: { api, history: { push: history.push } },
  });

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(epicMiddleware)),
  );

  epicMiddleware.run(rootEpic);

  return store;
};

export default configureStore;
