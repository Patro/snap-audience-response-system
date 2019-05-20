import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchCollection } from '../actions';
import { POLL } from '../constants/entityTypes';
import { getEntitiesOfCollection } from '../selectors';
import QuestionPollsScreen from '../components/QuestionPollsScreen';
import withDependencies from './withDependencies';

const mapStateToProps = (state, { question }) => ({
  polls: getPolls(state, question),
});

const mapDispatchToProps = (dispatch, { question }) => ({
  onRefresh: () => fetchPolls(dispatch, question),
});

const shouldRefresh = (prev, next) => (
  prev.question.get('id') !== next.question.get('id')
)

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
)(QuestionPollsScreen);

///////////////////////////////////////////////////////////////////////////////

const getPolls = (state, question) => (
  getEntitiesOfCollection(state, POLL, buildFilterParams(question))
);

const fetchPolls = (dispatch, question) => (
  dispatch(fetchCollection(POLL, buildFilterParams(question)))
);

const buildFilterParams = (question) => ({
  questionId: question.get('id'),
});
