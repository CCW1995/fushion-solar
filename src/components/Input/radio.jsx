import React from "react";
import { FormGroup, Input, InputGroup } from "reactstrap";
import _ from "lodash";

import "./index.scss";

const CustomRadioButton = ({ 
  checked,
  label,
  onChange,
  style,
  formGroupClass,
  formGroupStyle,
  customClass,
  disabled,
  name,
  labelClass,
  defaultChecked,
  inputFields,
  inputDisabled,
  inputType,
  inputClass,
  inputSize,
  inputValue,
  onInputChange,
  inputPlaceholder,
  customStyle,
}) => {
  return (
    <FormGroup 
      style={{ ... formGroupStyle}} 
      className={ formGroupClass || '' }
      check>
      <div
        className={`custom-form-radio-button ${inputFields ? "d-flex align-items-center" : ""}`}
        style={{ ...customStyle }}
      >
        <Input
          type="radio"
          name={name}
          className={ customClass || '' }
          checked={checked}
          onChange={onChange}
          style={style}
          disabled={disabled}
          defaultChecked={defaultChecked}
        />
        {label && <span className={labelClass || ""}>{label}</span>}
        {inputFields && (
          <InputGroup className="custom-input-group">
            <Input
              type={inputType}
              className={`custom-form-input ${inputClass || ""} ${ inputSize ? `custom-form-input-${inputSize}` : ""}`}
              value={inputValue ?? ""}
              placeholder={inputPlaceholder || ""}
              onChange={(e) => onInputChange(e.target.value)}
              disabled={!checked || inputDisabled} // Disable input if radio is not checked
            />
          </InputGroup>
        )}
      </div>
    </FormGroup>
  );
};

export default CustomRadioButton;
