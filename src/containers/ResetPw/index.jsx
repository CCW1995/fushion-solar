import React, { useState } from "react"
import { Button } from "reactstrap"
import { Row, Col, Space, Input } from "antd"
import _ from "lodash"

import TemplateContainerMain from "components/Template"
import LoadingOverlay from "components/Indicator/LoadingOverlay"
import PasswordInput from "components/Input/password"

import WithResetPw from "./actions"
import DCHLogo from "assets/dch-logo.svg"
import "../Login/index.scss"

const ResetPw = (props) => {
  const [username, setUsername] = useState(null)
  const [formData, updateFormData] = useState({})

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (username === null || username === "") {
        return false
      }
      props.requestForgetPasswordEmail({ username })
    }
  }

  return (
    <>
      <TemplateContainerMain>
        <div className="login-landing-page">
          <div className="login-input-box">
            <div className="text-center mb-4">
              <img
                src={DCHLogo}
                alt="app-logo"
                style={{ maxWidth: 200, marginBottom: "24px" }}
              />
              <span className="login-input font-weight-semibold text-lg">
                Reset Password
              </span>
              <span className="text-light-grey font-weight-normal text-sm">
                Fill in your new password and PIN code below.
              </span>
            </div>

            <div className="login-input mt-4" style={{ gap: "16px" }}>
              <PasswordInput
                context="password"
                containerClass="password-input"
                inputStyle={{ borderRadius: "8px" }}
                status={formData.password === "" ? "error" : null}
                label="New Password"
                placeholder="New Password"
                value={formData.password}
                instructions="New Password must be at least 8 characters long."
                onChange={(e) => handleChange("password", e.target.value)}
                onKeyPress={handleKeyPress}
                errors={props.registerError}
              />
              <PasswordInput
                context="password_confirmation"
                containerClass="password-input"
                inputStyle={{ borderRadius: "8px" }}
                status={formData.password_confirmation === "" ? "error" : null}
                label="Confirm New Password"
                placeholder="Confirm New Password"
                value={formData.password_confirmation}
                instructions="Please enter again your New Password."
                onChange={(e) => handleChange("password_confirmation", e.target.value)}
                onKeyPress={handleKeyPress}
                errors={props.registerError}
              />
              <div>
                <span className="text-sm mb-1">PIN Code</span>
                <Input
                  style={{ fontSize: "14px", borderRadius: "8px" }}
                  placeholder="PIN Code"
                  autoComplete="username"
                  onChange={(e) => { }}
                  onKeyPress={handleKeyPress}
                />
                <span className="text-muted" style={{ fontSize: 12 }}>
                  PIN Code must be at 6 digits.
                </span>
              </div>
              <Row className="mx-1" />
              <Button
                color="primary btn-block"
                size="lg"
                styles={{ borderRadius: "8px" }}
                onClick={() => props.register({ ...formData, token: query.get("token") })}
              >
                Register Now
              </Button>
            </div>
          </div>
        </div>

        {props.onLoadLogin && <LoadingOverlay />}
      </TemplateContainerMain>
    </>
  )
}

export default WithResetPw(ResetPw)