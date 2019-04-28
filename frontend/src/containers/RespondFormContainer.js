import { compose } from 'redux';
import { connect } from 'react-redux';
import { createEntity, fetchCollection, fetchEntity } from '../actions';
import RespondForm from '../components/RespondForm';
import { QUESTION_OPTION, RESPONSE } from '../constants/entityTypes';
import { getEntity, getEntitiesOfCollection, getJob } from '../selectors';
import withJob from './withJob';

const mapStateToProps = (state, { poll }) => {
  const questionIdentifier = getIdentifierOfQuestion(poll);
  return {
    question: getEntity(state, questionIdentifier),
    options: getOptionsOfQuestion(state, questionIdentifier),
    respondJob: getJob(state, respondJobId),
  };
};

const mapDispatchToProps = (dispatch, { poll }) => {
  const questionIdentifier = getIdentifierOfQuestion(poll);
  return {
    onRefresh: () => fetchQuestionAndOptions(dispatch, questionIdentifier),
    onSubmit: (optionsIds) =>
      createResponses(dispatch, poll, optionsIds),
  }
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withJob(props => props.respondJob),
)(RespondForm);

///////////////////////////////////////////////////////////////////////////////

const respondJobId = 'respondJob';

const getIdentifierOfQuestion = (poll) => (
  poll.relationships.question
);

const getOptionsOfQuestion = (state, questionIdentifier) => (
  getEntitiesOfCollection(
    state, QUESTION_OPTION, buildFilterParams(questionIdentifier)
  )
);

const fetchQuestionAndOptions = (dispatch, identifier) => {
  dispatch(fetchEntity(identifier.type, identifier.id));
  dispatch(fetchCollection(QUESTION_OPTION, buildFilterParams(identifier)));
};

const createResponses = (dispatch, poll, optionIds) => (
  optionIds.forEach(optionId => (
    dispatch(createEntity({
      type: RESPONSE,
      relationships: {
        poll: { id: poll.id, type: poll.type },
        pickedQuestionOption: { id: optionId, type: QUESTION_OPTION },
      }
    }, respondJobId))
  ))
);

const buildFilterParams = (questionIdentifier) => ({
  questionId: questionIdentifier.id,
});
