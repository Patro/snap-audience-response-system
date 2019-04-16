import { connect } from 'react-redux';
import { destroyEntity } from '../actions';
import DeleteButton from '../components/DeleteButton';
import { getJob } from '../selectors';

const mapStateToProps = (state, { entity }) => ({
  deleteJob: getJob(state, jobId(entity)),
});

const mapDispatchToProps = (dispatch, { entity }) => ({
  onDelete: () => (
    dispatch(destroyEntity(entity, jobId(entity)))
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteButton)

///////////////////////////////////////////////////////////////////////////////

const jobId = (entity) => (
  `destroyJob:${entity.type}:${entity.id}`
);
