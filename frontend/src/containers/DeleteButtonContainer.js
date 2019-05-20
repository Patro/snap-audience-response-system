import { compose } from 'redux';
import { connect } from 'react-redux';
import { destroyEntity } from '../actions';
import DeleteButton from '../components/DeleteButton';
import { getJob } from '../selectors';
import withJob from './withJob';

const mapStateToProps = (state, { entity }) => ({
  deleteJob: getJob(state, jobId(entity)),
});

const mapDispatchToProps = (dispatch, { entity }) => ({
  onDelete: () => (
    dispatch(destroyEntity(entity, jobId(entity)))
  ),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withJob(props => props.deleteJob),
)(DeleteButton);

///////////////////////////////////////////////////////////////////////////////

const jobId = (entity) => (
  `destroyJob:${entity.get('type')}:${entity.get('id')}`
);
