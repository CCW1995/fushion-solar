import React, { useState } from "react"
import { Button } from "reactstrap"
import { Input, Form, Divider, Typography } from "antd"
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import _ from "lodash"

import TemplateContainerMain from "components/Template"
import LoadingOverlay from "components/Indicator/LoadingOverlay"

import WithLogin from "./action"
import LogoImg from "assets/logo.svg"
import "./index.scss"
import { getItem } from "utils/tokenStore"

const Login = (props) => {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const { Text } = Typography;

  useEffect(() => {
    if (getItem("ERP_ACCESS_TOKEN")) {
      props.history.push("/dashboard/huawei-dashboard");
    }
  }, []);

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

  const currentYear = new Date().getFullYear();

  return (
    <div className="fusion-login-page">
      <div className="fusion-login-content">
        <div className="logo-container">
        </div>
        
        <div className="login-container">
          <div className="login-box">
            <div className="login-form">
              <Form layout="vertical">
                <Form.Item>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Username"
                    size="large"
                    autoComplete="username"
                    status={username === "" ? "error" : null}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </Form.Item>
                <Form.Item>
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password"
                    size="large"
                    autoComplete="current-password"
                    status={password === "" ? "error" : null}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </Form.Item>
                
                {props.errorMessage && <div className="error-message">{props.errorMessage}</div>}
                
                <Form.Item>
                  <Button
                    className="login-button"
                    color="primary"
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
                    Log In
                  </Button>
                </Form.Item>
              </Form>
            </div>
            
            <div className="login-links">
              <a className="link-item" href="#" onClick={(e) => {
                e.preventDefault();
                props.history.push("/installer-registration");
              }}>
                Installer Registration
              </a>
              <Divider type="vertical" />
              <a className="link-item" href="#" onClick={(e) => {
                e.preventDefault();
                props.history.push("/forgot-password");
              }}>
                Forgot password?
              </a>
              <Divider type="vertical" />
              <a className="link-item" href="#" onClick={(e) => {
                e.preventDefault();
                props.history.push("/demo-site");
              }}>
                Demo Site
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="fusion-footer">
        <Text className="browser-note">
          You are advised to use Chrome 79, Firefox ESR 68, or later versions with a resolution of 1920 x 1080 pixels.
        </Text>
        <Text className="copyright">
          Copyright © 2011-{currentYear} Huawei Digital Power Technologies Co., Ltd. All rights reserved.
        </Text>
        <div className="policy-links">
          <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-use">Terms of Use</a> | <a href="/cookies-policy">Cookies Policy</a>
        </div>
      </div>
      
      {props.onLoadLogin && <LoadingOverlay />}
    </div>
  )
}

export default WithLogin(Login)