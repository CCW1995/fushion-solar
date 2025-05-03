import React, { Component } from "react";
import { connect } from "react-redux";
import Hamburger from "react-hamburgers";

import {
  setEnableClosedSidebar,
  setEnableMobileMenu,
  setEnableMobileMenuSmall,
} from "reducers/themeOptions";

import MobileMenu from "../Menu/MobileMenu";
import './index.scss'

class Logo extends Component {
  state = {
    active: false,
    mobile: false,
    activeSecondaryMenuMobile: false,
  };

  render = () => {
    return (
      <>
        <div className="app-header__logo custom-header-logo">
          <div className="header__pane ml-auto">
            <div
              onClick={() =>
                this.props.setEnableClosedSidebar(
                  !this.props.enableClosedSidebar
                )
              }
            >
              <Hamburger
                active={!this.props.enableClosedSidebar}
                type="elastic"
                onClick={() => this.setState({ active: !this.state.active })}
              />
            </div>
          </div>
        </div>
        <MobileMenu />
      </>
    );
  };
}

const mapStateToProps = (state) => ({
  enableClosedSidebar: state.ThemeOptions.enableClosedSidebar,
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
  enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
});

export default connect(mapStateToProps, {
  setEnableClosedSidebar,
  setEnableMobileMenu,
  setEnableMobileMenuSmall,
})(Logo);
