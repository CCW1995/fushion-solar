import React from "react"
import { Row, Col } from "antd"

import { textareaDisplayContent } from "utils/textareaDisplayContent";
import "./index.scss";

// timelines array example

const VerticalTimeline = ({
  timelines, // list of timelines (Array)
  timelineContainerStyle,
  elementStyle,
  titleStyle,
  rightTitleStyle,
  subtitleStyle,
  remarkStyle,
  footerStyle
}) => {
  return (
    <div className="vertical-timeline-with-end" style={timelineContainerStyle}>
      {timelines.map((element) => (
        <div className="vertical-timeline-element-with-end" style={elementStyle}>
          {element.icon ? element.icon : <div className="vertical-timeline-element-dot" />}
          <div className="vertical-timeline-element-content">
            <Row gutter={8}>
              <Col xl={16} lg={16} md={24} sm={24} xs={24}>
                <p className="title" style={titleStyle}>
                  {element.title}
                  {element.sideTitle && (
                    <span style={{ marginLeft: "4px", color: "#A7A7A7", fontStyle: "italic", fontWeight: "normal" }}>({element.sideTitle})</span>
                  )}
                </p>
              </Col>
              <Col xl={8} lg={8} md={24} sm={24} xs={24} className="text-lg-right mb-1 mb-lg-0" style={rightTitleStyle}>{element.rightTitle}</Col>
            </Row>
            <p className="subtitle" style={subtitleStyle}>{element.subtitle}</p>
            <div className="d-flex gap-1">
              {element.status_details && <span style={{ color: "#A7A7A7", fontStyle: "italic", fontWeight: "normal" }}>{element.status_details}</span>}
              {element.location && <span style={{ color: "#A7A7A7", fontStyle: "italic", fontWeight: "normal" }}>({element.location})</span>}
            </div>
            {element.remark && (
              <Row gutter={8} className="remark" style={remarkStyle}>
                <Col>
                  <p className="mb-0">Remark: </p>
                </Col>
                <Col>
                  <p className="mb-0" style={{ wordBreak: "break-word" }}>{textareaDisplayContent(element.remark)}</p>
                </Col>
              </Row>
            )}
            {element.content && element.content}
            <p className="footer" style={footerStyle}>{element.footer}</p>
          </div>
        </div>
      ))}

    </div>
  )
}

export default VerticalTimeline
