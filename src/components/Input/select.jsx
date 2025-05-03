import React from "react";
import { Col, FormGroup, Label, Input } from "reactstrap";
import _ from "lodash";

import "./index.scss";

// // Sample
// <SelectInput
// 	row={true}
// 	labelCol={{ xl: 3, lg: 4, md: 5 }}
// 	inputCol={{ xl: 9, lg: 8, md: 7 }}
// 	formGroupStyle={{ marginBottom: "6px" }}
// 	type={"select"}
// 	value={""}
// 	label={"Copy Permission From"}
// 	errors={""}
// 	labelClass="text-xs font-weight-bold text-light-grey"
// 	context={"copy-permission-from"}
// 	required={false}
// 	placeholder={"Name"}
// 	onChangeData={() => { }}
// />

const FormInputSelect = ({
  formGroupStyle,
  formGroupClass,
  value,
  row, // boolean
  labelCol,
  inputCol,
  label,
  options,
  optionLabelKey,
  optionValuelKey,
  emptyOption,
  errors, // [ { field: 'name', message: 'Name is required' }]
  labelClass,
  labelStyle,
  context,
  required,
  placeholder,
  onChangeData,
  inputClass,
  disabled,
  inputSize, //sm
  boldLabel = true
}) => {

  const InputContent = () => {
    return (
      <>
        <Input
          type={"select"}
          value={value}
          className={`custom-form-input ${inputClass || ""} ${inputSize ? `custom-form-input-${inputSize}` : ''}`}
          placeholder={placeholder || ""}
          disabled={disabled}
          onChange={(e) => onChangeData(e.target.value)}>
          {emptyOption && <option></option>}
          {options?.map((opt) => {
            return (
              <option
                value={optionValuelKey ? opt[optionValuelKey] : opt.value}>
                {optionLabelKey ? opt[optionLabelKey] : opt.label}
              </option>
            );
          })}
        </Input>
        <span className="text-danger">
          {errors?.length > 0 &&
            _.find(errors, (obj) => obj.field === context)?.message}{" "}
        </span>
      </>
    )
  }

  return (
    <FormGroup
      style={{ ...formGroupStyle, marginBottom: "6px" }}
      className={`${formGroupClass || ""}`}
      row={row || false}
      required={required}>
      {label && (
        <Label
          {...(row ? labelCol : {})}
          className={!boldLabel ? `${labelClass || ""}` : `custom-form-label ${labelClass || ""}`}
          style={{ ...labelStyle }}
          for={context}>
          {label}
          {required ? <span className="text-danger">*</span> : ""}
        </Label>
      )}
      {row ?
        <Col {...(row && inputCol)}>
          <InputContent />
        </Col>
        : <InputContent />
      }
    </FormGroup>
  );
};

export default FormInputSelect;
