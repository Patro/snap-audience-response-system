import { connect } from 'react-redux';
import { joinSession } from '../actions';
import JoinSessionForm from '../components/JoinSessionForm';

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (attendance_code) => (
    dispatch(joinSession(attendance_code))
  ),
});

export default connect(
  null,
  mapDispatchToProps
)(JoinSessionForm)
