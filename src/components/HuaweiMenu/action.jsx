import { setPath } from "actions/path";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Get } from "utils/axios";
import { requestError } from "utils/requestHandler";

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      stationList: []
    };

    onChangeHOC = (val, context) => this.setState({ [context]: val });

    load = val => this.setState({ loading: val })

   getStationList = () => {
    Get(
      `/station/list`,
      this.getStationListSuccess,
      this.getStationListError,
      this.load
    )
   }
   getStationListSuccess = payload => this.setState({
    stationList: payload.data
   })
   getStationListError = (error) => requestError(error, "Error")

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onLoadStationList={this.state.loading}
          getStationList={this.getStationList}
        />
      );
    };
  }
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps, { setPath })(WithHOC);
};

export default HOC;