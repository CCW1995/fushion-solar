import React, { useEffect } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { Switch, Route, withRouter, Redirect } from "react-router-dom"

import Login from "containers/Login"
import ResetPw from "containers/ResetPw"
import ForgotPw from "containers/ForgotPw"
import Dashboard from "containers/Dashboard"
import Registration from "containers/Registration"
import HuaweiStyleDashboard from "containers/HuaweiStyleDashboard"
// import NotFound from "containers/NotFound"

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
      <Route exact path="/login" component={Login} initialPath />
      <Route exact path="/register" component={Registration} />
      <Route exact path="/forgot-password" component={ForgotPw} />
      <Route exact path="/reset-password" component={ResetPw} />
      <PrivateRoute path="/huawei-dashboard" component={HuaweiStyleDashboard} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      {/* <PrivateRoute path={"/admin-impersonate"} component={Dashboard} /> */}

      <Redirect exact from={"/"} to={"/huawei-dashboard"} />
      {/* <Route component={NotFound} /> */}
    </Switch>
  )
}

export default compose(connect(null, { getProfile }), withRouter)(CustomRouter)
