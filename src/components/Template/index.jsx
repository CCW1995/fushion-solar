import React, { Component, Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import cx from "classnames";

const Main = (props) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    colorScheme,
    enableFixedHeader,
    enableFixedSidebar,
    enableFixedFooter,
    enableClosedSidebar,
    closedSmallerSidebar,
    enableMobileMenu,
    enablePageTabsAlt,
  } = props;

  return (
    <Fragment>
      <div
        className={cx(
          "app-container app-theme-" + colorScheme,
          { "fixed-header": enableFixedHeader },
          { "fixed-sidebar": enableFixedSidebar || width < 1250 },
          { "fixed-footer": enableFixedFooter },
          { "closed-sidebar": enableClosedSidebar || width < 1250 },
          { "closed-sidebar-mobile": closedSmallerSidebar || width < 1250 },
          { "sidebar-mobile-open": enableMobileMenu },
          { "body-tabs-shadow-btn": enablePageTabsAlt }
        )}
      >
        {props.children}
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  colorScheme: state.ThemeOptions.colorScheme,
  enableFixedHeader: state.ThemeOptions.enableFixedHeader,
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
  enableFixedFooter: state.ThemeOptions.enableFixedFooter,
  enableFixedSidebar: state.ThemeOptions.enableFixedSidebar,
  enableClosedSidebar: state.ThemeOptions.enableClosedSidebar,
  enablePageTabsAlt: state.ThemeOptions.enablePageTabsAlt,
});

export default connect(mapStateToProps)(Main);
