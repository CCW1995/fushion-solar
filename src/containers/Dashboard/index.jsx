import React, { Component, Suspense } from "react"
import DocumentMeta from "react-document-meta"
import { Redirect, Route, Switch } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"

import FusionSolarLayout from 'components/HuaweiMenu/FusionSolarLayout'
import LoadingOverlay from "components/Indicator/LoadingOverlay"
import NotFound from "containers/NotFound"

import { getItem } from "utils/tokenStore"

// Import your dashboard components here
import AdminHome from '../AdminHome'
import PlantView from '../PlantView'
import AlarmListing from '../AlarmListing'
import HOC from './action'

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

  componentDidMount() {
    if (!getItem("ERP_ACCESS_TOKEN")) {
      this.props.history.push("/login");
    } else {
      if(this.props.data.ProfileReducer.profile.uuid){
        this.props.getStationInfo(this.props.data.ProfileReducer.profile.uuid)
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.ProfileReducer.profile.uuid !== this.props.data.ProfileReducer.profile.uuid) {
      this.props.getStationInfo(this.props.data.ProfileReducer.profile.uuid)
    }
  }

  render() {
    return (
      <>
        <DocumentMeta {...meta}>
          <FusionSolarLayout>
                  <SuspenseWrapper key={"SuspenseWrapper"}>
                    <Switch>
                <Route exact path="/dashboard/home" component={AdminHome} />
                <Route exact path="/dashboard/plant-monitoring" component={PlantView} />
                <Route exact path="/dashboard/alarm-listing" component={AlarmListing} />
                <Redirect exact from="/dashboard" to="/dashboard/home" />
                      <Route component={NotFound} />
                    </Switch>
                  </SuspenseWrapper>
          </FusionSolarLayout>
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
        </DocumentMeta>
        {
          this.props.onLoadDashboard && <LoadingOverlay />
        }
      </>
    )
  }
}

export default HOC(Dashboard)
