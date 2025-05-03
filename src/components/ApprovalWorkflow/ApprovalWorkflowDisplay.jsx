import _ from "lodash"
import { Col } from "antd"

import { determineDisplayName } from './assets';

export default function ApprovalWorkflowDisplay({
  containerClass,
  containerStyle,
  workflow,
}) {
  const allWorkflow = _.filter(_.flattenDeep(workflow?.clusters), {validTAH: true})
  const workflowByLevel = _.uniqBy(allWorkflow, "approval_workflow_level_id")

  return (
    <div style={containerStyle || {}} className={containerClass || ""}>
      {workflowByLevel.map(level => (
        <>
          <span className="text-s font-weight-bold my-auto" >{level.action === 'verified by' ? 'To be Verified By' : 'To be Approved By'}</span>
          <Col xl={24} lg={24} md={24} sm={24} xs={24} className="align-items-bottom justify-content-between">
            <div className="align-items-center justify-content-end">
              <ul className="pl-4 mt-2">
                {_.filter(allWorkflow, workflow => workflow?.approval_workflow_level_id === level?.approval_workflow_level_id).map((setting, index) => (
                  <li>
                    <span key={index} className=" gap-2 text-s">
                      {determineDisplayName(setting)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </>
      ))}
    </div>
  );
};

