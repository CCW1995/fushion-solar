import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import _ from "lodash"
import { Dropdown, Button, Badge } from "antd"
import { FiLogOut, FiLock } from "react-icons/fi"

import ERPIcon from "components/Icon"
import ERPButton from "components/Button"

import { getItem, clearItem } from "utils/tokenStore"
import { setUserProfile } from "reducers/profile"
import WithUserbox from "./actions"

import { setLanguage } from "locales/index"
import { ENGLISH_LABEL, CHINESE_LABEL } from "locales/assets"
class Userbox extends Component {
  state = {
    path: "",
    language: ENGLISH_LABEL,
    label: ENGLISH_LABEL
  }

  componentDidMount() {
    this.props.getNotifications()
    this.interval = setInterval(() => {
      this.props.getNotifications()
    }, 360000) // 1 hour interval
  }

  componentDidUpdate(prevProps) {
    if (this.state.path !== prevProps.history.location.pathname) {
      this.props.getNotifications()
      this.setState({ path: prevProps.history.location.pathname })
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  handleLanguageChange = async (lang, option) => {
    await setLanguage(lang)
    this.setState({
      language: lang.toLowerCase(),
      label: option
    })
  }

  render = () => {
    const { profile } = window.location.href.includes("/admin-impersonate")
      ? this.props.data.ImpersonateProfileReducer
      : this.props.data.ProfileReducer

    const items = [
      {
        key: '0', label: (
          <div className="custom-header-user">
            <ERPIcon antIcon="UserOutlined" style={{ cursor: 'pointer', fontSize: "30px" }} />
            <div className="d-flex flex-column justify-content-center">
              <span style={{ color: "#344054" }}>{`${profile?.user?.first_name ?? ""} ${profile?.user?.last_name ?? ""}`}</span>
              <span style={{ fontWeight: 300, color: "#667085" }}>{`${profile?.user?.email}`}</span>
            </div>
          </div>
        )
      },
      {
        key: '1', label: (
          <div onClick={() => this.props.history.push(window.location.href.includes("/admin-impersonate")
            ? "/admin-impersonate/dashboard/change_password"
            : "/dashboard/change_password")}>
            <FiLock className="mr-2" /> Change Password
          </div>
        )
      },
      {
        key: 'w', label: (
          <div onClick={() => Promise.all([
            clearItem("ERP_ACCESS_TOKEN"),
            this.props.setUserProfile({})])
            .then(() => {
              this.props.history.push("/login")
            })}>
            <FiLogOut className="mr-2" /> Log Out
          </div>
        )
      }
    ]

    // Remove bell notifications list
    // const notifications = this.props.notifications?.map((notification) =>  ({
    //     key: `notifiaction-${notification.id}`,
    //     onClick: () => {
    //       if (notification.action?.redirect_link) {
    //         this.props.history.push(notification.action.redirect_link)
    //       } else {
    //         return
    //       }
    //     },
    //     label: (
    //       <div key={`notification-${notification.id}`} className="d-flex flex-column ml-2">
    //         <span className="font-weight-bold">{notification.title}</span>
    //         <span className="text-sm text-ligh-grey">{notification.message}</span>
    //       </div>
    //     )
    // }))
    // ?? [{
    //   key: "notification-0",
    //   icon: <ERPIcon antIcon="BellOutlined" style={{ fontSize: "20px", color: "#1890ff" }} />,
    //   label: (
    //     <div className="d-flex flex-column ml-2">
    //       <span className="font-weight-bold">No Notification</span>
    //       <span className="text-sm text-ligh-grey">You have no new notification</span>
    //     </div>
    //   )
    // }]

    const languageMenu = {
      items: [
        { key: "en", label: ENGLISH_LABEL, onClick: () => this.handleLanguageChange("en", ENGLISH_LABEL) },
        { key: "zh", label: CHINESE_LABEL, onClick: () => this.handleLanguageChange("zh", CHINESE_LABEL) }
      ]
    }

    return (
      <>
        {getItem("ERP_IMPERSONATE_ACCESS_TOKEN") && window.location.href.includes("/admin-impersonate") && (
          <div className="d-flex align-items-center gap-2 mr-4">
            <span className="font-weight-semibold">Impersonation Mode</span>
            <Button
              type="primary"
              danger={true}
              style={{ backgroundColor: "#00ada9" }}
              onClick={() => {
                if (window.location.href.includes("/admin-impersonate")) {
                  setTimeout(() => {
                    window.close()
                  }, 500)
                }
              }}
            >
              Stop Impersonate
            </Button>
          </div>
        )}
        {/* RESERVED FOR FUTURE TRANSLATION PURPOSE */}
        {/* <Dropdown menu={languageMenu} trigger={["click"]} placement="bottomLeft">
          <ERPButton
            color="borderless"
            customClass={"font-weight-bold mr-2"}
          >
            {this.state.label}
          </ERPButton>
        </Dropdown> */}
        <div
          className="d-flex align-items-center mr-4"
          style={{ cursor: "pointer" }}
          onClick={() => {
            this.props.history.push("/dashboard/main?moduleName=Approval Notifications")
            if (this.state.path === "/dashboard/main") {
              window.location.reload()
            }
          }}>
          <Badge count={this.props.data.UnreadNotificationReducer.unread_notifications} overflowCount={99} color="#00ada9">
            <ERPIcon antIcon="BellOutlined" style={{ fontSize: "18px" }} />
          </Badge>
        </div>
        <Dropdown menu={{ items: items }} trigger={["click"]} placement="bottomLeft">
          <div className="d-flex align-items-center" style={{ cursor: "pointer" }}>
            <ERPIcon antIcon="UserOutlined" style={{ fontSize: "18px" }} className="mr-2" />
            <span style={{ fontSize: "15px", fontWeight: "600" }}>{`${profile?.user?.first_name ?? ""} ${profile?.user?.last_name ?? ""}`}</span>
          </div>
        </Dropdown>
      </>
    )
  }
}

export default compose(
  connect(null, { setUserProfile }),
  WithUserbox
)(Userbox)
