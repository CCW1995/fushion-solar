import { useEffect, useState } from "react"
import _ from "lodash"
import moment from "moment"

import ERPCard from "components/Card"
import ERPButton from "components/Button"
import FormInput from "components/Input/formInput"
import ERPCardHeader from "components/Card/header"
import ERPCheckbox from "components/Input/checkbox"
import FormDatePicker from "components/Input/datePicker"
import ConfirmationModal from "components/Modal/confirmation"

import { capitalizeEachFirstLetter } from "utils/capitalize"
import { approvalStatusBadge, renderApprovalLabel } from './assets';

import "./index.scss"

export default function ApprovalActionDisplay({
  containerClass,
  containerStyle,
  workflowName,
  workflow,
  onToggleApprove,
  onToggleRework,
  onToggleReject,
  CP58,
  showPaymentDate,
  showAllowInputGLCode,
  customGreenButtonLabel,
  needAlertModal,
  alertModalContent,
  customText
}) {

  const [approvalActionConfirmation, setApprovalActionConfirmation] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [clusterToShow, setClusterToShow] = useState([])
  const [approvalDecision, setApprovalDecision] = useState({ decision: "", action: "", id: "", remark: "", is_cp_58: CP58 ?? false })

  useEffect(() => {
    if (!_.isEmpty(workflow)) {
      setClusterToShow(_.map(workflow?.clusters?.[workflow?.current_cluster], tier => { return ({ ...tier, is_cp_58: CP58 ? true : false }) }))
    }
  }, [workflow]);

  const onToggleApproval = () => {
    const approvalAction = {
      ...approvalDecision,
      id: approvalDecision.tier.id,
      remark: approvalDecision.tier.remark,
      is_cp_58: approvalDecision.tier.is_cp_58 ?? false,
      payment_date: approvalDecision.payment_date,
    }

    switch (approvalAction.decision) {
      case "rework":
        onToggleRework(approvalAction)
        break
      case "reject":
        onToggleReject(approvalAction)
        break
      case "verify":
      case "approve":
        onToggleApprove(approvalAction)
        break
      default:
        break
    }
    setApprovalActionConfirmation(false)
  }

  return (
    <>
      <ERPCard mode={"default"} containerStyle={containerStyle} containerClass={containerClass}>
        <ERPCardHeader title={"APPROVAL ACTION"} />
        {clusterToShow?.map((tier) => {
          if (tier.status === "pending" && tier.can_perform_action) {
            return (
              <ERPCard
                mode={"borderless"}
                containerClass={"ERP-approval-workflow-component__approval-party mb-2"}>

                <p>
                  <span>Status:</span>
                  {approvalStatusBadge(tier?.status, tier?.action)}
                </p>
                <p>
                  <span>{renderApprovalLabel(tier)}:</span>
                  {tier?.user
                    ? capitalizeEachFirstLetter(`${tier?.user?.first_name ?? "-"} ${tier?.user?.last_name ?? ""} ${tier?.approval_workflow_tier?.is_mandatory ? "" : " (Optional)"}`)
                    : capitalizeEachFirstLetter(`${tier?.approval_workflow_tier?.sec_group?.name ?? ""} ${tier?.approval_workflow_tier?.is_mandatory ? "" : " (Optional)"}`)
                  }
                </p>
                {showAllowInputGLCode && (
                  <p>
                    <span>Input GL Code:</span>
                    {tier.allow_input_gl_code ? "Yes" : "No"}
                  </p>
                )}
                <p>
                  <span>Date:</span>
                  {moment(tier.updated_at).format('DD/MM/YYYY')}
                </p>
                <p>
                  <span>Time:</span>
                  {moment(tier.updated_at).format('h:mma')}
                </p>

                {tier?.remark && tier.status !== "pending" && (
                  <p>
                    <span>Remarks:</span>
                    {tier?.remark}
                  </p>
                )}

                {showPaymentDate && (
                  <>
                    <p>
                      <span>Payment Date:</span>
                    </p>
                    <FormDatePicker
                      inputSize={"sm"}
                      context={"payment_date"}
                      value={approvalDecision.payment_date}
                      required={true}
                      onChangeData={val => {
                        let temp = _.cloneDeep(approvalDecision)
                        temp.payment_date = val
                        setApprovalDecision(temp)
                      }}
                    />
                  </>
                )}

                <p>
                  <span>Remarks:</span>
                </p>
                <FormInput
                  inputSize={"sm"}
                  inputStyle={{ minHeight: "100px" }}
                  type="textarea"
                  context="remarks"
                  value={tier?.remark ?? ""}
                  maxLength={500}
                  placeholder={"Remarks"}
                  onChangeData={val => {
                    let temp = _.cloneDeep(clusterToShow)
                    const target = _.findIndex(temp, { id: tier.id })
                    temp[target] = { ...temp[target], remark: val }
                    setClusterToShow(temp)
                  }}
                />

                {CP58 !== undefined && (
                  <ERPCheckbox
                    type="checkbox"
                    label={"CP 58"}
                    style={{ marginRight: "10px", marginBottom: "6px" }}
                    checked={tier?.is_cp_58}
                    disabled={!tier?.allow_input_gl_code}
                    onChangeData={(val) => {
                      let temp = _.cloneDeep(clusterToShow)
                      const target = _.findIndex(temp, { id: tier.id })
                      temp[target] = { ...temp[target], is_cp_58: val }
                      setClusterToShow(temp)
                    }}
                  />
                )}

                <div className="d-flex gap-1">
                  {onToggleReject &&
                    <ERPButton
                      customClass={"w-100"}
                      color={"red"}
                      size={"sm"}
                      onClick={() => {
                        setApprovalActionConfirmation(true)
                        setApprovalDecision({ ...approvalDecision, decision: "reject", action: "", tier: tier })
                      }}
                      children={"Reject"} />
                  }

                  {onToggleRework &&
                    <ERPButton
                      customClass={"w-100"}
                      color={"lightgray"}
                      size={"sm"}
                      onClick={() => {
                        setApprovalActionConfirmation(true)
                        setApprovalDecision({ ...approvalDecision, decision: "rework", action: "", tier: tier })
                      }}
                      children={"Rework"} />
                  }

                  {onToggleApprove &&
                    <ERPButton
                      customClass={"w-100"}
                      color={"green"}
                      size={"sm"}
                      onClick={() => {
                        setApprovalActionConfirmation(true)
                        setApprovalDecision({ ...approvalDecision, decision: tier?.action === 'verified by' ? 'verify' : 'approve', action: tier?.action, tier: tier })
                      }}
                      children={customGreenButtonLabel ?? (tier?.action === 'verified by' ? 'Verify' : 'Approve')} />
                  }
                </div>
              </ERPCard>
            )
          }
        })}
      </ERPCard >

      <ConfirmationModal
        isOpen={showAlert}
        message={alertModalContent}
        onClickRightAction={() => {
          setShowAlert(false)
          setApprovalActionConfirmation(true)
        }}
        onClickLeftAction={() => setShowAlert(false)}
        onClose={() => setShowAlert(false)}
      />
      <ConfirmationModal
        isOpen={approvalActionConfirmation}
        message={
          <>
            {customText && <p>{customText}</p>}
            <p>{`Are you sure to ${customGreenButtonLabel ? "submit approval workflow for" : approvalDecision?.decision} this ${workflowName} ?`}</p>
          </>
        }
        onClickRightAction={() => onToggleApproval()}
        onClickLeftAction={() => setApprovalActionConfirmation(false)}
        onClose={() => setApprovalActionConfirmation(false)}
      />
    </>
  );
};

