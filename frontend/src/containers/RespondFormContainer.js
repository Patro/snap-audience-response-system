import { compose } from 'redux';
import { connect } from 'react-redux';
import { respondToPoll, fetchCollection, fetchEntity } from '../actions';
import RespondForm from '../components/RespondForm';
import { QUESTION_OPTION } from '../constants/entityTypes';
import { getEntity, getEntitiesOfCollection, getJob } from '../selectors';
import withDependencies from './withDependencies';
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
      dispatch(respondToPoll(poll, optionsIds, respondJobId)),
  }
};

const shouldRefresh = (prev, next) => (
  !isEqualIdentifier(
    getIdentifierOfQuestion(prev.poll),
    getIdentifierOfQuestion(next.poll),
  )
);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
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

const buildFilterParams = (questionIdentifier) => ({
  questionId: questionIdentifier.id,
});

const isEqualIdentifier = (a, b) => (
  a.id === b.id && a.type === b.type
);
