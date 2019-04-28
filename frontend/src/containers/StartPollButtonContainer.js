import { compose } from 'redux';
import { connect } from 'react-redux';
import { createEntity } from '../actions';
import StartPollButton from '../components/StartPollButton';
import { getJob } from '../selectors';
import withJob from './withJob';
import { POLL } from '../constants/entityTypes';

const mapStateToProps = (state, { question }) => ({
  startPollJob: getJob(state, jobId(question)),
});

const mapDispatchToProps = (dispatch, { question }) => ({
  onStart: () => createPoll(dispatch, question),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withJob(props => props.startPollJob),
)(StartPollButton);

///////////////////////////////////////////////////////////////////////////////

const jobId = (question) => (
  `startPollJob:${question.type}:${question.id}`
);

const createPoll = (dispatch, question) => {
  const poll = {
    type: POLL,
    attributes: { status: 'open' },
    relationships: {
      question: {
        id: question.id,
        type: question.type,
      },
    },
  };
  dispatch(createEntity(poll, jobId(question)))
};
