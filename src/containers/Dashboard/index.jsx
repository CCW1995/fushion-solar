import React, { Component, Suspense } from "react"
import { toast, ToastContainer } from "react-toastify"
import { connect } from "react-redux"
import { Route, withRouter, Switch, Redirect } from "react-router-dom"
import DocumentMeta from "react-document-meta"
import _ from "lodash"

import TemplateHeader from "components/Header"
import TemplateContainerMain from "components/Template"
import TemplateSidemenu from "components/Menu/Sidemenu"
import LoadingOverlay from "components/Indicator/LoadingOverlay"
import NotFound from "containers/NotFound"

import { getProfile } from "actions/profile"
import { routes, utilRoutes } from "./router"
import { getItem, clearItem } from "utils/tokenStore"

const PrefixURL = "/dashboard"

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
  componentDidMount = () => {
    if (!getItem("ERP_ACCESS_TOKEN")) {
      this.props.history.push("/login")
      clearItem("ERP_IMPERSONATE_ACCESS_TOKEN")
    } else if (this.props.data.LastViewURLReducer.last_view_url) {
      const lastView = this.props.data.LastViewURLReducer.last_view_url;
      this.props.history.push(lastView);
    }
  }

  render = () => {
    const tmpProfile = window.location.href.includes("/admin-impersonate")
      ? this.props.data.ImpersonateProfileReducer
      : this.props.data.ProfileReducer

    const modules = tmpProfile.groupedModule
    const parentModules = tmpProfile.parentModule

    const formattedData = _.map(parentModules, (parentModule, id) => {
      return {
        ...parentModule,
        routes:
          modules[id]?.map(route => ({
            ...route,
            routes: modules[route.id] || []
          })) || []
      }
    })

    const filteredRoutes = _.flatMap(formattedData, item => {
      return _.filter(routes, route => {
        return (
          route.parent === item.name &&
          item.routes.filter(routeItem => routeItem.is_accessible) &&
          item.routes.length > 0
        )
      })
    })

    const tmpPath = window.location.href.includes("/admin-impersonate")
      ? "/admin-impersonate"
      : ""

    const renderedRoutes = () => {
      let routing = _.flatMap([...filteredRoutes, ...utilRoutes], item => {
        if (item.routes) {
          return item.routes.map(route => {
            if (route.path) {
              return (
                <Route
                  exact={route.exact}
                  path={`${tmpPath}${PrefixURL}${route.path}`}
                  render={props => route.render(props)}
                />
              )
            }

            if (route.content) {
              return route.content.map(nestedRoute => (
                <Route
                  exact={nestedRoute.exact}
                  path={`${tmpPath}${PrefixURL}${nestedRoute.path}`}
                  render={props => nestedRoute.render(props)}
                />
              ))
            }

            return null
          })
        } else {
          return (
            <Route
              exact={item.exact}
              path={`${tmpPath}${PrefixURL}${item.path}`}
              render={props => item.render(props)}
            />
          )
        }
      })

      return routing
    }

    return (
      <DocumentMeta {...meta}>
        <TemplateContainerMain>
          <TemplateHeader
            onClickToggleProfileModal={() => { }}
            history={this.props.history}
            user={{
              name: "Test user",
              email: "testuser@gmail.com"
            }}
          />
          <TemplateSidemenu history={this.props.history} />
          <div className="app-main">
            <div className="app-main__outer">
              <div className="app-main__inner">
                <SuspenseWrapper key={"SuspenseWrapper"}>
                  <Switch>
                    {renderedRoutes()}
                    <Route component={NotFound} />
                  </Switch>
                </SuspenseWrapper>
              </div>
            </div>
          </div>
          <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
        </TemplateContainerMain>
      </DocumentMeta>
    )
  }
}

const mapStateToProps = state => ({ data: state })
export default connect(mapStateToProps, {
  getProfile,
  withRouter
})(Dashboard)
