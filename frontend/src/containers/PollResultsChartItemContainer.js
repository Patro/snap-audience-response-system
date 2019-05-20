import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchEntity } from '../actions';
import { getEntity } from '../selectors';
import PollResultsChartItem from '../components/PollResultsChartItem';
import withDependencies from './withDependencies';

const mapStateToProps = (state, { questionOptionCount }) => ({
  questionOption: getEntity(
    state, getQuestionOptionIdentifier(questionOptionCount)
  ),
});

const mapDispatchToProps = (dispatch, { questionOptionCount }) => ({
  onRefresh: () => fetchQuestionOption(dispatch, questionOptionCount),
});

const shouldRefresh = (prev, next) => (
  !getQuestionOptionIdentifier(prev.questionOptionCount).equals(
    getQuestionOptionIdentifier(next.questionOptionCount)
  )
);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
)(PollResultsChartItem);

///////////////////////////////////////////////////////////////////////////////

const fetchQuestionOption = (dispatch, questionOptionCount) => {
  const questionOption = getQuestionOptionIdentifier(questionOptionCount);
  return dispatch(
    fetchEntity(questionOption.get('type'), questionOption.get('id'))
  );
};

const getQuestionOptionIdentifier = (questionOptionCount) => (
  questionOptionCount.getIn(['relationships', 'questionOption'])
);
