import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Row, Col, Empty } from "antd";

import ERPTab from "components/Tab";
import ERPIcon from "components/Icon";
import PageTitle from "components/Title/PageTitle";
import LoadingOverlay from "components/Indicator/LoadingOverlay";

import PrintJobStatuses from "./PrintJobStatuses";
import ApprovalNotifications from "./ApprovalNotifications";
import ERPDashboard from "containers/Dashboard/ZitronDashboard";

import { connect } from "react-redux";
import { setPath } from "actions/path";
import { tabPermission } from "utils/tabPermission";
import { storeItem, getItem } from "utils/tokenStore";
import {
  PRINT_JOB_STATUSES_LABEL,
  APPROVAL_NOTIFICATIONS,
  QUICK_ACCESS,
} from "utils/labels"

const labels = [
  { label: QUICK_ACCESS },
  { label: PRINT_JOB_STATUSES_LABEL },
  { label: APPROVAL_NOTIFICATIONS },
]

const InventoryContainer = (props) => {
  const permittedTabs = tabPermission(window.location.href.includes("/admin-impersonate")
    ? props.data.ImpersonateProfileReducer.subModule
    : props.data.ProfileReducer.subModule, labels)

  const [selectedSubpageTab, setSelectedSubpageTab] = useState("")
  const [pageHeading, setPageHeading] = useState(QUICK_ACCESS);
  const [titleButtonClick, setTitleButtonClick] = useState(false);

  useEffect(() => {
    if (props.history.location.search) {
      const searchParams = new URLSearchParams(props.history.location.search);
      const moduleName = searchParams.get('moduleName')
      if (moduleName) {
        props.history.replace({ search: '' })
        setSelectedSubpageTab(moduleName)
      }
    } else {
      const lastViewModule = getItem("LAST_VIEW_MODULE")
      if (lastViewModule && permittedTabs.find(tab => tab.label === lastViewModule)) {
        setSelectedSubpageTab(lastViewModule)
      } else {
        setSelectedSubpageTab(permittedTabs?.[0]?.label ?? "")
      }
    }
  }, [])

  useEffect(() => {
    props.setPath([
      { label: "Dashboard" },
      { label: "Main" },
      { label: selectedSubpageTab }
    ])
    storeItem("LAST_VIEW_MODULE", selectedSubpageTab)
  }, [selectedSubpageTab])

  const onChangeHeading = (heading) => {
    switch (heading) {
      case PRINT_JOB_STATUSES_LABEL:
        setPageHeading(PRINT_JOB_STATUSES_LABEL);
        break;
      case QUICK_ACCESS:
        setPageHeading(QUICK_ACCESS)
        break;
      case APPROVAL_NOTIFICATIONS:
        setPageHeading(APPROVAL_NOTIFICATIONS)
        break;
    }
    setSelectedSubpageTab(heading);
  };

  return (
    <>
      {permittedTabs?.length > 0 && (
        <>
          <PageTitle
            heading={pageHeading}
            buttons={[
              // {
              //   color: "red",
              //   onClick: () => setTitleButtonClick(!titleButtonClick),
              //   children: (
              //     <>
              //       <ERPIcon antIcon="PlusOutlined" />
              //       <span>Create</span>
              //     </>
              //   )
              // }
            ]}
            titleActionsStyle={{ display: "flex", gap: "8px" }}
          />
          <ERPTab
            tabSections={permittedTabs}
            selectedSection={selectedSubpageTab}
            onChangeSection={onChangeHeading}
          />
        </>
      )}

      <Row style={selectedSubpageTab === QUICK_ACCESS ? { margin: "0px 24px" } : {}}>
        <Col span={24}>
          {selectedSubpageTab == QUICK_ACCESS && (
            <ERPDashboard
              {...props}
              module_id={_.find(permittedTabs, { label: QUICK_ACCESS })?.id}
              titleButtonClick={titleButtonClick}
              setTitleButtonClick={setTitleButtonClick}
            />
          )}
          {selectedSubpageTab == PRINT_JOB_STATUSES_LABEL && (
            <PrintJobStatuses
              module_id={_.find(permittedTabs, { label: PRINT_JOB_STATUSES_LABEL })?.id}
              titleButtonClick={titleButtonClick}
              setTitleButtonClick={setTitleButtonClick}
            />
          )}
          {selectedSubpageTab == APPROVAL_NOTIFICATIONS && (
            <ApprovalNotifications
              {...props}
              module_id={_.find(permittedTabs, { label: APPROVAL_NOTIFICATIONS })?.id}
              titleButtonClick={titleButtonClick}
              setTitleButtonClick={setTitleButtonClick}
            />
          )}
        </Col>
      </Row>

      {permittedTabs?.length === 0 && (
        <Empty
          image={<ERPIcon featherIcon={'FiXOctagon'} style={{ width: 80 }} />}
          style={{ marginTop: "10rem" }}
          description="You don't have the permission to access this module." />
      )}

      {props.onLoadInventory && <LoadingOverlay />}
    </>
  );
};

const mapStateToProps = (state) => ({ data: state });
export default connect(mapStateToProps, { setPath })(InventoryContainer);