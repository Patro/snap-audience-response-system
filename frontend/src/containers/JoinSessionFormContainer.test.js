import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { JOIN_SESSION } from '../actions';
import JoinSessionForm from '../components/JoinSessionForm';
import JoinSessionFormContainer from './JoinSessionFormContainer';

const mountContainer = (props) => (
  mount(
    <Provider store={props.store}>
      <JoinSessionFormContainer />
    </Provider>
  )
);
const setupStore = () => ( configureStore()({}) );

describe('JoinSessionFormContainer', () => {
  describe('submit', () => {
    it('dispatches join action on submit', () => {
      const store = setupStore();

      const wrapper = mountContainer({ store });
      const form = wrapper.find(JoinSessionForm);
      form.props().onSubmit('ABCD');

      const action = store.getActions()[0];
      const expectedAction = { type: JOIN_SESSION, attendanceCode: 'ABCD' };
      expect(action).toMatchObject(expectedAction);
    });
  });
});
