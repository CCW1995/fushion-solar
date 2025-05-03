import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Col, FormGroup, Input, InputGroup, Label } from "reactstrap";

import ERPIcon from "components/Icon";
import "./index.scss";

import { thousandSeparatorFormatter, sanitizePriceInput } from "utils/thousandSeparator";

const FormInput = ({
  formGroupStyle,
  formGroupClass,
  ref,
  type,
  numberOfRows, // number of rows for textarea
  row, // boolean
  labelCol, //customize column size for label
  inputCol, //customize column size for input
  labelStyle,
  inputStyle,
  style,
  value,
  label,
  prefix,
  pattern,
  disabled, // boolean
  errors, // [ { field: 'name', message: 'Name is required' }]
  labelClass,
  context,
  required,
  maxLength,
  min, //min num for number type
  max, //max num for number type
  placeholder,
  onChangeData,
  labelChildren,
  inputClass,
  onClick,
  showToggleButton,
  onKeyUp,
  onKeyDown,
  inputSize, //sm
  onDebounce,
  debounceInterval,
  labelAfterInput,
  labelAfterInputCol,
  onFocus,
  onBlur,
  thousandSeperator,
  prefixStyle,
  onPressEnter,
  errorStyle,
  boldLabel = true
}) => {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (thousandSeperator) {
      setDisplayValue(thousandSeparatorFormatter(value || "0.00") || "0.00")
    }
  }, [value])

  const debouncedUpdate = useMemo(() => {
    return onDebounce
      ? _.debounce((val) => {
        onChangeData(onDebounce(val))
      }, debounceInterval || 1000)
      : null
  }, [onChangeData])

  const renderInput = () => (
    <>
      <InputGroup className="custom-input-group">
        {prefix && <span className={`custom-input-prefix custom-input-prefix-disabled`} style={{ ...prefixStyle }}>{prefix}</span>}
        <Input
          ref={ref}
          type={type}
          disabled={disabled}
          value={thousandSeperator ? displayValue : value}
          style={{ ...style, ...inputStyle }}
          rows={numberOfRows}
          pattern={pattern}
          maxLength={maxLength}
          min={min}
          max={max}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
          className={`custom-form-input ${inputClass || ""} ${inputSize ? `custom-form-input-${inputSize}` : ""}`}
          placeholder={!disabled ? placeholder : ""}
          onChange={(e) => {
            if (thousandSeperator) {
              const oriValue = sanitizePriceInput(e.target.value.replace(/,/g, '')) || "0.00"
              const prevCommasLength = (e.target.value.match(/,/g) || []).length
              const formattedValue = thousandSeparatorFormatter(oriValue) || "0.00"

              const newCommasLength = (formattedValue.match(/,/g) || []).length
              const commaDifference = newCommasLength - prevCommasLength;

              const allowUpdate = !isNaN(oriValue) && parseFloat(oriValue) <= (max ?? 9999999999.999)
              const caret = e.target.selectionStart + (allowUpdate ? commaDifference : 0)
              const element = e.target
              window.requestAnimationFrame(() => {
                element.selectionStart = caret
                element.selectionEnd = caret
              })

              if (allowUpdate) {
                onChangeData(oriValue)

                if (debouncedUpdate) {
                  debouncedUpdate(oriValue)
                }
              }
            } else {
              onChangeData(e.target.value)

              if (debouncedUpdate) {
                debouncedUpdate(e.target.value)
              }
            }
          }}
          onClick={onClick}
          onKeyUp={onKeyUp}
          onKeyDown={(e) => {
            const el = e.target;
            const { key } = e;
            const { selectionStart, value = '' } = el;
            if (thousandSeperator) {
              if (key === 'Backspace' && value[selectionStart - 1] === ".") {
                el.setSelectionRange(selectionStart - 1, selectionStart - 1);
                e.preventDefault();
              } else if (key === 'Delete' && value[selectionStart] === ".") {
                e.preventDefault();
              }
            }
            if (onKeyDown) {
              onKeyDown()
            }
            if (onPressEnter && key === 'Enter') {
              onPressEnter()
            }
          }}
          onWheel={(e) => e.target.blur()}
          onFocus={onFocus}
          onBlur={() => {
            if (thousandSeperator) {
              setDisplayValue(thousandSeparatorFormatter(value || "0.00") || "0.00")
            }
            if (onBlur) {
              onBlur()
            }
          }}
        />
        {
          showToggleButton && (
            <button
              className="toggle-button"
              onClick={onClick}
              onMouseDown={(e) => e.preventDefault()}>
              <ERPIcon custom="dots-horizontal" />
            </button>
          )
        }
      </InputGroup>
      <span className="text-danger" style={{ fontSize: 14, ...errorStyle }}>
        {errors?.length > 0 &&
          _.find(errors, (obj) => obj.field === context)?.message}{" "}
      </span>
    </>
  )

  return (
    <FormGroup
      style={{ ...formGroupStyle, marginBottom: "6px" }}
      className={`${formGroupClass || ""}`}
      row={row || false}
      required={required}>
      {
        label !== undefined && (
          <Label
            {...(row ? labelCol : {})}
            style={{ ...labelStyle }}
            className={!boldLabel ? `${labelClass || ""}` : `custom-form-label ${labelClass || ""}`}
            for={context}
          >
            <div>
              {label}
              {required ? <span className="text-danger">*</span> : ""}
            </div>
            {labelChildren}
          </Label>
        )
      }
      {row ? (
        <Col {...(row && inputCol)}>
          {renderInput()}
        </Col>
      ) : (renderInput())}
      {
        labelAfterInput && (
          <Col {...(row && labelAfterInputCol)}>
            {labelAfterInput}
          </Col>
        )
      }
    </FormGroup>
  );
};

export default FormInput;
