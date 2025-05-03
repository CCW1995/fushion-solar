import React, { Component } from "react";
import { connect } from "react-redux";

import { Post } from "utils/axios";
import { requestError, requestSuccess } from "utils/requestHandler";

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
    };

    onChangeHOC = (key, val) => this.setState({ [key]: val });

    load = (param) => this.setState({ loading: param });

    logNotFound = (from) => {
      if(!from) return;

      Post(
        `/api/dealer_portal/error_logs/not_found_logging`,
        { url: from },
        () => { },
        (error) => requestError('', 'Could not log!'),
        this.load
      );
    }

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onChangeHOC={this.onChangeHOC}
          logNotFound={this.logNotFound}
        />
      );
    }
  }

  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps)(WithHOC);
};

export default HOC;