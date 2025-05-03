import React, { useRef, useState, forwardRef } from "react";
import { Col, FormGroup, Label } from "reactstrap";
import _ from "lodash";
import { BsCalendar } from "react-icons/bs";
import ReactDatePicker from "react-datepicker";

import ERPIcon from "components/Icon";
import ERPButton from "components/Button";

import "./index.scss";

const FormDatePicker = ({
  formGroupStyle,
  formGroupClass,
  value,
  label,
  format,
  labelClass,
  row, // boolean
  labelCol, //customize column size for label
  inputCol, //customize column size for input
  errors, // [ { field: 'name', message: 'Name is required' }]
  context,
  required,
  withPortal,
  startDate,
  endDate,
  selectRange,
  isClearable,
  disabled, // boolean
  placeholder,
  onChangeData,
  showYearPicker,
  inputSize, //sm
  customFormInputClass,
  customFormInputStyle,
  showTimeSelectOnly,
  timeFormat,
  popperProps,
  popperPlacement,
  showTimeSelect,
  minDate, //backdate is not allowed
  maxDate, //future date is not allowed
  hideCalendarIcon,
  showClearButton,
  boldLabel = true,
  labelStyle,
}) => {

  const CustomInput = forwardRef(({ value, onClick, onChange }, ref) => {
    return (
      <>
        <button
          type="button"
          className={`custom-form-input ${customFormInputClass || ""} ${inputSize ? `custom-form-input-${inputSize}` : ""
            } ${disabled ? 'custom-datepicker-disabled' : ''} `}
          style={{ ...customFormInputStyle }}
          onClick={onClick}
          ref={ref}
          onChange={onChange}
        >
          {!hideCalendarIcon && <BsCalendar style={{ width: 16, paddingRight: 4 }} />}
          <input
            value={value}
            type="text"
            style={{ backgroundColor: 'transparent' }}
            disabled={disabled}
            placeholder={placeholder}
          />
        </button>
        <span className="text-danger">
          {errors?.length > 0 &&
            _.find(errors, (obj) => obj.field === context)?.message}{" "}
        </span>
      </>
    )
  });

  const InputContent = () => {
    const inputRef = useRef();

    const handleChangeRaw = (e) => {
      const newRaw = new Date(e.currentTarget.value);
      if (newRaw instanceof Date && !isNaN(newRaw)) {
        onChangeData(newRaw)
      }
    };

    return (
      <ReactDatePicker
        selected={value}
        disabled={disabled}
        showTimeSelectOnly={showTimeSelectOnly}
        timeFormat={timeFormat}
        dateFormat={format || "dd/MM/yyyy"}
        showTimeSelect={showTimeSelect}
        withPortal={withPortal}
        startDate={startDate}
        endDate={endDate}
        selectsRange={selectRange}
        isClearable={isClearable}
        showMonthDropdown={showYearPicker ? false : true}
        showYearDropdown={showYearPicker ? false : true}
        showYearPicker={showYearPicker}
        placeholderText={placeholder || ""}
        customInput={<CustomInput ref={inputRef} />}
        minDate={minDate || ""}
        maxDate={maxDate || ""}
        onChangeRaw={(e) => handleChangeRaw(e)}
        onChange={(date) => {
          onChangeData(date)
        }}
        popperModifiers={{
          flip: {
            behavior: ["bottom"]
          },
          preventOverflow: {
            enabled: false
          },
          hide: {
            enabled: false
          }
        }}
        popperPlacement={popperPlacement}
        {...(popperProps ? { popperProps: popperProps } : {})}
        strictParsing={true}
      />
    );
  };

  return (
    <FormGroup
      style={{ ...formGroupStyle, marginBottom: "6px" }}
      className={`${formGroupClass || ""}`}
      row={row || false}
      required={required}>
      {label && (
        <Label
          {...(row ? labelCol : {})}
          style={{ ...labelStyle }}
          className={!boldLabel ? `${labelClass || ""}` : `custom-form-label ${labelClass || ""}`}
          for={context}
        >
          {label}
          {required ? <span className="text-danger">*</span> : ""}
          {(showClearButton && value)
            ? (
              <ERPButton
                customStyle={{ padding: "0px", marginLeft: "8px", color: "#00ada9" }}
                onClick={() => onChangeData(null)}
                color={"borderless"}
              >
                <ERPIcon antIcon="CloseCircleOutlined" />
              </ERPButton>
            )
            : (<></>)
          }
        </Label>
      )}
      {row ? (
        <Col {...(row && inputCol)}>
          <InputContent />
        </Col>
      ) : (
        <InputContent />
      )}
    </FormGroup>
  );
};

export default FormDatePicker;