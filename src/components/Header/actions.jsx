import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { Get } from "utils/axios"
import { convertObjectToBase64 } from "utils/objToBase64"
import { requestError, requestSuccess } from "utils/requestHandler"
import { setUserProfile } from "reducers/profile";

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      requestCount: 0,
      notifications: [],
    };

    load = (param) => {
      this.setState((prevState) => {
        const newCount = param ? prevState.requestCount + 1 : prevState.requestCount - 1
        return {
          loading: newCount > 0,
          requestCount: newCount,
        }
      })
    };

    getNotifications = () => Get(
      `/api/notifications?query=${convertObjectToBase64({
        filter: {
          receiver_id: this.props.data.ProfileReducer.profile?.user?.id,
        },
        need_pagination: false,
      })}`,
      this.getNotificationsSuccess,
      this.getNotificationsError,
      this.load
    )
    getNotificationsSuccess = response => this.setState({ 
      notifications: response.data,
    }, {})
    getNotificationsError = error => requestError(error, "Error")

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onLoadForgotPassword={this.state.loading}

          getNotifications={this.getNotifications}
        />
      );
    };
  }

  const mapStateToProps = (state) => ({ 
    data: state,
    enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
    closedSmallerSidebar: state.ThemeOptions.closedSmallerSidebar,
    headerBackgroundColor: state.ThemeOptions.headerBackgroundColor,
    enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
  })
  return connect(mapStateToProps, {
    setUserProfile
  })(WithHOC)
};

export default HOC;