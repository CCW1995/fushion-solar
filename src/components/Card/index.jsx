import React from "react";
import "./index.scss";

const CustomCard = ({
  mode, //default, borderless, dashed
  containerClass,
  containerStyle,
  children,
  scrollable
}) => {
  const cardContentStyle = scrollable ? { maxHeight: "400px", overflowX: "auto" } : {}

  return (
    <div
      style={{ ...containerStyle, ...cardContentStyle }}
      className={`custom-card custom-card-${mode || "default"} ${containerClass || ""}`}
    >
      {children}
    </div>
  );
};

export default CustomCard;