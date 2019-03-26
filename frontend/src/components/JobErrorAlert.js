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
    if (job === undefined || job.status !== FAILED) { return false; }

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
    const errors = job.errors || [];
    if (errors.length === 0) { return 'Operation failed.'; }
    if (errors.length === 1) { return job.errors[0].detail; }
    return(
      <ul>
        {errors.map((error, index) =>
          <li key={index}>{error.detail}</li>
        )}
      </ul>
    );
  }
}

export default JobErrorAlert;
