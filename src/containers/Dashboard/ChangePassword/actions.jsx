import React, { Component } from "react"
import { connect } from "react-redux"
import { Get, Put } from "utils/axios"
import { setPath } from "actions/path"
import { requestError, requestSuccess } from "utils/requestHandler"

const HOC = WrappedComponent => {
  class WithHOC extends Component {
    state = {
      loading: false,
      requestCount: 0,
      errors: [],
      newPassword: {}
    }

    onChangeHOC = (key, val) => this.setState({ [key]: val })

    load = (param) => {
      this.setState((prevState) => {
        const newCount = param ? prevState.requestCount + 1 : prevState.requestCount - 1
        return {
          loading: newCount > 0,
          requestCount: newCount,
        }
      })
    }

    changePassword = dataToSubmit => {
      Put(
        `/api/change_password`,
        dataToSubmit,
        this.changePasswordSuccess,
        this.changePasswordError,
        this.load
      )
    }
    changePasswordSuccess = () => {
      requestSuccess("You have successfully updated the password.", "Success")
      this.setState({
        newPassword: {
          current_password: "",
          password: "",
          password_confirmation: ""
        }
      })
    }
    changePasswordError = (error) => this.setState({ errors: error.info })

    render = () => {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onLoadChangePassword={this.state.loading}

          changePassword={this.changePassword}
          onChangeHOC={this.onChangeHOC}
          newPassword={this.state.newPassword}
        />
      )
    }
  }

  const mapStateToProps = state => ({ data: state })
  return connect(mapStateToProps, {setPath})(WithHOC)
}

export default HOC
