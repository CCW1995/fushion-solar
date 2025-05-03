import React, { useRef } from "react"
import _ from "lodash"
import { Row, Col } from "antd"
import { Label } from "reactstrap"

import ERPIcon from "components/Icon"
import ERPButton from "components/Button"

const FileUpload = ({
  type, // image, file
  value, // [], {}
  label,
  errors,
  labelClass,
  helpTextClass,
  containerClass,
  containerStyle,
  fileContainerClass,
  fileContainerStyle,
  fileCardClass,
  fileCardStyle,
  context,
  required,
  accept, // image/png, image/jpeg, image/jpg, application/pdf, 
  onChange,
  multiple,
  disabled,
  disableDeleteButton,
  helptext,
  buttonLabel,
  onClickRemove,
  onClickPreview,
  fileNameKey,
  fileSizeKey,
  fileTypeKey,
  fileNameWidth,
  showByDefault,
  boldLabel = true,
  uploadBtnSize = "lg",
  isLogo = false,
}) => {

  let filepond = useRef(null)

  const renderFileIcon = (type) => {
    if (type?.includes("image")) {
      return <ERPIcon featherIcon="FiImage" />
    } else {
      return <ERPIcon featherIcon="FiFile" />
    }
  }

  const renderFile = (item, index) => {
    const lastDotIndex = item[fileNameKey]?.lastIndexOf(".")
    const itemName = lastDotIndex !== -1 ? item[fileNameKey]?.substring(0, lastDotIndex) : item[fileNameKey]
    const base64Image = item?.presigned_url ?? `data:${item.type};base64,${item.file}`

    return (
      <div key={index}
        className={`d-flex align-items-center ${isLogo ? "is-logo" : ""} ${fileCardClass}`}
        style={fileCardStyle}
      >
        {!showByDefault && (
          <>
            <div className="custom-uploaded-file">
              <div className={`custom-uploaded-file__icon ${onClickPreview ? "cursor-pointer" : ""}`}
                onClick={() => onClickPreview ? onClickPreview(item) : {}}>
                {renderFileIcon(fileTypeKey ? item[fileTypeKey] : item.type)}
              </div>
              <div className="d-flex flex-column">
                <h2 style={{ width: fileNameWidth || "unset" }}>{fileNameKey ? itemName : item.name}</h2>
                <span>{Number(fileSizeKey ? item[fileSizeKey] : item.size) / 1000} KB</span>
              </div>
              <ERPButton
                color={"borderless"}
                customStyle={{ borderRadius: "50%", zIndex: 999, marginLeft: "auto" }}
                onClick={() => {
                  onClickPreview(item)
                }}>
                <ERPIcon featherIcon={"FiEye"} />
              </ERPButton>
            </div>
            <ERPButton
              color={"borderless"}
              customStyle={{ borderRadius: "50%", zIndex: 999 }}
              disabled={disableDeleteButton}
              onClick={() => {
                onClickRemove((multiple ? index : ""), item?.id)
                filepond.current.value = null
              }}>
              <ERPIcon featherIcon={"FiTrash"} />
            </ERPButton>
          </>
        )}
        {showByDefault && (
          <div
            className={`custom-uploaded-file flex-column justify-content-between ${isLogo ? "is-logo" : ""}`}
            style={{ height: "100%" }}
          >
            <Row>
              <img
                src={base64Image}
                className={`uploaded-file-show-by-default ${isLogo ? "is-logo" : ""}`}
                onClick={() => onClickPreview ? onClickPreview(item) : {}} />
            </Row>
            <Row className="d-flex justify-content-between w-100">
              <Col span={20}>
                <h2 style={{ width: fileNameWidth || "unset" }}>{fileNameKey ? itemName : item.name}</h2>
                <span>{Number(fileSizeKey ? item[fileSizeKey] : item.size) / 1000} KB</span>
              </Col>
              <Col className="d-flex">
                <ERPButton
                  color={"borderless"}
                  customStyle={{ borderRadius: "50%", zIndex: 999, padding: "0px" }}
                  disabled={disableDeleteButton}
                  onClick={() => {
                    onClickRemove(multiple ? index : "", item?.id)
                    filepond.current.value = null
                  }}>
                  <ERPIcon featherIcon={"FiTrash"} />
                </ERPButton>
              </Col>
            </Row>
          </div>
        )}
      </div>)
  }

  return (
    <div className={`custom-file-upload ${containerClass || ""}`} style={containerStyle}>
      {label && (
        <Label className={!boldLabel ? `${labelClass || ""}` : `custom-form-label ${labelClass || ""}`}>
          {label}
          {required && <span className="text-danger">*</span>}
        </Label>
      )}
      <div className="custom-file-upload-input">
        <ERPButton
          color={"white"}
          size={uploadBtnSize}
          disabled={disabled}
          onClick={() => {
            filepond.current.value = null
            filepond.current.click()
          }}>
          {buttonLabel || "Upload File"}
        </ERPButton>
        <p className={helpTextClass || ""}>{helptext}</p>
        <input
          type={type}
          accept={accept}
          onChange={onChange}
          multiple={multiple}
          disabled={disabled}
          ref={filepond}
          style={{ display: "none" }} />
      </div>
      {
        errors?.length > 0 && (
          <span className="text-danger">
            {_.find(errors, (obj) => obj.field === context)?.message}{" "}
          </span>
        )
      }
      {(_.isArray(value) && value.length > 0) && (
        <div
          className={`d-flex g-2 ${fileContainerClass || ""}`}
          style={{ ...fileContainerStyle }}
        >
          {value.map((item, index) => renderFile(item, index))}
        </div>
      )}
      {(!_.isArray(value) && value.name) && (
        <div className={`d-flex g-2`}>
          {renderFile(value, 0)}
        </div>
      )}
    </div>
  )
}

export default FileUpload