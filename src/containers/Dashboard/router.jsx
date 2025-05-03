import React, { lazy } from "react"
import * as Labels from "utils/labels"

const Dashboard = lazy(() => import("./ZitronDashboard"))

const Main = lazy(() => import("./Dashboard/Main"))

export const routes = [
  {
    parent: "Dashboard",
    routes: [
      {
        path: "/main",
        exact: true,
        label: "Main",
        render: props => <Main {...props} />
      }
    ]
  }
]
export const utilRoutes = [
  {
    path: "",
    exact: true,
    render: props => <Dashboard {...props} />
  },
  {
    path: "/change_password",
    render: props => <ChangePassword {...props} />
  },
  {
    path: "/admin-impersonate",
    exact: true,
    render: props => <Dashboard {...props} />
  },
  {
    path: "/admin-impersonate/change_password",
    exact: true,
    render: props => <ChangePassword {...props} />
  }
]
