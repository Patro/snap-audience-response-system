import { compose } from 'redux';
import { fetchEntity } from '../actions';
import { POLL } from '../constants/entityTypes';
import { getEntity } from '../selectors';
import connectWithImmutables from '../utils/connectWithImmutables';
import withDependencies from './withDependencies';
import PresenterScreen from '../components/PresenterScreen';

const mapStateToProps = (state, ownProps) => ({
  poll: getEntity(state, { type: POLL, id: getPollId(ownProps)}),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRefresh: () => dispatch(fetchEntity(POLL, getPollId(ownProps))),
});

const shouldRefresh = (prev, next) => getPollId(prev) !== getPollId(next);

export default compose(
  connectWithImmutables(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
)(PresenterScreen);

///////////////////////////////////////////////////////////////////////////////

const getPollId = (props) => (
  props.match.params.pollId
);
