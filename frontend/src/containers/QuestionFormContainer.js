import { connect } from 'react-redux';
import get from 'lodash/get';
import { fetchCollection, fetchEntity, saveQuestion } from '../actions';
import {
  QUESTION_OPTION,
  SINGLE_CHOICE_QUESTION,
  MULTIPLE_CHOICE_QUESTION
} from '../constants/entityTypes';
import { getEntitiesOfCollection, getEntity, getJob } from '../selectors';
import QuestionForm from '../components/QuestionForm';

const mapStateToProps = (state, { match }) => {
  const saveJob = getJob(state, saveQuestionJobId);
  if (saveJob !== undefined) {
    return {
      saveJob,
      question: saveJob.trigger.question,
      options: saveJob.trigger.options,
    }
  }

  const questionIdentifier = getIdentifierOfQuestion(match);
  if (questionIdentifier !== undefined) {
    return {
      question: getEntity(state, questionIdentifier),
      options: getOptionsOfQuestion(state, questionIdentifier)
    };
  }

  return {};
};

const mapDispatchToProps = (dispatch, { match }) => {
  const props = {
    onSubmit: ({ question, options }) => (
      dispatch(saveQuestion(question, options, saveQuestionJobId))
    ),
  };

  const questionIdentifier = getIdentifierOfQuestion(match);
  if (questionIdentifier !== undefined) {
    props.onRefresh = () => fetchQuestionAndOptions(dispatch, questionIdentifier);
  }
  else {
    props.onRefresh = () => {};
  }

  return props;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionForm);

///////////////////////////////////////////////////////////////////////////////

const saveQuestionJobId = 'saveQuestionJob';

const getIdentifierOfQuestion = (match) => {
  if (!get(match, 'params.questionId')) { return; }
  if (!get(match, 'params.questionType')) { return; }

  return {
    id: match.params.questionId,
    type: getTypeOfQuestion(match),
  }
};

const getTypeOfQuestion = (match) => {
  switch(match.params.questionType) {
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

const fetchQuestionAndOptions = (dispatch, identifier) => {
  dispatch(fetchEntity(identifier.type, identifier.id));
  dispatch(fetchCollection(QUESTION_OPTION, buildFilterParams(identifier)));
};

const buildFilterParams = (questionIdentifier) => ({
  questionId: questionIdentifier.id,
});
