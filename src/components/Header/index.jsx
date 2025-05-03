import React from "react";
import cx from "classnames";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from "react-redux";

import BreadcrumbComponent from "components/Breadcrumb";
import HeaderLogo from "./Logo";
import Userbox from "./Userbox";

import "./index.scss";

const Header = ({
  headerBackgroundColor,
  enableMobileMenuSmall,
  enableHeaderShadow,
  history,
  onClickToggleProfileModal,
  user,
}) => {
  return (
    <>
      <TransitionGroup component="div" className={cx("app-header", headerBackgroundColor)}>
        <HeaderLogo />
        <div
          className={cx("app-header__content", {
            "header-mobile-open": enableMobileMenuSmall,
          })}
        >
          <div className="app-header-left">
            <BreadcrumbComponent />
          </div>
          <div className="app-header-right">
            <Userbox
              onClickToggleProfileModal={onClickToggleProfileModal}
              history={history}
              user={user}
            />
          </div>
        </div>
      </TransitionGroup>
    </>
  );
};

const mapStateToProps = (state) => ({
  enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
  closedSmallerSidebar: state.ThemeOptions.closedSmallerSidebar,
  headerBackgroundColor: state.ThemeOptions.headerBackgroundColor,
  enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
