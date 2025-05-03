import React from "react"
import { Input, Space, Form } from "antd"
import _ from "lodash";

const PasswordInput = ({
  containerClass,
  inputStyle,
  onChange,
  onKeyPress,
  placeholder,
  status,
  value,
  context,
  instructions,
  label,
  size,
  errors
}) => {
  return (
    <Space className={`${containerClass} || ""`} style={{ width: "100%" }}>
      <Form>
        { label && <div className="my-1">{label}</div> }
        <Input.Password
          style={inputStyle}
          placeholder={placeholder || "Password"}
          status={status}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyPress}
          size={size || "default"}
        />
        {(instructions && !errors?.length > 0) && (
          <span className="text-muted" style={{ fontSize: 12 }}>
            {instructions}
          </span>
        )}
        {errors?.length > 0 && (
          <span className="text-danger" style={{ fontSize: 14 }}>
            {_.find(errors, (obj) => obj.field === context)?.message}{" "}
          </span>
        )}
      </Form>      
    </Space>
  )
}
export default PasswordInput