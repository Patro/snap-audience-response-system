import { connect } from 'react-redux';
import { fetchCollection } from '../actions';
import QuestionList from '../components/QuestionList';
import { QUESTION } from '../constants/entityTypes';
import { getCollection, getEntity } from '../selectors';

const mapStateToProps = (state, { interactiveSession }) => ({
  questions: getQuestionsOfSession(state, interactiveSession),
});

const mapDispatchToProps = (dispatch, { interactiveSession }) => ({
  onRefresh: () => fetchQuestions(dispatch, interactiveSession),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionList);

///////////////////////////////////////////////////////////////////////////////

const getQuestionsOfSession = (state, interactiveSession) => {
  const collection = getCollection(
    state, QUESTION, buildFilterParams(interactiveSession)
  );
  if (collection === undefined) { return; }
  return collection.entities.map(identifier => getEntity(state, identifier));
};

const fetchQuestions = (dispatch, interactiveSession) => {
  dispatch(fetchCollection(QUESTION, buildFilterParams(interactiveSession)));
};

const buildFilterParams = (interactiveSession) => ({
  interactiveSessionId: interactiveSession.id,
});
