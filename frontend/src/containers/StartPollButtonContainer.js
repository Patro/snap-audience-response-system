import Immutable from 'immutable';
import { compose } from 'redux';
import { createEntity } from '../actions';
import StartPollButton from '../components/StartPollButton';
import { getJob } from '../selectors';
import connectWithImmutables from '../utils/connectWithImmutables';
import withJob from './withJob';
import { POLL } from '../constants/entityTypes';

const mapStateToProps = (state, { question }) => ({
  startPollJob: getJob(state, jobId(question)),
});

const mapDispatchToProps = (dispatch, { question }) => ({
  onStart: () => createPoll(dispatch, question),
});

export default compose(
  connectWithImmutables(mapStateToProps, mapDispatchToProps),
  withJob(props => props.startPollJob),
)(StartPollButton);

///////////////////////////////////////////////////////////////////////////////

const jobId = (question) => (
  `startPollJob:${question.get('type')}:${question.get('id')}`
);

const createPoll = (dispatch, question) => {
  const poll = Immutable.fromJS({
    type: POLL,
    attributes: { status: 'open' },
    relationships: {
      question: {
        id: question.get('id'),
        type: question.get('type'),
      },
    },
  });
  dispatch(createEntity(poll, jobId(question)))
};
