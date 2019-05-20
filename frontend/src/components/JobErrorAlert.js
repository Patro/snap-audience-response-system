import Immutable from 'immutable';
import React, { Component } from 'react';
import { Alert } from 'antd';
import { FAILED } from '../constants/jobStatus';

class JobErrorAlert extends Component {
  static getDerivedStateFromProps(props) {
    if (props.job === undefined) { return {}; }

    return { lastJob: props.job };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const job = this.state.lastJob;
    if (job === undefined || job.get('status') !== FAILED) { return false; }

    return(
      <Alert
        message="Error"
        description={this.renderErrorMessage(job)}
        type="error"
        showIcon
      />
    );
  }

  renderErrorMessage(job) {
    const errors = job.get('errors') || Immutable.List();
    if (errors.count() === 0) { return 'Operation failed.'; }
    if (errors.count() === 1) { return errors.getIn([0, 'detail']); }
    return(
      <ul>
        {errors.map((error, index) =>
          <li key={index}>{error.get('detail')}</li>
        )}
      </ul>
    );
  }
}

export default JobErrorAlert;
