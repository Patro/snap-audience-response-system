import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchEntity } from '../actions';
import { getEntity } from '../selectors';
import PollResultsChartItem from '../components/PollResultsChartItem';
import withDependencies from './withDependencies';

const mapStateToProps = (state, { questionOptionCount }) => ({
  questionOption: getEntity(
    state, getQuestionOption(questionOptionCount)
  ),
});

const mapDispatchToProps = (dispatch, { questionOptionCount }) => ({
  onRefresh: () => fetchQuestionOption(dispatch, questionOptionCount),
});

const shouldRefresh = (prev, next) => (
  !isEqualIdentifier(
    getQuestionOption(prev.questionOptionCount),
    getQuestionOption(next.questionOptionCount)
  )
);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
)(PollResultsChartItem);

///////////////////////////////////////////////////////////////////////////////

const fetchQuestionOption = (dispatch, questionOptionCount) => {
  const questionOption = getQuestionOption(questionOptionCount);
  return dispatch(fetchEntity(questionOption.type, questionOption.id));
};

const getQuestionOption = (questionOptionCount) => (
  questionOptionCount.relationships.questionOption
);

const isEqualIdentifier = (a, b) => (
  a.id === b.id && a.type === b.type
);
