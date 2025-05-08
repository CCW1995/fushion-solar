import React, { Component } from "react";
import { connect } from "react-redux";

import Axios from "axios";
import { storeItem, clearItem } from "utils/tokenStore";
import getDomainURL from "utils/api";
import { setUserProfile } from "reducers/profile";
import { setPath } from "actions/path";

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      requestCount: 0,
      showPassword: false,
      errorMessage: "",
    };

    onChangeHOC = (val, context) => this.setState({ [context]: val });

    onClickLogin = (dataToSubmit) => {
      this.props.history.push("/dashboard/huawei-dashboard");
      //this.setState({ loading: true }, () => {
        //Axios.post(`${getDomainURL()}/api/login/dch`, dataToSubmit)
          //
      //});
      //this.setState({ loading: true }, () => {
        //Axios.post(`${getDomainURL()}/api/login/dch`, dataToSubmit)
          //.then((response) => {
            //this.setState({
              //loading: false,
              //requestCount: 0,
            //});
            //this.props.setUserProfile(response.data)
            //clearItem("PERMISSION_ALERT");
            //storeItem("ERP_PERMISSION_TOKEN", response.headers["x-permission-cache-key"])
            //storeItem("ERP_ACCESS_TOKEN", response.data.token);
            //storeItem("ERP_REFRESH_TOKEN", response.data.refreshToken);
            //this.props.history.push("/dashboard/main");
          //})
          //.catch((err) => {
            //this.setState({
              //errorMessage:
                //err.response?.data?.message ??
                //"This combination of username and password is incorrect.",
              //loading: false,
              //requestCount: 0,
            //});
          //});
      //});
    };

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          showPassword={this.state.showPassword}
          errorMessage={this.state.errorMessage}
          onLoadLogin={this.state.loading}
          onChangeHOC={this.onChangeHOC}
          onClickLogin={this.onClickLogin}
        />
      );
    };
  }
  const mapStateToProps = (state) => ({ data: state });
  return connect(mapStateToProps, { setUserProfile, setPath })(WithHOC);
};

export default HOC;