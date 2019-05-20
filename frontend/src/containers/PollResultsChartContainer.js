import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchCollection, fetchEntity } from '../actions';
import { QUESTION_OPTION_COUNT } from '../constants/entityTypes';
import { getEntity, getEntitiesOfCollection } from '../selectors';
import PollResultsChart from '../components/PollResultsChart';
import withDependencies from './withDependencies';

const mapStateToProps = (state, { poll }) => ({
  question: getEntity(state, poll.getIn(['relationships', 'question'])),
  questionOptionCounts: getCounts(state, poll),
});

const mapDispatchToProps = (dispatch, { poll }) => ({
  onRefresh: () => fetchDependencies(dispatch, poll),
});

const shouldRefresh = (prev, next) =>
  prev.poll.get('id') !== next.poll.get('id');

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
)(PollResultsChart);

///////////////////////////////////////////////////////////////////////////////

const getCounts = (state, poll) => (
  getEntitiesOfCollection(
    state, QUESTION_OPTION_COUNT, buildCountsFilterParams(poll)
  )
);

const fetchDependencies = (dispatch, poll) => {
  dispatch(fetchEntity(poll.get('type'), poll.get('id')));
  const question = poll.getIn(['relationships', 'question']);
  dispatch(fetchEntity(question.get('type'), question.get('id')));
  dispatch(
    fetchCollection(QUESTION_OPTION_COUNT, buildCountsFilterParams(poll))
  );
};

const buildCountsFilterParams = (poll) => ({
  pollId: poll.get('id')
});
