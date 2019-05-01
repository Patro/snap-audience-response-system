import { connect } from 'react-redux';
import { fetchCollection } from '../actions';
import { POLL } from '../constants/entityTypes';
import { getEntitiesOfCollection } from '../selectors';
import QuestionPollsScreen from '../components/QuestionPollsScreen';

const mapStateToProps = (state, { question }) => ({
  polls: getPolls(state, question),
});

const mapDispatchToProps = (dispatch, { question }) => ({
  onRefresh: () => fetchPolls(dispatch, question),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuestionPollsScreen);

///////////////////////////////////////////////////////////////////////////////

const getPolls = (state, question) => (
  getEntitiesOfCollection(state, POLL, buildFilterParams(question))
);

const fetchPolls = (dispatch, question) => (
  dispatch(fetchCollection(POLL, buildFilterParams(question)))
);

const buildFilterParams = (question) => ({
  questionId: question.id
});
