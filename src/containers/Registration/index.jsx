import React, { useEffect, useState } from "react"
import { Button } from "reactstrap"
import { Row, Col, Space, Input } from "antd"
import { useLocation } from "react-router-dom"
import { HiOutlineExclamation, HiOutlineCheckCircle } from "react-icons/hi"
import _ from "lodash"

import TemplateContainerMain from "components/Template"
import LoadingOverlay from "components/Indicator/LoadingOverlay"
import PasswordInput from "components/Input/password"

import WithVerifyRegistration from "./action"
import DCHLogo from "assets/dch-logo.svg"
import "../Login/index.scss"

const Registration = (props) => {
  const useQuery = () => new URLSearchParams(useLocation().search)
  let query = useQuery()

  const [formData, updateFormData] = useState({})

  useEffect(() => {
    if (props.match.path === "/register") {
      props.verifyRegistration(query.get("token"))
    }
  }, [props.match.path])

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (formData.password === null || formData.password === "" || formData.password_confirmation === null || formData.password_confirmation === "") {
        return false
      }

      props.register({ ...formData, token: query.get("token") })
    }
  }

  const handleChange = (field, value) => {
    const tmp = { ...formData, [field]: value }
    updateFormData(tmp)

    let tmpErrors = props.registerError
    if (Array.isArray(tmpErrors)) {
      if (field === "password" && value.length >= 8) {
        tmpErrors = tmpErrors.filter(
          error => !(error.field === "password" && error.code === "too_small")
        )
      }

      if (field === "password_confirmation" && value.length >= 8) {
        tmpErrors = tmpErrors.filter(
          error => !(error.field === "password_confirmation" && error.code === "too_small")
        )
      }
    }

    if (formData.password?.length >= 8 && formData.password_confirmation?.length >= 8) {
      if (tmp.password_confirmation === tmp.password) {
        tmpErrors = []
      }
    }

    props.onChangeUserAccHOC("registerError", tmpErrors)
  }

  return (
    <TemplateContainerMain>
      <div className="login-landing-page">
        <div className="login-input-box">
          {_.isEmpty(props.userAccount) || props.userAccount.register_at !== null ? (
            <>
              {props.successRegistration ? (
                <div
                  className="text-center align-items-center"
                  style={{ color: "#039855", fontSize: "28px" }}
                >
                  <HiOutlineCheckCircle
                    style={{ marginRight: "10px" }}
                  />
                  Your registration is successful!
                  <Button
                    color="primary btn-block mt-4 mb-3"
                    size="lg"
                    onClick={() => props.history.push("/login")}
                  >
                    Login Now
                  </Button>
                </div>
              ) : props.invalidToken ? (
                <div
                  className="text-center align-items-center"
                  style={{ color: "#00ada9", fontSize: "28px" }}
                >
                  <HiOutlineExclamation
                    style={{ marginRight: "10px" }}
                  />
                  Your token is Invalid!
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <img
                  src={DCHLogo}
                  alt="app-logo"
                  style={{ maxWidth: 200, marginBottom: "24px" }}
                />
                <span className="login-input font-weight-semibold text-lg">
                  Registration
                </span>
                <span className="text-light-grey font-weight-normal text-sm">
                  Fill in your password and PIN code to register.
                </span>
              </div>
              <div className="login-input mt-4" style={{ gap: "16px" }}>
                <PasswordInput
                  context="password"
                  containerClass="password-input"
                  inputStyle={{ borderRadius: "8px" }}
                  status={formData.password === "" ? "error" : null}
                  label="Password"
                  placeholder="Password"
                  value={formData.password}
                  instructions="Password must be at least 8 characters long."
                  onChange={(e) => handleChange("password", e.target.value)}
                  onKeyPress={handleKeyPress}
                  errors={props.registerError}
                />
                <PasswordInput
                  context="password_confirmation"
                  containerClass="password-input"
                  inputStyle={{ borderRadius: "8px" }}
                  status={formData.password_confirmation === "" ? "error" : null}
                  label="Confirm Password"
                  placeholder="Confirm Password"
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
            </>
          )}
        </div>
      </div>

      {props.onLoadRegistration && <LoadingOverlay />}
    </TemplateContainerMain >
  )
}

export default WithVerifyRegistration(Registration)
