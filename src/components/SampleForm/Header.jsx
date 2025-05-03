import React from "react";
import { Row, Col } from "antd";

import "./index.scss";

const FormHeader = ({
  headerTitle,
  headerTitleStyle,
  subheaders = [],
  subheaderColumnSize,
}) => {
  return (
    <header className="header-title">
      <div style={{ marginBottom: "8px", ...headerTitleStyle }}>
        {headerTitle}
      </div>

      <Row gutter={8}>
        {subheaders.map((subheader, index) => (
          <Col
            key={`subheader-${index}`} md={subheaderColumnSize || 6} style={{ display: "inline-flex", height: "16px" }}>
            <div className="subheader-label" style={{ marginBottom: "0px" }}>
              {subheader.subheaderLabel}:
            </div>
            &nbsp; &nbsp;
            <div className="subheader-content" style={{ marginBottom: "0px" }}>
              {subheader.subheaderContent}
            </div>
          </Col>
        ))}
      </Row>
    </header>
  );
};

export default FormHeader;
