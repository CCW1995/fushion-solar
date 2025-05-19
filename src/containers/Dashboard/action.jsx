import React, { Component } from "react";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom"
import { setPath } from "actions/path";
import { Get } from "utils/axios";
import { setStationInfo } from "reducers/station"

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      showPassword: false,
      errorMessage: "",
    };

    onChangeHOC = (val, context) => this.setState({ [context]: val });

    load = (val) => this.setState({ loading: val })

    getStationInfo = (id) => {
      Get(
        `/station/info?userId=${id}`, 
        this.getStationInfoSuccess, 
        this.getStationInfoError, 
        this.load
      )
    }
    getStationInfoSuccess = payload => {
      payload?.[0] && this.props.setStationInfo(payload?.[0])
    }
    getStationInfoError = (error) => requestError(error, "Error")

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          onLoadDashboard={this.state.loading}
          onChangeHOC={this.onChangeHOC}
          getStationInfo={this.getStationInfo}
        />
      );
    };
  }
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps, { setStationInfo, 
    setPath, withRouter })(WithHOC);
};

export default HOC;