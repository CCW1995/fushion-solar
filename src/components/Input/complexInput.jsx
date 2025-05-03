import { useEffect, useState, useRef } from "react";
import _ from "lodash"
import { Form, Input, Select, Space, TimePicker, DatePicker, Button } from "antd"

import { thousandSeparatorFormatter, sanitizePriceInput } from "utils/thousandSeparator";
import "./index.scss"

const ComplexInput = ({
  label,
  labelClass,
  labelStyle,
  inputTypes,
  containerClass,
  containerStyle,
  errors,
  context,
  disabled
}) => {
  const getErrorMessage = (field) => {
    let error = []
    if (errors && errors.info) {
      error = errors.info.find((err) => err.path?.includes(field))
      return error ? error.message : null
    } else if (errors?.length > 0) {
      error = _.find(errors, (obj) => obj.field === context)?.message
      return error
    }
    return null
  }

  const errorMessage = getErrorMessage(context)

  return (
    <Form.Item className={containerClass || ""} style={{ ...containerStyle }}>
      <span
        className={`${labelClass || ""}`}
        style={label ? { ...labelStyle, paddingRight: "6px" } : {}}>
        {label}
      </span>
      <Space.Compact>
        {inputTypes
          .filter(inputType => !inputType.isHide)
          .map((inputType, index) => {
            if (inputType.type === "select") {
              return (
                <Form.Item key={index} noStyle>
                  <Select
                    style={inputType.style}
                    placeholder={inputType.placeholder}
                    value={inputType.value}
                    onChange={value => {
                      if (inputType.onChange) {
                        inputType.onChange(value)
                      }
                    }}
                    disabled={disabled || inputType.disabled}
                  >
                    {inputType.options && inputType.options.map((option, optionIndex) => (
                      <Select.Option key={optionIndex} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            } else if (inputType.type === "button") {
              return (
                <Form.Item key={index} noStyle>
                  <Button
                    size={inputType.size}
                    type={inputType.buttonType}
                    style={inputType.style}
                    placeholder={inputType.placeholder}
                    onClick={inputType.onClick}
                    disabled={disabled || inputType.disabled}
                    classNames={inputType.classname}
                    styles={inputType.style}
                  >
                    {inputType.children}
                  </Button>
                </Form.Item>
              )
            } else if (inputType.type === "time") {
              return (
                <Form.Item key={index} noStyle>
                  <TimePicker
                    style={inputType.style}
                    use12Hours
                    format="hh:mm A"
                    value={inputType.value}
                    onChange={(time) => {
                      if (inputType.onChange) {
                        inputType.onChange(time)
                      }
                    }}
                  />
                </Form.Item>
              )
            } else if (inputType.type === "date") {
              return (
                <Form.Item key={index} noStyle>
                  <DatePicker
                    style={inputType.style}
                    format="DD/MM/YYYY"
                    value={inputType.value}
                    onChange={(date) => {
                      if (inputType.onChange) {
                        inputType.onChange(date)
                      }
                    }}
                  />
                </Form.Item>
              )
            } else {
              return (
                <Form.Item key={index} noStyle>
                  <InnerTextInput
                    inputType={inputType}
                    disabled={disabled}
                  />
                </Form.Item>
              )
            }
          })}
      </Space.Compact>
      {errorMessage && <span className="d-flex flex-column text-xs text-danger">{errorMessage}</span>}
    </Form.Item>
  )
}

const InnerTextInput = ({ inputType, disabled }) => {
  const [displayValue, setDisplayValue] = useState(inputType.value)
  const [localValue, setLocalValue] = useState(inputType.value);
  const inputRef = useRef(null);
  const cursorPositionRef = useRef(null);

  useEffect(() => {
    if (inputType.thousandSeperator) {
      const formattedValue = thousandSeparatorFormatter(inputType.value || "0.00") || "0.00"
      setDisplayValue(formattedValue)
      setLocalValue(formattedValue);
    }
  }, [inputType.value])

  useEffect(() => {
    if (cursorPositionRef.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
    }
  }, [displayValue, localValue, inputType]);

  return (
    <Input
      ref={inputRef}
      style={inputType.style}
      addonBefore={inputType.addonBefore}
      addonAfter={inputType.addonAfter}
      allowClear={inputType.allowClear}
      disabled={disabled || inputType.disabled}
      placeholder={inputType.placeholder}
      value={inputType.thousandSeperator ? displayValue : inputType.value}
      onChange={e => {
        if (!inputType.onChange) {
          return;
        }

        if (inputType.thousandSeperator) {
          const oriValue = sanitizePriceInput(e.target.value.replace(/,/g, '')) || "0.00"
          const prevCommasLength = (e.target.value.match(/,/g) || []).length
          const formattedValue = thousandSeparatorFormatter(oriValue) || "0.00"

          const newCommasLength = (formattedValue.match(/,/g) || []).length
          const commaDifference = newCommasLength - prevCommasLength;

          const allowUpdate = !isNaN(oriValue) && parseFloat(oriValue) <= (inputType.max ?? 9999999999.999)
          const caret = e.target.selectionStart + (allowUpdate ? commaDifference : 0)
          cursorPositionRef.current = caret;

          if (allowUpdate) {
            setLocalValue(oriValue);
            inputType.onChange(oriValue)
          } else {
            setLocalValue(null);
          }
        } else {
          inputType.onChange(e.target.value)
        }
      }}
      onClick={inputType.onClick}
      onKeyUp={inputType.onKeyUp}
      onKeyDown={(e) => {
        const el = e.target;
        const { key } = e;
        const { selectionStart, value = '' } = el;
        if (inputType.thousandSeperator) {
          if (key === 'Backspace' && value[selectionStart - 1] === ".") {
            el.setSelectionRange(selectionStart - 1, selectionStart - 1);
            e.preventDefault();
          } else if (key === 'Delete' && value[selectionStart] === ".") {
            e.preventDefault();
          }
        }
        if (inputType.onKeyDown) {
          inputType.onKeyDown()
        }
        if (inputType.onPressEnter && key === 'Enter') {
          inputType.onPressEnter()
        }
      }}
      onWheel={(e) => e.target.blur()}
      onFocus={inputType.onFocus}
      onBlur={() => {
        if (inputType.thousandSeperator) {
          setDisplayValue(thousandSeparatorFormatter(inputType.value || "0.00") || "0.00")
        }
        if (inputType.onBlur) {
          inputType.onBlur()
        }
      }}
    />
  )
}

export default ComplexInput

// examples
// const priceType = [
//   { value: "discount", label: "Discount Price" },
//   { value: "fixed", label: "Fixed Price" },
// ]
// const grossOrNett = [
//   { value: "gross", label: "By Gross" },
//   { value: "nett", label: "By Nett" },
// ]
// const [selectedValues, setSelectedValues] = useState({
//   select: "",
// })
{/* <ComplexInput
  inputTypes={[
    {
      type: "text",
      placeholder: "0.00",
      addonBefore: "RM",
      style: { width: 150 },
      value: null,
      onChange: (val) => {}
    },
    {
      type: "select",
      options: grossOrNett,
      placeholder: "Select",
      style: { width: 100 },
      value: null,
      onChange: (val) => {}
    },
  ]}
/>
<ComplexInput
  label="From"
  inputTypes={[
    {
      type: "date",
      style: { width: 150 },
      placeholder: "Select Date",
      onChange: () => {}
    },
    {
      type: "time",
      style: { width: 150 },
      placeholder: "Select Time",
      onChange: () => {}
    }
  ]}
/> */}