import React, { Component, Suspense } from "react"
import { toast, ToastContainer } from "react-toastify"
import { connect } from "react-redux"
import { Route, withRouter, Switch, Redirect } from "react-router-dom"
import DocumentMeta from "react-document-meta"
import _ from "lodash"

import FusionSolarLayout from 'components/HuaweiMenu/FusionSolarLayout'
import LoadingOverlay from "components/Indicator/LoadingOverlay"
import NotFound from "containers/NotFound"

import { getProfile } from "actions/profile"
import { getItem, clearItem } from "utils/tokenStore"

// Import your dashboard components here
import HuaweiStyleDashboard from '../HuaweiStyleDashboard'
import PlantView from '../PlantView'

const meta = {
  meta: {
    name: {
      robots: "noindex"
    }
  }
}

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingOverlay />}>{children}</Suspense>
)

class Dashboard extends Component {
  render() {
    return (
      <DocumentMeta {...meta}>
        <FusionSolarLayout>
                <SuspenseWrapper key={"SuspenseWrapper"}>
                  <Switch>
              <Route exact path="/dashboard/huawei-dashboard" component={HuaweiStyleDashboard} />
              <Route exact path="/dashboard/plant-monitoring" component={PlantView} />
              <Redirect exact from="/dashboard" to="/dashboard/huawei-dashboard" />
                    <Route component={NotFound} />
                  </Switch>
                </SuspenseWrapper>
        </FusionSolarLayout>
          <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      </DocumentMeta>
    )
  }
}

const mapStateToProps = state => ({ data: state })
export default connect(mapStateToProps, {
  getProfile,
  withRouter
})(Dashboard)
