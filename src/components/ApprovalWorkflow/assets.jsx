import _ from "lodash"
import { capitalizeEachFirstLetter } from "utils/capitalize"
import ERPBadge from "components/Badge"

export const determineDisplayName = (workflow) => {
  const optional = workflow?.approval_workflow_tier?.is_mandatory ? "" : " (Optional)"
  // const inputGL = workflow.approval_workflow_tier?.allow_input_gl_code ? " (Input GL Code)" : ""
  let tempDisplay = ""

  if (workflow.approval_workflow_tier?.type === "user group") {
    tempDisplay += capitalizeEachFirstLetter(workflow?.approval_workflow_tier?.sec_group?.name ?? "");

    if (workflow.approval_workflow_tier?.is_anyone_can_performed) {
      tempDisplay += " - Anyone can approve";
    } else {
      tempDisplay += " - " + capitalizeEachFirstLetter(`${workflow?.user?.first_name ?? "-"} ${workflow?.user?.last_name ?? ""}`);
    }
    tempDisplay += optional;
  } else {
    tempDisplay = capitalizeEachFirstLetter(`${workflow?.user?.first_name ?? "-"} ${workflow?.user?.last_name ?? ""}`) + optional;
  }

  return tempDisplay;
}

export const approvalStatusBadge = (value, action = "") => {
  switch (value) {
    case "pending":
    case "pending approval":
      return <ERPBadge content={value} color="dark" />
    case "approved":
      if (action === "verified by") {
        return <ERPBadge content='Verified' color="primary" />
      } else {
        return <ERPBadge content='Approved' color="success" />
      }
    case "reworked":
    case "rework":
      return <ERPBadge content={value} color="warning" />
    case "rejected":
      return <ERPBadge content={value} color="danger" />
    case "verified":
      return <ERPBadge content={value} color="primary" />
    case "generated":
      return <ERPBadge content={value} color="primary" />
    default:
      return <ERPBadge content={value} color="secondary" />
  }
}

export const renderApprovalLabel = (history) => {
  if (history.status === "rejected") {
    return "Rejected By"
  } else if (history.status === "reworked") {
    return "Requested Rework By"
  } else if (history.action === "verified by" && history.status === "pending") {
    return "Pending Verification From"
  } else if (history.action === "approved by" && history.status === "pending") {
    return "Pending Approval From"
  } else {
    return capitalizeEachFirstLetter(history?.action)
  }
}

export const LEVEL_TYPE = [
  {
    label: "Approved by",
    value: "approved by"
  },
  {
    label: "Verified by",
    value: "verified by"
  },
]

export const TIER_TYPE = [
  {
    label: "User Group",
    value: "user group"
  },
  {
    label: "User",
    value: "employee"
  },
]