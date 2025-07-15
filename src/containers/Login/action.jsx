import React, { Component } from "react";
import { connect } from "react-redux";

import Axios from "axios";
import { storeItem } from "utils/tokenStore";
import { setUserProfile } from "reducers/profile";
import { setPath } from "actions/path";

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      showPassword: false,
      errorMessage: "",
    };

    onChangeHOC = (val, context) => this.setState({ [context]: val });

    onClickLogin = (dataToSubmit) => {
      this.setState({ loading: true }, () => {
        Axios.post(`https://api.emitsolar.appbaystudio.com/api/fusion/login`, dataToSubmit)
          .then((response) => {
            this.setState({
              loading: false,
            });
            this.props.setUserProfile(response.data);
            storeItem("ERP_ACCESS_TOKEN", response.data.token);
            if(response.data.role === 'admin'){
              this.props.history.push("/dashboard/home");
            } else {
              this.props.history.push("/dashboard/plant-monitoring");
            }
          })
          .catch((err) => {
            this.setState({
              errorMessage:
                err.response?.data?.message ??
                "This combination of username and password is incorrect.",
              loading: false,
            });
          });
      });
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