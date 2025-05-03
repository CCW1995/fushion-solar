import React, { Component } from "react";
import { connect } from "react-redux";
import Hamburger from "react-hamburgers";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import cx from "classnames";

import {
  setEnableMobileMenu,
  setEnableMobileMenuSmall,
} from "reducers/themeOptions";

class MobileMenu extends Component {
  state = {
    active: false,
    mobile: false,
    activeSecondaryMenuMobile: false,
  };

  render = () => {
    return (
      <>
        <div className="app-header__mobile-menu">
          <div onClick={() => this.props.setEnableMobileMenu(!this.props.enableMobileMenu)}>
            <Hamburger
              active={this.props.enableMobileMenu}
              type="elastic"
              onClick={() => this.setState({ active: !this.state.active })}
            />
            {/* {getItem("ERP_USER_TYPE") === "non-case" && (
            )} */}
          </div>
        </div>
        <div className="app-header__menu">
          <span
            onClick={() =>
              this.props.setEnableMobileMenuSmall(
                !this.props.enableMobileMenuSmall
              )
            }
          >
            <Button
              size="sm"
              className={cx("btn-icon btn-icon-only", {
                active: this.state.activeSecondaryMenuMobile,
              })}
              color="primary"
              onClick={() =>
                this.setState({
                  activeSecondaryMenuMobile:
                    !this.state.activeSecondaryMenuMobile,
                })
              }
            >
              <div className="btn-icon-wrapper">
                <FontAwesomeIcon icon={faEllipsisV} />
              </div>
            </Button>
          </span>
        </div>
      </>
    );
  };
}

const mapStateToProps = (state) => ({
  closedSmallerSidebar: state.ThemeOptions.closedSmallerSidebar,
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
  enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
});

export default connect(mapStateToProps, {
  setEnableMobileMenu,
  setEnableMobileMenuSmall,
})(MobileMenu);
