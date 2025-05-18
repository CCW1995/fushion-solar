import React, { Component } from "react";
import { connect } from "react-redux";

import { requestError } from "utils/requestHandler";
import { setPath } from "actions/path";
import { setUserProfile } from "reducers/profile";
import { Get } from "utils/axios";
import { samplePlantData } from "./assets";
const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      showPassword: false,
      errorMessage: "",
      plantData: samplePlantData
    };

    onChangeHOC = (val, context) => this.setState({ [context]: val });

    load = val => this.setState({ loading: val })

    getPlantView = () => {
      // Get(
      //   `/api/station/overview`,
      //   this.getPlantViewSuccess,
      //   this.getPlantViewError,
      //   this.load
      // )
      this.getPlantViewSuccess()
    }
    getPlantViewSuccess = () => this.setState({
      plantData: samplePlantData
    })
    getPlantViewError = (error) => requestError(error, "Error")


    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onLoadPlantView={this.state.loading}
          onChangeHOC={this.onChangeHOC}
          getPlantView={this.getPlantView}
        />
      );
    };
  }
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps, { setUserProfile, setPath })(WithHOC);
};

export default HOC;