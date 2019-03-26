import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import factories from '../../__factories__';
import { joinSession } from '../actions';
import JoinSessionForm from '../components/JoinSessionForm';
import JoinSessionFormContainer from './JoinSessionFormContainer';

const job = factories.job.started({ id: 'joinSessionJob' });

const filledStore = {
  jobs: {
    'joinSessionJob': job,
  },
};

const mountContainer = ({ store }) => (
  mount(
    <Provider store={store}>
      <JoinSessionFormContainer />
    </Provider>
  )
);
const setupStore = (initial) => ( configureStore()(initial) );

describe('JoinSessionFormContainer', () => {
  describe('given filled store', () => {
    const store = setupStore(filledStore);

    it('passes job to component', () => {
      const wrapper = mountContainer({ store });
      const wrapped = wrapper.find(JoinSessionForm);

      expect(wrapped.props().joinJob).toEqual(job);
    });
  });

  describe('given empty store', () => {
    const store = setupStore({});

    it('passes undefined as job to component', () => {
      const wrapper = mountContainer({ store });
      const wrapped = wrapper.find(JoinSessionForm);

      expect(wrapped.props().joinJob).toBeUndefined();
    });
  });

  it('dispatches join action on submit', () => {
    const store = setupStore({});

    const wrapper = mountContainer({ store });
    const form = wrapper.find(JoinSessionForm);
    form.props().onSubmit('ABCD');

    const action = store.getActions()[0];
    const expectedAction = joinSession('ABCD', 'joinSessionJob');
    expect(action).toMatchObject(expectedAction);
  });
});
