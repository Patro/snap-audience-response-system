import { connect } from 'react-redux';
import { createEntity, fetchCollection, fetchEntity } from '../actions';
import RespondForm from '../components/RespondForm';
import { QUESTION_OPTION, RESPONSE } from '../constants/entityTypes';
import { getCollection, getEntity } from '../selectors';

const mapStateToProps = (state, { poll }) => {
  const questionIdentifier = getIdentifierOfQuestion(poll);
  return {
    question: getQuestion(state, questionIdentifier),
    options: getOptionsOfQuestion(state, questionIdentifier),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RespondForm);

///////////////////////////////////////////////////////////////////////////////

const getIdentifierOfQuestion = (poll) => (
  poll.relationships.question
);

const getQuestion = (state, identifier) => (
  getEntity(state, identifier.type, identifier.id)
);

const getOptionsOfQuestion = (state, questionIdentifier) => {
  const collection = getCollection(
    state, QUESTION_OPTION, buildFilterParams(questionIdentifier)
  );
  if (collection === undefined) { return; }
  return collection.entities.map(identifier => getOption(state, identifier));
};

const getOption = (state, identifier) => (
  getEntity(state, identifier.type, identifier.id)
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
    }))
  ))
);

const buildFilterParams = (questionIdentifier) => ({
  questionId: questionIdentifier.id,
});