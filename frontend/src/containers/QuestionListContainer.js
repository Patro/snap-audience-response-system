import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchCollection } from '../actions';
import QuestionList from '../components/QuestionList';
import { POLL, QUESTION } from '../constants/entityTypes';
import { getEntitiesOfCollection } from '../selectors';
import withDependencies from './withDependencies';

const mapStateToProps = (state, { interactiveSession }) => ({
  questions: getQuestions(state, interactiveSession),
  openPollsByQuestionId: getOpenPolls(state, interactiveSession),
});

const mapDispatchToProps = (dispatch, { interactiveSession }) => ({
  onRefresh: () => fetchDependencies(dispatch, interactiveSession),
});

const shouldRefresh = (prev, next) => (
  prev.interactiveSession.id !== next.interactiveSession.id
);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
)(QuestionList);

///////////////////////////////////////////////////////////////////////////////

const getQuestions = (state, interactiveSession) => (
  getEntitiesOfCollection(
    state, QUESTION, buildQuestionsFilterParams(interactiveSession)
  )
);

const getOpenPolls = (state, interactiveSession) => {
  const openPolls = getEntitiesOfCollection(
    state, POLL, buildOpenPollsFilterParams(interactiveSession)
  );
  if (openPolls === undefined) { return; }

  return openPolls.reduce((byQuestionId, poll) => {
    byQuestionId[poll.relationships.question.id] = poll;
    return byQuestionId;
  }, {});
};

const fetchDependencies = (dispatch, interactiveSession) => {
  fetchQuestions(dispatch, interactiveSession);
  fetchOpenPolls(dispatch, interactiveSession);
}

const fetchQuestions = (dispatch, interactiveSession) => {
  dispatch(
    fetchCollection(QUESTION, buildQuestionsFilterParams(interactiveSession))
  );
};

const fetchOpenPolls= (dispatch, interactiveSession) => {
  dispatch(
    fetchCollection(POLL, buildOpenPollsFilterParams(interactiveSession))
  );
};

const buildQuestionsFilterParams = (interactiveSession) => ({
  interactiveSessionId: interactiveSession.id,
});

const buildOpenPollsFilterParams = (interactiveSession) => ({
  interactiveSessionId: interactiveSession.id,
  status: 'open',
});
