import React, { Component } from 'react';
import { STARTED, SUCCEEDED } from '../constants/jobStatus';

const withJob = selectJob => (
  WrappedComponent => class extends Component {
    get job() {
      return selectJob(this.props);
    }

    get processing() {
      return this.job !== undefined && this.job.get('status') === STARTED;
    }

    get onSuccess() {
      return this.props.onSuccess;
    }

    render() {
      return <WrappedComponent processing={this.processing} {...this.props} />;
    }

    componentDidUpdate(prevProps) {
      if (this.jobStatusChangedToSucceeded(prevProps) && this.onSuccess) {
        this.onSuccess();
      }
    }

    jobStatusChangedToSucceeded(prevProps) {
      const job = this.job;
      if (!job) { return false; }
      const prevJob = selectJob(prevProps);
      if (!prevJob) { return false; }

      return job.get('status') !== prevJob.get('status') &&
        job.get('status') === SUCCEEDED;
    }
  }
)

export default withJob;
