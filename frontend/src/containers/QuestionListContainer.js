import Immutable from 'immutable';
import { compose } from 'redux';
import { fetchCollection } from '../actions';
import QuestionList from '../components/QuestionList';
import { POLL, QUESTION } from '../constants/entityTypes';
import { getEntitiesOfCollection } from '../selectors';
import connectWithImmutables from '../utils/connectWithImmutables';
import withDependencies from './withDependencies';

const mapStateToProps = (state, { interactiveSession }) => ({
  questions: getQuestions(state, interactiveSession),
  openPollsByQuestionId: getOpenPolls(state, interactiveSession),
});

const mapDispatchToProps = (dispatch, { interactiveSession }) => ({
  onRefresh: () => fetchDependencies(dispatch, interactiveSession),
});

const shouldRefresh = (prev, next) => (
  prev.interactiveSession.get('id') !== next.interactiveSession.get('id')
);

export default compose(
  connectWithImmutables(mapStateToProps, mapDispatchToProps),
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

  return openPolls.reduce((byQuestionId, poll) => (
    byQuestionId.set(poll.getIn(['relationships', 'question', 'id']), poll)
  ), Immutable.Map());
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
  interactiveSessionId: interactiveSession.get('id'),
});

const buildOpenPollsFilterParams = (interactiveSession) => ({
  interactiveSessionId: interactiveSession.get('id'),
  status: 'open',
});
