import { connect } from 'react-redux';
import { fetchEntity } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes';
import { getEntity } from '../selectors';
import Session from '../components/Session';

export const getId = (props) => (
  props.match.params.id
);

const mapStateToProps = (state, ownProps) => ({
  interactiveSession: getEntity(state, INTERACTIVE_SESSION, getId(ownProps))
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRefresh: () => (
    dispatch(fetchEntity(INTERACTIVE_SESSION, getId(ownProps)))
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Session);
