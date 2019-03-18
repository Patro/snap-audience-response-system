import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epics';
import rootReducer from './reducers';

const epicMiddleware = createEpicMiddleware({
  dependencies: { api: {} }
});

export default () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(epicMiddleware)
  );

  epicMiddleware.run(rootEpic);

  return store;
};
