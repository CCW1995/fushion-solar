import React, { useState, useEffect } from "react"
import { Row, Input } from "antd"
import _ from "lodash"

import TemplateContainerMain from "components/Template"
import LoadingOverlay from "components/Indicator/LoadingOverlay"
import ERPButton from "components/Button"

import WithForgotPw from "./actions"
import DCHLogo from "assets/dch-logo.svg"
import "../Login/index.scss"

const ForgotPw = (props) => {
  const [email, setEmail] = useState("")

  return (
    <TemplateContainerMain>
      <div className="login-landing-page">
        <div className="login-input-box">
          <>
            <div className="text-center mb-4">
              <img
                src={DCHLogo}
                alt="app-logo"
                style={{ maxWidth: 200, marginBottom: "24px" }}
              />
              <span className="login-input font-weight-semibold text-lg">
                Forgot Password
              </span>
              <span className="text-light-grey font-weight-normal text-sm">
                Forgot your password? Enter your email address and we'll send you instructions to reset it.
              </span>
            </div>

            <div className="login-input">
              <span className="text-sm mb-1">Email</span>
              <Input
                style={{ fontSize: "14px", borderRadius: "8px" }}
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                status={!/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email) && email !== "" ? "error" : null}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {props.errorMessage && <span className="text-danger">{props.errorMessage}</span>}

            <Row className="mx-1 mt-3 mb-4" />
            <ERPButton
              color={"primary"}
              onClick={() => {
                props.requestForgetPasswordEmail({
                  email: email
                })
              }}
              customStyle={{
                display: "block",
                width: "100%",
                height: "40px",
                marginBottom: "16px",
                borderRadius: "8px"
              }}
            >
              Reset Password
            </ERPButton>
            <ERPButton
              color={"white"}
              onClick={(e) => {
                e.preventDefault()
                props.history.push("/login")
              }}
              customStyle={{
                display: "block",
                width: "100%",
                height: "40px",
                borderRadius: "8px"
              }}
            >
              Back to Login
            </ERPButton>
          </>
        </div>
      </div>

      {props.onLoadForgotPw && <LoadingOverlay />}
    </TemplateContainerMain>
  )
}

export default WithForgotPw(ForgotPw)