import { compose } from 'redux';
import { fetchCollection } from '../actions';
import { POLL } from '../constants/entityTypes';
import { getEntitiesOfCollection } from '../selectors';
import connectWithImmutables from '../utils/connectWithImmutables';
import withDependencies from './withDependencies';
import QuestionPollsScreen from '../components/QuestionPollsScreen';

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
  connectWithImmutables(mapStateToProps, mapDispatchToProps),
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
