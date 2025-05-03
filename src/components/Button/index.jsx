import React from "react";
import { Button } from "reactstrap";
import { Tooltip } from "antd";

import "./index.scss";

const CustomButton = ({
  color, // primary, white, red, borderless
  size = "md", // sm, lg
  tooltip, // true, false
  tooltipTitle, // add, edit, delete
  onClick, //function
  children,
  customStyle, // { padding: 10 }
  customClass, // "d-flex align-items-center"
  disabled
}) => {
  const button = (
    <Button
      style={{ ...customStyle }}
      className={`custom-button custom-button__${color} ${customClass || ""}`}
      size={size}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );

  return tooltip ? (
    <Tooltip placement="top" title={tooltipTitle}>
      {button}
    </Tooltip>
  ) : (
    button
  );
};

export default CustomButton;
