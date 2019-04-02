import { connect } from 'react-redux';
import { fetchEntity } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes';
import { getEntity } from '../selectors';
import SessionScreen from '../components/SessionScreen';

const mapStateToProps = (state, ownProps) => ({
  interactiveSession: getInteractiveSession(state, getId(ownProps)),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRefresh: () => fetchInteractiveSession(dispatch, getId(ownProps)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionScreen);

///////////////////////////////////////////////////////////////////////////////

const getId = (props) => (
  props.match.params.id
);

const getInteractiveSession = (state, id) => (
  getEntity(state, { type: INTERACTIVE_SESSION, id })
);

const fetchInteractiveSession = (dispatch, id) => (
  dispatch(fetchEntity(INTERACTIVE_SESSION, id))
);
