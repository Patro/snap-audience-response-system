import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

class AbstractTestWrapper {
  constructor({ props = {}, store = {}, location = {} } = {}) {
    this.props = props;
    this.store = store;
    this.location = location;
  }

  get store() {
    return this._store;
  }

  set store(store) {
    this._store = configureStore()(store)
  }

  get wrapper() {
    if (this._wrapper === undefined) {
      this._wrapper = this._render();
    }
    return this._wrapper;
  }

  render() {
    return this.wrapper;
  }

  _render() {
    throw new Error('_render method is not implemented');
  }

  _addStoreProvider(children) {
    return (
      <Provider store={this.store}>
        {children}
      </Provider>
    )
  }

  _addStaticRouter(children) {
    return (
      <StaticRouter location={this.location} context={ {} }>
        {children}
      </StaticRouter>
    )
  }
}

export default AbstractTestWrapper;
