import { connect } from 'react-redux';
import { fetchEntity } from '../actions';
import { getEntity } from '../selectors';
import PollResultsChartItem from '../components/PollResultsChartItem';

const mapStateToProps = (state, { questionOptionCount }) => ({
  questionOption: getEntity(
    state, questionOptionCount.relationships.questionOption
  ),
});

const mapDispatchToProps = (dispatch, { questionOptionCount }) => ({
  onRefresh: () => fetchQuestionOption(dispatch, questionOptionCount),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PollResultsChartItem);

///////////////////////////////////////////////////////////////////////////////

const fetchQuestionOption = (dispatch, questionOptionCount) => {
  const questionOption = questionOptionCount.relationships.questionOption;
  return dispatch(fetchEntity(questionOption.type, questionOption.id));
};
