import React from "react"
import { Alert } from "reactstrap"

import "./index.scss"

const CustomAlert = ({
  color, //primary, secondary, success, danger, warning, info
  alertClass,
  alertStyle,
  children,
  isOpen, //control visibility state
  toggle, //toggle visibility
}) => {
  return (
    <Alert
      color={color || "primary"}
      className={alertClass || ""}
      style={{ ...alertStyle }}
      isOpen={isOpen}
      toggle={toggle}
    >
      {children}
    </Alert>
  )
}

export default CustomAlert