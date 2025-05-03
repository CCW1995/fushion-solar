import React, { Component } from "react"
import { connect } from "react-redux"

import { requestSuccess } from "utils/requestHandler"
import { Put } from "utils/axios"

const HOC = (WrappedComponent) => {
  class WithHOC extends Component {
    state = {
      loading: false,
      requestCount: 0,
      errorMessage: "",
    }

    onChangeHOC = (val, context) => this.setState({ [context]: val })

    load = (param) => {
      this.setState((prevState) => {
        const newCount = param ? prevState.requestCount + 1 : prevState.requestCount - 1
        return {
          loading: newCount > 0,
          requestCount: newCount,
        }
      })
    }

    requestForgetPasswordEmail = (dataToSubmit) => {
      Put(
        `/api/recover_account`,
        dataToSubmit,
        this.requestForgetPasswordEmailSuccess,
        this.requestForgetPasswordEmailError,
        this.load
      )
    }
    requestForgetPasswordEmailSuccess = () => {
      this.setState({ errorMessage: null })
      requestSuccess("Email on password reset link has been sent. Please check your email.", "Success")
    }
    requestForgetPasswordEmailError = (error) => this.setState({ errorMessage: error.message })

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          errorMessage={this.state.errorMessage}
          onLoadForgotPw={this.state.loading}
          onChangeHOC={this.onChangeHOC}
          requestForgetPasswordEmail={this.requestForgetPasswordEmail}
        />
      )
    }
  }
  const mapStateToProps = (state) => ({ data: state })
  return connect(mapStateToProps)(WithHOC)
}

export default HOC
