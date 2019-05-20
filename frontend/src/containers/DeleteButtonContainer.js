import { compose } from 'redux';
import { destroyEntity } from '../actions';
import { getJob } from '../selectors';
import connectWithImmutables from '../utils/connectWithImmutables';
import withJob from './withJob';
import DeleteButton from '../components/DeleteButton';

const mapStateToProps = (state, { entity }) => ({
  deleteJob: getJob(state, jobId(entity)),
});

const mapDispatchToProps = (dispatch, { entity }) => ({
  onDelete: () => (
    dispatch(destroyEntity(entity, jobId(entity)))
  ),
});

export default compose(
  connectWithImmutables(mapStateToProps, mapDispatchToProps),
  withJob(props => props.deleteJob),
)(DeleteButton);

///////////////////////////////////////////////////////////////////////////////

const jobId = (entity) => (
  `destroyJob:${entity.get('type')}:${entity.get('id')}`
);
