import React from "react";
import { connect } from "react-redux";
import cx from "classnames";
import CustomButon from "components/Button";

const PageTitle = ({
  enablePageTitleIcon,
  enablePageTitleSubheading,
  icon,
  heading,
  subheading,
  buttons,
  titleActionsStyle,
  titleActionsClass,
  appPageTitleClass,
  pageTitleHeadingClass
}) => {
  return (
    <div className={`app-page-title ${appPageTitleClass || ""}`}>
      <div className="page-title-wrapper">
        <div className={`page-title-heading ${pageTitleHeadingClass}`}>
          {icon && (
            <div
              className={cx("page-title-icon", {
                "d-none": !enablePageTitleIcon,
              })}>
              <i className={icon} />
            </div>
          )}
          <div>
            {heading}
            <div
              className={cx("page-title-subheading", {
                "d-none": !enablePageTitleSubheading,
              })}>
              {subheading}
            </div>
          </div>
        </div>

        <div
          style={{ ...titleActionsStyle }}
          className={`page-title-actions ${titleActionsClass || ""}`}>
          {buttons?.[0] &&
            buttons.map((item, index) => {
              if (item.render) {
                return item.render(index)
              } else {
                return (
                  !item.hide &&
                  <CustomButon
                    color={item.color}
                    customClass={`d-flex align-items-center ${item.className || ""}`}
                    disabled={item.disabled}
                    onClick={item.onClick}
                    key={index}>
                    {item.children}
                  </CustomButon>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  enablePageTitleIcon: state.ThemeOptions.enablePageTitleIcon,
  enablePageTitleSubheading: state.ThemeOptions.enablePageTitleSubheading,
});

export default connect(mapStateToProps)(PageTitle);
