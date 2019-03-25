import { connect } from 'react-redux';
import { fetchCollection, fetchEntity } from '../actions';
import RespondForm from '../components/RespondForm';
import { QUESTION_OPTION } from '../constants/entityTypes';
import { getCollection, getEntity } from '../selectors';

const buildFilterParams = (questionIdentifier) => ({
  questionId: questionIdentifier.id,
});

const getIdentifierOfQuestion = (ownProps) => (
  ownProps.poll.relationships.question
);

const getQuestion = (state, identifier) => (
  getEntity(state, identifier.type, identifier.id)
);

const getOption = (state, identifier) => (
  getEntity(state, identifier.type, identifier.id)
);

const getOptions = (state, questionIdentifier) => {
  const collection = getCollection(
    state, QUESTION_OPTION, buildFilterParams(questionIdentifier)
  );
  if (collection === undefined) { return; }
  return collection.entities.map(identifier => getOption(state, identifier));
};

const mapStateToProps = (state, ownProps) => {
  const identifier = getIdentifierOfQuestion(ownProps);
  return {
    question: getQuestion(state, identifier),
    options: getOptions(state, identifier),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRefresh: () => {
    const identifier = getIdentifierOfQuestion(ownProps);
    dispatch(fetchEntity(identifier.type, identifier.id));
    dispatch(fetchCollection(QUESTION_OPTION, buildFilterParams(identifier)));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RespondForm);
