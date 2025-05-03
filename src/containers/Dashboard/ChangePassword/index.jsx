import _ from "lodash"
import React, { useEffect, useState } from "react"
import { Row, Col, Alert, Space } from "antd"
import { IoWarningOutline } from "react-icons/io5"

import Card from "components/Card"
import CardHeader from "components/Card/header"
import CardFooter from "components/Card/footer"
import FormInput from "components/Input/formInput"
import PasswordInput from "components/Input/password";
import LoadingOverlay from "components/Indicator/LoadingOverlay"

import WithHOC from "./actions"
import "./index.scss"

const ChangePassword = props => {
  const { profile } = window.location.href.includes("/admin-impersonate")
    ? props.data.ImpersonateProfileReducer
    : props.data.ProfileReducer;

  useEffect(() => {
    props.setPath([
      { label: "" },
      { label: "Change Password" }
    ])
  }, [])

  const handleChange = (field, value) => {
    const tmp = { ...props.newPassword, [field]: value };
    props.onChangeHOC("newPassword", tmp);

    let tmpErrors = props.errors;

    if (Array.isArray(tmpErrors.info)) {
      if (field === "password" && value.length >= 8) {
        tmpErrors.info = tmpErrors.info.filter(
          error => !(error.field === "password" && error.code === "too_small")
        );
      }

      if (field === "password_confirmation" && value.length >= 8) {
        tmpErrors.info = tmpErrors.info.filter(
          error => !(error.field === "password_confirmation" && error.code === "too_small")
        );
      }

      if (
        tmp.password.length >= 8 &&
        tmp.password_confirmation.length >= 8 &&
        field === "password_confirmation"
      ) {
        if (tmp.password_confirmation === tmp.password) {
          tmpErrors.info = tmpErrors.info.filter(
            error => !(error.field === "password_confirmation" && error.code === "custom")
          );
        }
      }
    }

    props.onChangeHOC("errors", tmpErrors);
  };

  return (
    <>
      <div
        className="w-100 h-100"
        style={{
          display: "grid",
          placeItems: "center",
          padding: "10px",
          alignItems: "start"
        }}>
        <Card lg={24} md={16} sm={16} containerClass={"change-password-cont"}>
          <CardHeader title={'CHANGE PASSWORD'} />
          <Row gutter={[8, 0]}>
            <Col lg={24} md={24} sm={24} xs={24}>
              <FormInput
                type="text"
                context="name"
                value={`User ID: ${profile?.username}`}
                inputClass={"mb-2"}
                disabled={true}
              />
            </Col>
            <Col lg={24} md={24} sm={24} xs={24}>
              <PasswordInput
                context={"current_password"}
                containerClass={"password-input mb-2"}
                inputStyle={{ width: "100%" }}
                value={props.newPassword.current_password}
                placeholder={"Current Password"}
                onChange={(e) => handleChange('current_password', e.target.value)}
                status={_.find(props.errors?.info, { field: "current_password" }) ? "error" : null}
                errors={props.errors}
              />
            </Col>
            <Col lg={24} md={24} sm={24} xs={24}>
              <PasswordInput
                context={"password"}
                containerClass={"password-input my-2"}
                inputStyle={{ width: "100%" }}
                value={props.newPassword.password}
                placeholder={"New Password"}
                onChange={(e) => handleChange('password', e.target.value)}
                status={_.find(props.errors?.info, { field: "password" }) ? "error" : null}
                errors={props.errors}
              />
            </Col>
            <Col lg={24} md={24} sm={24} xs={24}>
              <PasswordInput
                context={"password_confirmation"}
                containerClass={"password-input my-2"}
                inputStyle={{ width: "100%" }}
                value={props.newPassword.password_confirmation}
                placeholder={"Confirm New Password"}
                onChange={(e) => handleChange('password_confirmation', e.target.value)}
                status={_.find(props.errors?.info, { field: "password_confirmation" }) ? "error" : null}
                errors={props.errors}
              />
            </Col>
            {/* {!_.isEmpty(props.errors) && (
              <Col lg={24} md={24} sm={24} xs={24}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {props.errors.info.map(error => (
                    <Alert
                      style={{ color: "#B54708" }}
                      message={error.message}
                      type="warning"
                      icon={<IoWarningOutline style={{ fontSize: "20px", color: "#B54708" }} />}
                      showIcon
                    />
                  ))}
                </Space>
              </Col>
            )} */}
          </Row>
          <CardFooter
            containerStyle={{ borderTop: "0px", paddingTop: "0px" }}
            leftButtons={[
              {
                children: "Cancel",
                color: "white",
                onClick: () => props.history.goBack()
              }
            ]}
            rightButtons={[
              {
                children: "Save",
                color: "red",
                onClick: () => props.changePassword(props.newPassword)
              }
            ]}
          />
        </Card>
      </div>
      {props.onLoadChangePassword && <LoadingOverlay />}
    </>
  )
}

export default WithHOC(ChangePassword)