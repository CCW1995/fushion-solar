import { useEffect, useState } from "react"
import { Row, Col } from "antd"
import _ from "lodash"

import { LEVEL_TYPE, TIER_TYPE } from "./assets"
import ERPCard from "components/Card"
import CustomCard from "components/Card";
import ERPCardHeader from "components/Card/header"
import CustomTypeahead from "components/Input/typeahead"
import ERPCheckbox from "components/Input/checkbox"

export default function ApprovalWorkflowForm({
  formData,
  updateFormData,
  showInputGLCode,
  approvalWorkflowOptions,
  getApprovalWorkflowOption,
  orgId,
  userOptions,
  getUsersOption,
  disable,
  errors
}) {
  const [rerender, setRerender] = useState(false)

  useEffect(() => {
    if (rerender) {
      setRerender(false)
    }
  }, [rerender])

  useEffect(() => {
    if (orgId && _.isEmpty(formData?.approval_settings)) {
      getApprovalWorkflowOption(orgId)
    }
  }, [orgId])

  useEffect(() => {
    if (formData.approval_workflow_id) {
      const selected = _.find(approvalWorkflowOptions, { id: formData.approval_workflow_id })
      const previouslySetDatas = _.flattenDeep(formData?.approval_workflow_details?.clusters)
      let approvalSetting = []
      selected?.approval_workflow_levels?.forEach((level) => {
        level.approval_workflow_tiers.forEach((tier, tierIndex) => {
          const fetchedData = previouslySetDatas?.find(item => item.approval_workflow_tier_id === tier.id)
          if (tier.type === "employee") {
            approvalSetting.push({
              index: tierIndex,
              action: level.action,
              user_id: [{ id: tier.user?.id ?? "", label: `${tier.user?.first_name ?? ""} ${tier.user?.last_name ?? ""}` }],
              level_id: level.id,
              tier_id: tier.id,
              tier_type: tier.type,
              is_mandatory: tier.is_mandatory,
              is_anyone_can_performed: tier.is_anyone_can_performed
            })
          } else if (tier.type === "user group") {
            approvalSetting.push({
              index: tierIndex,
              action: level.action,
              sec_group_id: [{ id: tier.sec_group?.id, label: tier.sec_group?.name }],
              user_id: tier.is_anyone_can_performed
                ? [{ id: tier.sec_group?.id, label: tier.sec_group?.name }]
                : [{ id: fetchedData?.user_id ?? "", label: fetchedData?.user ? `${fetchedData?.user?.first_name ?? ""} ${fetchedData?.user?.last_name ?? ""}` : "" }],
              level_id: level.id,
              tier_id: tier.id,
              tier_type: tier.type,
              is_mandatory: tier.is_mandatory,
              is_anyone_can_performed: tier.is_anyone_can_performed
            })
          }
        })
      })
      updateFormData({ ...formData, approval_settings: approvalSetting, selectedWorkflow: selected })
    }
  }, [formData.approval_workflow_id, approvalWorkflowOptions])

  const updateApprovalSettings = (index, tier_type, action, user_id, level_id, tier_id, is_mandatory, is_anyone_can_performed) => {
    const tmp = _.cloneDeep(formData)
    const settingIndex = _.findIndex(tmp.approval_settings, { action: action, index: index, level_id: level_id, tier_id: tier_id })
    if (settingIndex > -1) {
      tmp.approval_settings[settingIndex] = { action, index, tier_type, user_id, level_id, tier_id, is_mandatory, is_anyone_can_performed }
    } else {
      tmp.approval_settings.push({ action, index, tier_type, user_id, level_id, tier_id, is_mandatory, is_anyone_can_performed })
    }
    updateFormData({ ...formData, approval_settings: tmp.approval_settings })
  }

  const renderApprovelTier = (level, tier, tierIndex) => {
    const options = tier.type === 'employee'
      ? [{ id: tier.user?.id, uuid: tier.user.employee_id, label: (tier.user?.first_name ?? "") + " " + (tier.user?.last_name ?? "") }]
      : userOptions

    return (
      <>
        <Col span={6}>
          <CustomTypeahead
            inputSize={"sm"}
            options={TIER_TYPE || []}
            value={
              !_.isEmpty(_.find(TIER_TYPE, { value: tier.type }))
                ? [_.find(TIER_TYPE, { value: tier.type })]
                : []
            }
            placeholder={"Select Tier Type"}
            labelKey={"label"}
            filterBy={["value"]}
            columnData={[{ label: "Tier Type", key: "label" }]}
            disabled={true}
          />
        </Col>
        <Col span={6}>
          <CustomTypeahead
            row={true}
            inputSize={"sm"}
            inputStyle={{ minWidth: 100 }}
            labelStyle={{ width: 50 }}
            labelClass={"d-flex align-items-center m-auto"}
            options={options ?? []}
            context={`approval_settings_${level.id}_${tierIndex}`}
            value={
              _.find(formData.approval_settings, {
                action: level.action,
                level_id: level.id,
                tier_id: tier.id
              })?.user_id || (tier.sec_group
                ? tier.is_anyone_can_performed
                  ? [{ 'label': tier?.sec_group?.name }]
                  : []
                : []
              )}
            disabled={disable || tier.type === "employee" || tier.is_anyone_can_performed}
            labelKey={"label"}
            filterBy={["uuid", "label"]}
            onFocus={() => {
              if (tier.type === 'user group') {
                getUsersOption(tier.sec_group_id, orgId, level.action)
              }
            }}
            columnData={[
              { col: 4, label: "Employee ID", key: "uuid" },
              { col: 4, label: "Employee name", key: "label" },
            ]}
            onChangeData={val => {
              updateApprovalSettings(tierIndex, tier.type, level.action, val, level.id, tier.id, tier.is_mandatory, tier.is_anyone_can_performed)
            }}
          />
        </Col>
      </>
    )
  }
  return (
    <Col lg={24} md={24} sm={24} xs={24}>
      <CustomCard>
        <ERPCardHeader title={"APPROVAL SETTINGS"} />
        <Col span={24} className="pr-0">
          <CustomTypeahead
            inputSize={"sm"}
            row={true}
            labelCol={{ xl: 2, lg: 3, md: 3 }}
            inputCol={{ xl: 3, lg: 9, md: 9 }}
            options={approvalWorkflowOptions ?? []}
            context="approval_workflow_id"
            value={_.find(approvalWorkflowOptions, { id: formData.approval_workflow_id })
              ? [_.find(approvalWorkflowOptions, { id: formData.approval_workflow_id })]
              : []}
            label="Choose Approval Workflow"
            required={true}
            disabled={disable}
            labelKey={"workflow_name"}
            filterBy={["workflow_name"]}
            errors={errors}
            columnData={[
              { col: 6, label: "Approval Workflow", key: "workflow_name" },
            ]}
            onChangeData={val =>
              Promise.resolve(
                updateFormData({ ...formData, approval_workflow_id: val[0]?.id })
              ).then(() => {
                setRerender(true)
              })}
          />
        </Col>
        {!_.isEmpty(formData?.selectedWorkflow) && (
          <ERPCard mode={"dashed"} containerStyle={{ padding: "24px" }}>
            <ERPCardHeader
              title={formData?.selectedWorkflow?.workflow_name}
              titleClass="text-xs font-weight-bold text-light-grey"
            />
            <Row gutter={[8, 0]} className="mr-0">
              <Col span={5}><span className="text-light-grey font-weight-semibold text-xs">LEVEL</span></Col>
              <Col span={5}><span className="text-light-grey font-weight-semibold text-xs">CATEGORY</span></Col>
              <Col span={14}></Col>
              <Col span={24}>
                {formData?.selectedWorkflow?.approval_workflow_levels.map((level, levelIndex) => {
                  if (!level._destroy) {
                    return (
                      <Row key={`level_${levelIndex}`} gutter={[8, 0]}>
                        <Col span={5} className="my-1">
                          <CustomTypeahead
                            inputSize={"sm"}
                            options={LEVEL_TYPE || []}
                            context="action"
                            value={
                              !_.isEmpty(_.find(LEVEL_TYPE, { value: level.action }))
                                ? [_.find(LEVEL_TYPE, { value: level.action })]
                                : []
                            }
                            placeholder={"Select Level"}
                            labelKey={"label"}
                            filterBy={["value"]}
                            columnData={[{ label: "Level", key: "label" }]}
                            disabled={true}
                          />
                        </Col>
                        <Col span={19}>
                          {level.approval_workflow_tiers.map((tier, tierIndex) => {
                            if (!tier._destroy) {
                              return (
                                <Row key={`level_${levelIndex}_tier_${tierIndex}`} gutter={8} className="my-1">
                                  {renderApprovelTier(level, tier, tierIndex)}
                                  <Col span={12} className="d-flex gap-1 mt-1">
                                    <ERPCheckbox
                                      formGroupClass={"align-items-center"}
                                      style={{ fontWeight: "400", fontSize: "12px" }}
                                      label={"Mandatory"}
                                      checked={tier.is_mandatory}
                                      disabled={true}
                                    />
                                    {showInputGLCode && (
                                      <ERPCheckbox
                                        formGroupClass={"align-items-center"}
                                        style={{ fontWeight: "400", fontSize: "12px" }}
                                        label={"Input GL Code"}
                                        checked={tier.allow_input_gl_code}
                                        disabled={true}
                                      />
                                    )}
                                    {tier.type === "user group" && (
                                      <ERPCheckbox
                                        formGroupClass={"align-items-center"}
                                        style={{ fontWeight: "400", fontSize: "12px" }}
                                        label={"Anyone Can Approve"}
                                        checked={tier.is_anyone_can_performed}
                                        disabled={true}
                                      />
                                    )}
                                  </Col>
                                </Row>)
                            }
                          })}
                        </Col>
                      </Row>)
                  }
                })}
              </Col>
            </Row>
          </ERPCard>
        )}
      </CustomCard>
    </Col>
  )
};

