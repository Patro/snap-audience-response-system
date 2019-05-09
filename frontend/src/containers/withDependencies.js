import React, { Component } from 'react';

const withDependencies = (shouldRefresh) => (
  WrappedComponent => class extends Component {
    get onRefresh() {
      return this.props.onRefresh;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

    componentDidMount() {
      this.refresh();
    }

    componentDidUpdate(prevProps) {
      if (shouldRefresh(prevProps, this.props)) {
        this.refresh();
      }
    }

    refresh() {
      if (this.onRefresh !== undefined) {
        this.onRefresh();
      }
    }
  }
)

export default withDependencies;
