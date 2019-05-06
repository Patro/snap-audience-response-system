import React, { Component } from 'react';

const withFullscreenStatus = WrappedComponent => (
  class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        shownFullscreen: this.shownFullscreen,
      }
      this.onChange = this.onChange.bind(this);
    }

    get documentElement() {
      return document.documentElement;
    }

    get shownFullscreen() {
      const { fullscreenElement } = document;
      return fullscreenElement === this.documentElement;
    }

    render() {
      return <WrappedComponent
               shownFullscreen={this.state.shownFullscreen}
               {...this.props} />;
    }

    componentDidMount() {
      document.addEventListener('fullscreenchange', this.onChange);
    }

    componentWillUnmount() {
      document.removeEventListener('fullscreenchange', this.onChange);
    }

    onChange() {
      this.setState({ shownFullscreen: this.shownFullscreen })
    }
  }
)

export default withFullscreenStatus;
