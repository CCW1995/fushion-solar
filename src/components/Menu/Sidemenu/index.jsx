import React, { Component } from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PerfectScrollbar from "react-perfect-scrollbar";

import HeaderLogo from "components/Header/Logo";
import VerticalNavWrapper from "components/Menu/VerticalNavWrapper";

import { setEnableMobileMenu } from "reducers/themeOptions";
import DCHLogo from "assets/dch-logo.svg";
import { version } from "../../../../package.json";
import './index.scss'

class Sidemenu extends Component {
  render = () => {
    return (
      <>
        <div
          className="sidebar-mobile-overlay"
          onClick={() => this.props.setEnableMobileMenu(!this.props.enableMobileMenu)}
        />
        <TransitionGroup
          component="div"
          className={cx("app-sidebar", this.props.backgroundColor, {
            "sidebar-shadow": this.props.enableSidebarShadow,
          })}
        >
          <CSSTransition
            classNames="SidebarAnimation"
            appear={true}
            timeout={1500}
            enter={false}
            exit={false}
          >
            <PerfectScrollbar>
              <HeaderLogo />
              <div className="app-sidebar__inner">
                <div
                  className="app-sidebar__logo"
                  onClick={() => {
                    if (window.location.href.includes("/admin-impersonate")) {
                      this.props.history.push("/admin-impersonate/dashboard/main")
                    } else {
                      this.props.history.push("/dashboard/main")
                    }
                  }}
                >
                  <img src={DCHLogo} alt={"app-logo"} style={{ maxWidth: 165 }} />
                </div>
                <VerticalNavWrapper {...this.props} />
                <p style={{ color: 'white' }}>v{version}</p>
              </div>
            </PerfectScrollbar>
          </CSSTransition>
        </TransitionGroup>
      </>
    );
  };
}

const mapStateToProps = (state) => ({
  enableBackgroundImage: state.ThemeOptions.enableBackgroundImage,
  enableSidebarShadow: state.ThemeOptions.enableSidebarShadow,
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
  backgroundColor: state.ThemeOptions.backgroundColor,
  backgroundImage: state.ThemeOptions.backgroundImage,
  backgroundImageOpacity: state.ThemeOptions.backgroundImageOpacity,
});

export default connect(mapStateToProps, {
  setEnableMobileMenu,
})(Sidemenu);
