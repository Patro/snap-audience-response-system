import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchEntity } from '../actions';
import { POLL } from '../constants/entityTypes';
import { getEntity } from '../selectors';
import PresenterScreen from '../components/PresenterScreen';
import withDependencies from './withDependencies';

const mapStateToProps = (state, ownProps) => ({
  poll: getEntity(state, { type: POLL, id: getPollId(ownProps)}),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRefresh: () => dispatch(fetchEntity(POLL, getPollId(ownProps))),
});

const shouldRefresh = (prev, next) => getPollId(prev) !== getPollId(next);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
)(PresenterScreen);

///////////////////////////////////////////////////////////////////////////////

const getPollId = (props) => (
  props.match.params.pollId
);
