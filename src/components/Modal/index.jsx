import React from "react";
import { Modal } from "antd";
import _ from "lodash";

import ERPIcon from "components/Icon";
import CustomButton from "components/Button";
import LoadingOverlay from "components/Indicator/LoadingOverlay";

const CustomModal = ({
  width,
  title,
  isOpen,
  loading,
  children,
  hideHeader,
  hideFooter,
  customFooter,
  customBodyClass,
  customBodyStyle,
  customModalClass,
  customFooterClass,

  leftActionText,
  rightActionText,
  leftActionDisabled, //boolean
  rightActionDisabled, //boolean
  onClickLeftAction,
  onClickRightAction,
  onClose,
  onPrev,
  bodyStyle,
}) => {
  const closeButton = (
    <button className="custom-modal-close" onClick={onClose}>
      <ERPIcon custom="x" />
    </button>
  );

  const prevButton = (
    <button className="custom-modal-prev" onClick={onPrev}>
      <ERPIcon custom="chevron-left" />
    </button>
  );

  return (
    <Modal
      width={width}
      footer={null}
      closeIcon={null}
      className={`custom-modal ${customModalClass || ""}`}
      open={isOpen}
      style={bodyStyle}
    >
      {!hideHeader && (
        <div
          className={"modal-header"}
          style={!title ? { justifyContent: "end" } : {}}
        >
          {onPrev && (
            <div className="d-flex align-items-center">
              {prevButton}
              {title}
            </div>
          )}
          {onClose && (
            <>
              {title}
              {closeButton}
            </>
          )}
        </div>
      )}
      <div
        style={customBodyStyle}
        className={`modal-body modal-body-${customBodyClass || ""}`}
      >
        {children}
      </div>
      {!hideFooter && (
        <div className={`modal-footer ${customFooterClass}`}>
          {customFooter}
          {!customFooter && leftActionText && (
            <CustomButton
              color="white"
              customStyle={{ borderRadius: 8 }}
              disabled={leftActionDisabled}
              onClick={onClickLeftAction}>
              {leftActionText}
            </CustomButton>
          )}
          <div />
          {!customFooter && rightActionText && (
            <CustomButton
              color="primary"
              customStyle={{ borderRadius: 8 }}
              disabled={rightActionDisabled}
              onClick={onClickRightAction}>
              {rightActionText}
            </CustomButton>
          )}
        </div>
      )}
      {loading && <LoadingOverlay />}
    </Modal>
  );
};

export default CustomModal;

{/* <ERPModal
  width={420}
  isOpen={props.isOpen}
  customModalClass={"custom-pincode"}
  customBodyStyle={{
    background: "none",
    padding: "24px"
  }}
  onClose={onHandleCancel}
  hideFooter={true}
>
  <div className="d-flex flex-column align-items-center">
    <div className="icon-container icon-lighter-border">
      <div className="icon-container icon-bordered">
        <PiWarningCircleBold style={{ fontSize: "20px" }} />
      </div>
    </div>

    <ERPTypeahead
      formGroupClass={"w-100"}
      options={[]}
      context={""}
      value={[]}
      label="Select your name and enter your PIN."
      normalLabel={true}
      labelKey={"name"}
      filterBy={["name"]}
      columnData={[
        { label: "Name", key: "name", col: 5 },
      ]}
      onChangeData={(val) => { }}
      errors={[]}
    />

    <div className="mt-3 w-100">
      <Input.OTP
        length={6}
        size={"large"}
        placeholder={"0"}
        separator={(i) => i === 2 ? <span>-</span> : null}
        onChange={(value) => console.log("PIN Code:", value)}
        style={{ width: "100%", justifyContent: "center" }}
      />
    </div>

    <div
      className="d-flex flex-row w-100"
      style={{ gap: "12px", marginTop: "32px" }}
    >
      <ERPButton
        size="lg"
        color={"white"}
        onClick={() => { }}
      >
        Cancel
      </ERPButton>
      <ERPButton
        size="lg"
        color={"primary"}
        onClick={() => { }}
      >
        Verify
      </ERPButton>
    </div>
  </div>
</ERPModal> */}