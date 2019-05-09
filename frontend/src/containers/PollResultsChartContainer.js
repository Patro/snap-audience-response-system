import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchCollection, fetchEntity } from '../actions';
import { QUESTION_OPTION_COUNT } from '../constants/entityTypes';
import { getEntity, getEntitiesOfCollection } from '../selectors';
import PollResultsChart from '../components/PollResultsChart';
import withDependencies from './withDependencies';

const mapStateToProps = (state, { poll }) => ({
  question: getEntity(state, poll.relationships.question),
  questionOptionCounts: getCounts(state, poll),
});

const mapDispatchToProps = (dispatch, { poll }) => ({
  onRefresh: () => fetchDependencies(dispatch, poll),
});

const shouldRefresh = (prev, next) => prev.poll.id !== next.poll.id;

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
  dispatch(fetchEntity(poll.type, poll.id));
  const question = poll.relationships.question;
  dispatch(fetchEntity(question.type, question.id));
  dispatch(
    fetchCollection(QUESTION_OPTION_COUNT, buildCountsFilterParams(poll))
  );
};

const buildCountsFilterParams = (poll) => ({
  pollId: poll.id
});
