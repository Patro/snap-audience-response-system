import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epics';
import rootReducer from './reducers';
import api from './api';

const configureStore = (history) => {
  const epicMiddleware = createEpicMiddleware({
    dependencies: { api, history: { push: history.push } },
  });

  const store = createStore(
    rootReducer,
    applyMiddleware(epicMiddleware)
  );

  epicMiddleware.run(rootEpic);

  return store;
};

export default configureStore;
