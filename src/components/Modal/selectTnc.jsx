import React, { useEffect, useState } from "react"
import _ from "lodash"

import CustomModal from "./"
import CustomCard from "components/Card"
import CustomRadioButton from "components/Input/radio"

import "./index.scss"

const SelectTNCModal = ({
  title,
  isOpen,
  subheader,
  tncOptions = {},
  selectedPayload = {},
  printOrPreview,
  leftActionText,
  rightActionText,
  hideLeftAction = false,
  hideRightAction = false,
  customFooter,
  customFooterClass,
  onClose,
  onClickLeftAction,
  onClickRightAction,
  onChange,
  customLabel,
  documentNo,
}) => {
  const [updatedTncOptions, setUpdatedTncOptions] = useState({})
  const [hasValidOptions, setHasValidOptions] = useState(false)
  const [selectedTncIds, setSelectedTncIds] = useState({})

  useEffect(() => {
    if (!isOpen || _.isEmpty(tncOptions)) {
      return
    }

    try {
      const newTncOptions = Object.keys(tncOptions).reduce((acc, documentType) => {
        const tncs = _.sortBy(tncOptions[documentType] || [], "cust_tnc_id")

        if (tncs.length === 1) {
          acc[documentType] = [{ ...tncs[0], is_default: true }]
        } else if (tncs.length > 1 && !tncs.some((tnc) => tnc.is_default)) {
          acc[documentType] = tncs.map((tnc, index) => ({
            ...tnc,
            is_default: index === 0,
          }))
        } else {
          acc[documentType] = tncs
        }
        return acc
      }, {})

      const validOptions = Object.keys(newTncOptions).some(docType =>
        Array.isArray(newTncOptions[docType]) && newTncOptions[docType].length > 0
      )

      setHasValidOptions(validOptions)
      setUpdatedTncOptions(newTncOptions)

      const initialSelectedTncIds = Object.keys(newTncOptions).reduce((acc, docType) => {
        const selectedTnc = Array.isArray(newTncOptions[docType]) &&
          newTncOptions[docType].find((tnc) => tnc.is_default)

        if (selectedTnc && selectedTnc.cust_tnc_id) {
          acc[docType] = selectedTnc.cust_tnc_id
        }
        return acc
      }, {})

      setSelectedTncIds(initialSelectedTncIds)

      if (onChange && !_.isEmpty(initialSelectedTncIds)) {
        onChange(initialSelectedTncIds)
      }
    } catch (error) {
      setHasValidOptions(false)
      setUpdatedTncOptions({})
    }
  }, [isOpen, tncOptions])

  const handleTncChange = (documentType, selectedTNC) => {
    if (!updatedTncOptions[documentType]) {
      return
    }

    const newTncOptions = {
      ...updatedTncOptions,
      [documentType]: updatedTncOptions[documentType].map((tnc) => ({
        ...tnc,
        is_default: tnc.cust_tnc_id === selectedTNC.cust_tnc_id && tnc.uuid === selectedTNC.uuid,
      })),
    }

    setUpdatedTncOptions(newTncOptions)

    const newSelectedTncIds = { ...selectedTncIds }
    const selectedTnc = newTncOptions[documentType].find((tnc) => tnc.is_default)

    if (selectedTnc && selectedTnc.cust_tnc_id) {
      newSelectedTncIds[documentType] = selectedTnc.cust_tnc_id
    }

    setSelectedTncIds(newSelectedTncIds)

    if (onChange) {
      onChange(newSelectedTncIds)
    }
  }

  const getDocumentNumber = (documentType) => {
    if (documentNo) return documentNo

    switch (documentType) {
      case "Picking List":
        return selectedPayload?.so_no ?? "-"
      case "Invoice":
      case "Invoice Manual":
      case "AR Invoice":
        return selectedPayload?.inv_no ?? selectedPayload?.so_no ?? "-"
      case "Delivery Order":
      case "Delivery Order Manual":
        return selectedPayload?.do_no ?? "-"
      default:
        return "-"
    }
  }

  const handleRightAction = () => {
    if (!hasValidOptions) {
      onClose()
      return
    }

    const hasValidSelections = Object.keys(updatedTncOptions).some(docType =>
      selectedTncIds[docType] !== undefined
    )

    if (hasValidSelections && onClickRightAction) {
      onClickRightAction()
    } else {
      onClose()
    }
  }

  return (
    <CustomModal
      title={title}
      isOpen={isOpen}
      leftActionText={!hideLeftAction ? leftActionText || "Cancel" : ""}
      rightActionText={!hideRightAction ? rightActionText || "OK" : ""}
      customFooter={customFooter}
      customFooterClass={customFooterClass}
      onClickLeftAction={onClickLeftAction}
      onClickRightAction={handleRightAction}
      onClose={onClose}
      width={800}
      customBodyStyle={{ overflowY: "auto", maxHeight: "400px" }}
    >
      <div className="confirmation-modal-content">
        {(hasValidOptions && subheader) ? <p>{subheader}</p> : null}

        {Object.keys(updatedTncOptions).map((documentType) => {
          const documentNumber = getDocumentNumber(documentType)
          const options = updatedTncOptions[documentType]
          if (!Array.isArray(options) || options.length === 0) {
            return null
          }

          return (
            <div key={documentType}>
              <p className="mt-4">
                {customLabel ?? documentType} No.: {documentNumber}
              </p>
              <CustomCard mode="default" containerStyle={{ padding: "12px 16px", marginTop: "6px" }}>
                {options.map((tnc) => (
                  <CustomRadioButton
                    key={tnc.uuid}
                    name={documentType}
                    checked={tnc.is_default || false}
                    value={tnc.uuid}
                    customClass="mt-1"
                    label={tnc.uuid}
                    onChange={() => handleTncChange(documentType, tnc)}
                  />
                ))}
              </CustomCard>
            </div>
          )
        })}

        {hasValidOptions
          ? (
            <>
              <br />
              {
                printOrPreview
                  ? <p>Continue to {printOrPreview === "print" ? "print" : "preview"} document(s)?</p>
                  : null
              }
            </>
          ) : <p>Please set up T&C for this user in order to proceed to {printOrPreview === "print" ? "print" : "preview"} document(s)</p>
        }
      </div>
    </CustomModal>
  )
}

export default SelectTNCModal
