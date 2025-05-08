import React, { useEffect } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { Switch, Route, withRouter, Redirect } from "react-router-dom"

import Login from "containers/Login"
import ResetPw from "containers/ResetPw"
import ForgotPw from "containers/ForgotPw"
import Dashboard from "containers/Dashboard"
import Registration from "containers/Registration"

import { getItem } from "utils/tokenStore"
import { getProfile } from "actions/profile"

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => <Component {...props} />} />
)

function CustomRouter(props) {
  useEffect(() => {
    if (getItem("ERP_ACCESS_TOKEN")) {
      props.getProfile()
    }
  }, [])

  return (
    <Switch>
      {/* Public routes */}
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Registration} />
      <Route exact path="/forgot-password" component={ForgotPw} />
      <Route exact path="/reset-password" component={ResetPw} />

      {/* Dashboard routes */}
      <PrivateRoute path="/dashboard" component={Dashboard} />

      {/* Default redirect */}
      <Redirect exact from="/" to="/login" />
    </Switch>
  )
}

export default compose(connect(null, { getProfile }), withRouter)(CustomRouter)
