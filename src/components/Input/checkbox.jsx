import React from "react"
import { Checkbox } from "antd"
import { FormGroup, Label, Col } from "reactstrap"
import _ from "lodash"

import './index.scss'

const CustomCheckBox = ({
  formGroupStyle,
  formGroupClass,
  checkboxClass,
  checked,
  label,
  onChangeData,
  style,
  disabled,
  row,
  formLabel,
  labelCol,
  inputCol,
  boldLabel = true
}) => {
  const checkbox = (
    <Checkbox
      className={`${checkboxClass || ""}`}
      checked={checked}
      onChange={(e) => onChangeData(e.target.checked)}
      style={style}
      disabled={disabled}>
      {label}
    </Checkbox>
  )

  const renderCheckboxInput = () => (
    <Checkbox
      className={`${checkboxClass || ""}`}
      checked={checked}
      onChange={(e) => onChangeData(e.target.checked)}
      style={style}
      disabled={disabled}>
      {label}
    </Checkbox>
  )

  return (
    <FormGroup className={`custom-checkbox-input ${formGroupClass || ""}`} style={{ ...formGroupStyle || "" }} row={row || false}>
      {
        formLabel && (
          <Label
            {...(row ? labelCol : {})}
            className={!boldLabel ? "" : "custom-form-label"}
          >
            {formLabel}
          </Label>
        )
      }
      {
        row ? (
          <Col {...(row && inputCol)}>
            {renderCheckboxInput()}
          </Col>
        ) : (renderCheckboxInput())
      }
    </FormGroup>
  )
}

export default CustomCheckBox