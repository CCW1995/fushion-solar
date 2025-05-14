import React, { Component } from "react"
import { connect } from "react-redux"
import MetisMenu from "react-metismenu"
import _ from "lodash"

import { setEnableMobileMenu } from "reducers/themeOptions"
import { clearItem } from "utils/tokenStore"
import { setUserProfile } from "reducers/profile"

import { ModuleNav, ImpersonateModuleNav, AccountNav } from "./dataMainNav"

import "./index.scss"

class VerticalNavWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      permittedModule: [],
    }
  }

  componentDidMount() {
    this.updateTmpModule(this.props.data)
  }

  componentDidUpdate(prev) {
    if (
      _.isEmpty(prev) &&
      prev.data.ProfileReducer.module !== this.props.data.ProfileReducer.module
    ) {
      this.updateTmpModule(this.props.data)
    }
  }

  updateTmpModule = (data) => {
    const userModule = window.location.href.includes("/admin-impersonate")
      ? data.ImpersonateProfileReducer.module
      : data.ProfileReducer.module

    const modulePreset = window.location.href.includes("/admin-impersonate")
      ? ImpersonateModuleNav
      : ModuleNav

    const tmpAccess = _.map(
      _.filter(userModule, { parent_module_id: null }),
      (item) => ({
        ...item,
        content: _.filter(
          userModule,
          (tmp) => tmp.is_accessible && tmp.parent_module_id === item.id
        ),
      })
    )

    const tmpModuleNav = _.cloneDeep(modulePreset)
    let permittedModule = _.filter(tmpModuleNav, (category) => {
      const tmp = _.find(tmpAccess, (item) => {
        return item.name === category.label && (!_.isEmpty(item.content) || category.content)
      })
      if (!tmp) return false

      if (tmp.content && Array.isArray(category.content)) {
        category.content = _.filter(category.content, (item) =>
          tmp.content.some((tmp) => tmp.name === item.label)
        )
      }

      return true
    })

    if (data.ProfileReducer.profile.user.job_position.uuid === "super admin" &&
      !window.location.href.includes("/admin-impersonate")
    ) {
      this.setState({ permittedModule: tmpModuleNav })
    } else {
      this.setState({ permittedModule: permittedModule })
    }
  }

  render = () => {
    return (
      <>
        <h2 className="app-sidebar__heading">Module</h2>
        <MetisMenu
          key={window.location.href}
          content={ModuleNav}
          onSelected={() => this.props.setEnableMobileMenu(!this.props.enableMobileMenu)}
          activeLinkFromLocation
          className="vertical-nav-menu"
          iconNamePrefix=""
          classNameStateIcon="pe-7s-angle-down"
        />

        <h2 className="app-sidebar__heading">My Account</h2>
        <MetisMenu
          content={AccountNav}
          onSelected={(e) => {
            if (e.target.innerText === "Logout") {
              Promise.all([
                clearItem("ERP_ACCESS_TOKEN"),
                this.props.setUserProfile({}),
              ]).then(() => {
                this.props.history.push("/login")
              })
            }
            this.props.setEnableMobileMenu(!this.props.enableMobileMenu)
          }}
          className="vertical-nav-menu"
          iconNamePrefix=""
          classNameStateIcon="pe-7s-angle-down"
        />
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
  data: state,
  setUserProfile: state.setUserProfile,
})

export default connect(mapStateToProps, { setEnableMobileMenu, setUserProfile })(
  VerticalNavWrapper
)
