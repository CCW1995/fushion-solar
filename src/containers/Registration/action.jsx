import React, { Component } from "react";
import _ from "lodash";

import { Get, Post } from "utils/axios";
import { requestError, requestSuccess } from "utils/requestHandler";

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      requestCount: 0,
      userAccount: {},
      invalidToken: false,
      registerError: [],
      successRegistration: false
    }

    onChangeUserAccHOC = (key, val) => this.setState({ [key]: val })

    load = (param) => {
      this.setState((prevState) => {
        const newCount = param ? prevState.requestCount + 1 : prevState.requestCount - 1
        return {
          loading: newCount > 0,
          requestCount: newCount,
        }
      })
    }

    verifyRegistration = (token) => Get(
      `/api/user_accounts/${token}/verify_registration`,
      this.verifyRegistrationSuccess,
      this.verifyRegistrationError,
      this.load
    )
    verifyRegistrationSuccess = (payload) => this.setState({ userAccount: payload.data })
    verifyRegistrationError = () => this.setState({ invalidToken: true })

    register = (data) => Post(
      `/api/user_accounts/register`,
      data,
      this.registerSuccess,
      this.registerError,
      this.load
    )
    registerSuccess = (payload) => {
      requestSuccess(
        "You have successfully registered a new account for ERP.",
        "Success"
      )
      this.setState({ userAccount: payload.data, successRegistration: true })
    }
    registerError = error => {
      this.setState({ registerError: !_.isEmpty(error.info) ? error.info : error.message })
    }

    render = () => {
      return (
        <WrappedComponent
          {...this.state}
          {...this.props}
          onChangeUserAccHOC={this.onChangeUserAccHOC}
          onLoadRegistration={this.state.loading}
          verifyRegistration={this.verifyRegistration}
          register={this.register}
        />
      )
    }
  }
  return WithHOC
}

export default HOC
