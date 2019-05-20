const getJob = (state, id) => (
  state.getIn(['jobs', id])
);

export default getJob;
