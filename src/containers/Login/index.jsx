import React, { useState } from "react"
import { Button } from "reactstrap"
import { Row, Col, Input } from "antd"
import _ from "lodash"

import TemplateContainerMain from "components/Template"
import LoadingOverlay from "components/Indicator/LoadingOverlay"

import WithLogin from "./action"
import DCHLogo from "assets/dch-logo.svg"
import "./index.scss"

const Login = (props) => {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (username === null || username === "" || password === null || password === "") {
        return false
      }

      props.onClickLogin({
        username: username,
        password: password
      })
    }
  }

  return (
    <TemplateContainerMain>
      <div className="login-landing-page">
        <div className="login-input-box">
          <div className="text-center mb-4">
            <img src={DCHLogo} alt={"app-logo"} style={{ maxWidth: 200, marginBottom: "24px" }} />
            <span className="login-input font-weight-semibold text-lg">
              Welcome Back!
            </span>
            <span className="mb-4 text-light-grey font-weight-normal text-sm">
              Fill in your login credentials to login.
            </span>
          </div>
          <div className="login-input">
            <span className="text-sm mb-1">User ID</span>
            <Input
              style={{ fontSize: "14px", borderRadius: "8px", marginBottom: "16px" }}
              placeholder="User ID"
              autoComplete="username"
              status={username === "" ? "error" : null}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <span className="text-sm mb-1">Password</span>
            <Input.Password
              style={{ fontSize: "14px", borderRadius: "8px" }}
              placeholder="Password"
              autoComplete="current-password"
              status={password === "" ? "error" : null}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          {props.errorMessage && <span className="text-danger">{props.errorMessage}</span>}

          <Row className="mx-1 my-4" />
          <Button
            className="font-weight-semibold mb-3"
            color="primary btn-block"
            size="lg"
            type="button"
            disabled={username === null || username === "" || password === null || password === ""}
            onClick={() => {
              props.onClickLogin({
                username: username,
                password: password
              })
            }}
          >
            Login
          </Button>
          <a
            className="d-flex justify-content-center align-items-center forget-pw-link"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              props.history.push("/forgot-password")
            }}
          >
            Forgot Password?
          </a>
        </div>
      </div>
      {/* <p className="login-disclaimer">Copyright protected by DC Healthcare</p> */}
      {props.onLoadLogin && <LoadingOverlay />}
    </TemplateContainerMain>
  )
}

export default WithLogin(Login)