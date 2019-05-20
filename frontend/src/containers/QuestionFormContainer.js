import Immutable from 'immutable';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchCollection, fetchEntity, saveQuestion } from '../actions';
import {
  QUESTION_OPTION,
  SINGLE_CHOICE_QUESTION,
  MULTIPLE_CHOICE_QUESTION,
} from '../constants/entityTypes';
import { getEntitiesOfCollection, getEntity, getJob } from '../selectors';
import QuestionForm from '../components/QuestionForm';
import withDependencies from './withDependencies';
import withJob from './withJob';

const mapStateToProps = (state, { match: { params } }) => {
  const saveJob = getJob(state, saveQuestionJobId);
  if (saveJob !== undefined) {
    return mapJobToProps(saveJob);
  }

  if (isInEditMode(params)) {
    const questionIdentifier = getIdentifierOfQuestion(params);
    return mapStateToPropsWithQuestionIdentifier(state, questionIdentifier);
  }

  return {};
};

const mapJobToProps = (saveJob) => ({
  saveJob,
  question: saveJob.getIn(['trigger', 'question']),
  options: saveJob.getIn(['trigger', 'options']),
});

const mapStateToPropsWithQuestionIdentifier = (state, questionIdentifier) => ({
  question: getEntity(state, questionIdentifier),
  options: getOptionsOfQuestion(state, questionIdentifier)
});

const mapDispatchToProps = (dispatch, { match: { params } }) => ({
  onRefresh: onRefreshHandler(dispatch, params),
  onSubmit: (data) => (
    dispatch(
      saveQuestion(data.get('question'), data.get('options'), saveQuestionJobId)
    )
  ),
});

const shouldRefresh = (prev, next) => (
  isInEditMode(prev.match.params) &&
  !getIdentifierOfQuestion(prev.match.params).equals(
    getIdentifierOfQuestion(next.match.params)
  )
);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
  withJob(props => props.saveJob),
)(QuestionForm);

///////////////////////////////////////////////////////////////////////////////

const saveQuestionJobId = 'saveQuestionJob';

const isInEditMode = (params) => (
  params.questionId !== undefined && params.questionType !== undefined
);

const getIdentifierOfQuestion = (params) => {
  return Immutable.fromJS({
    id: params.questionId,
    type: getTypeOfQuestion(params),
  });
};

const getTypeOfQuestion = (params) => {
  switch(params.questionType) {
    case 'single_choice':
      return SINGLE_CHOICE_QUESTION;
    case 'multiple_choice':
      return MULTIPLE_CHOICE_QUESTION;
    default:
      return;
  }
};

const getOptionsOfQuestion = (state, questionIdentifier) => (
  getEntitiesOfCollection(
    state, QUESTION_OPTION, buildFilterParams(questionIdentifier)
  )
);

const onRefreshHandler = (dispatch, params) => {
  if (isInEditMode(params)) {
    const questionIdentifier = getIdentifierOfQuestion(params);
    return () => fetchQuestionAndOptions(dispatch, questionIdentifier);
  }
  return () => {};
};

const fetchQuestionAndOptions = (dispatch, identifier) => {
  dispatch(fetchEntity(identifier.get('type'), identifier.get('id')));
  dispatch(fetchCollection(QUESTION_OPTION, buildFilterParams(identifier)));
};

const buildFilterParams = (questionIdentifier) => ({
  questionId: questionIdentifier.get('id'),
});
