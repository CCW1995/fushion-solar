import React, { useState, useEffect } from "react";
import moment from "moment";
import _ from "lodash";
import { Row, Col } from "antd";

import CustomCard from "components/Card";
import ERPIcon from "components/Icon";
import ERPBadge from "components/Badge";
import ERPTimeline from "components/Timeline";

import { capitalizeEachFirstLetter } from "utils/capitalize"

const StatusTimeline = ({ selectedObjectTimelines, darkButton, ...props }) => {
  const [timelineItems, setTimelineItems] = useState([])

  const renderStatusBadge = (value) => {
    if (["Approved", "Delivered"].includes(value)) {
      return <ERPBadge content={value} color="success" />;
    } else if (["In Progress", "Ready To Ship", "Created", "Reworked", "Rework"].includes(value)) {
      return <ERPBadge content={value} color="warning" />;
    } else if (["Rejected", "Expired"].includes(value)) {
      return <ERPBadge content={value} color="danger" />;
    } else if (darkButton?.includes(value)) {
      return <ERPBadge content={value} color="dark" />;
    } else {
      return <ERPBadge content={value} color="secondary" />;
    }
  };

  const renderImageContent = param => {
    if (param.sales_order?.delivery_confirmation_pod) {
      return (
        <Row gutter={[16, 8]} className="mb-2">
          <Col lg={12} md={12} sm={24} xs={24}>
            {/* <CustomCard
              mode={"default"}
              containerStyle={{ backgroundColor: '#F9FAFB', gap: 8 }}> */}
            <span style={{ color: '#667085' }}>POD Upload:</span>
            <div className={`custom-file-upload cursor-pointer`}
              onClick={() => props.getImages(param.id)}>
              <div className='d-flex align-items-center'>
                <div className='custom-uploaded-file'>
                  <div className={`custom-uploaded-file__icon`}>
                    <ERPIcon featherIcon='FiImage' />
                  </div>
                  <div className='d-flex flex-column'>
                    <h2>{param?.file_name}</h2>
                    <span>{Number(param.file_size) / 1000} KB</span>
                  </div>
                  <ERPIcon featherIcon='FiEye' className={'ml-auto'} />
                </div>
              </div>
            </div>
            {/* </CustomCard> */}
          </Col>
        </Row>
      )
    } else {
      return null
    }
  }

  const formatText = (text) => _.replace(text, /\b(Cn|Dn)\b/g, match => match.toUpperCase());

  useEffect(() => {
    if (!_.isEmpty(selectedObjectTimelines) && selectedObjectTimelines.length !== 0) {
      const status_timelines = _.cloneDeep(selectedObjectTimelines).sort((a, b) => b.id - a.id)
      let timelines = _.map(status_timelines, (item) => {
        return {
          title: item.doc_no
            ? formatText(`${item.title} (${item.doc_no})`)
            : formatText(item.title),
          subtitle: item.description.endsWith("by")
            ? item?.creator
              ? formatText(`${item.description} ${capitalizeEachFirstLetter(item?.creator?.first_name ?? "")} ${capitalizeEachFirstLetter(item?.creator?.last_name ?? "")}`)
              : formatText(`${item.description} ${item?.created_by_user ?? ""}`)
            : formatText(item.description),
          rightTitle: renderStatusBadge(item.status),
          footer: moment(item.created_at).format("DD/MM/YYYY") + " at " + moment(item.created_at).format("h:mma"),
          remark: item.status == "Created" ? "" : (item.remark ?? ""),
          content: item.content || renderImageContent(item)
        }
      })
      setTimelineItems(timelines)
    }
  }, [selectedObjectTimelines]);

  return <ERPTimeline timelines={timelineItems} />;
};

export default StatusTimeline;
