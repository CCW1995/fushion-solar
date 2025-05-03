import React from "react";
import { Switch } from "antd";

import "./index.scss";

// //Sample
// <CustomToggle
//   containerType={"default"}
//   labelClass={"default"}
//   label={"Organisation 1"}
//   checked={isChecked}
//   onChange={handleOnChange}
//   children={
//     <div style={{ padding: "2px 8px" }}>
//       {isChecked ? (
//         <UpOutlined />
//       ) : (
//         <DownOutlined />
//       )}
//     </div>
//   }
//   highlighted={isChecked ? true : false}
// />

const CustomToggle = ({
  containerType, //default, sub
  containerClass,
  containerStyle,
  labelClass,
  label,
  size, //default, small
  checked,
  onChange,
  children,
  onClickLabel,
  highlighted, //boolean (optional, for highlighting the checked item)
}) => {
  return (
    <>
      <div
        className={`toggle-container mb-1 ${highlighted ? "toggle-container-highlighted" : ""
          } toggle-container-${containerType}
          ${containerClass || ""}`}
        style={{ ...containerStyle }}>
        <p
          className={`m-0 text-sm text-truncate
          toggle-label ${highlighted ? "toggle-label-highlighted" : ""}
          toggle-label-${labelClass}`}
          onClick={onClickLabel}>
          {label || ""}
        </p>
        <div className="d-flex align-items-center">
          <Switch
            size={size || "default"}
            checked={checked}
            onChange={onChange}
          />
          {children}
        </div>
      </div>
    </>
  );
};

export default CustomToggle;