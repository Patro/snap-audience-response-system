import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import factories from '../../__factories__';
import { startSession } from '../actions';
import StartSessionForm from '../components/StartSessionForm';
import StartSessionFormContainer from './StartSessionFormContainer';

const job = factories.job.started({ id: 'startSessionJob' });

const filledStore = {
  jobs: {
    'startSessionJob': job,
  },
};

const mountContainer = ({ store }) => (
  mount(
    <Provider store={store}>
      <StartSessionFormContainer />
    </Provider>
  )
);
const setupStore = (initial) => ( configureStore()(initial) );

describe('StartSessionFormContainer', () => {
  describe('given filled store', () => {
    const store = setupStore(filledStore);

    it('passes job to component', () => {
      const wrapper = mountContainer({ store });
      const wrapped = wrapper.find(StartSessionForm);

      expect(wrapped.props().startJob).toEqual(job);
    });
  });

  describe('given empty store', () => {
    const store = setupStore({});

    it('passes undefined as job to component', () => {
      const wrapper = mountContainer({ store });
      const wrapped = wrapper.find(StartSessionForm);

      expect(wrapped.props().startJob).toBeUndefined();
    });
  });

  it('dispatches start action on submit', () => {
    const store = setupStore({});

    const wrapper = mountContainer({ store });
    const form = wrapper.find(StartSessionForm);
    form.props().onSubmit('My Super Session');

    const action = store.getActions()[0];
    const expectedAction = startSession('My Super Session', 'startSessionJob');
    expect(action).toMatchObject(expectedAction);
  });
});
