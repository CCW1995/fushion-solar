import _ from "lodash";
import React from "react";
import { Col, FormGroup, Label } from "reactstrap";

import InputContent from "./typeaheadInput";
import MultiInputContent from "./typeaheadMultiInput";
import "./index.scss";

const FormTypeahead = (props) => {
  // row - boolean
  // labelCol - customize column size for label
  // inputCol - customize column size for input
  // errors - [ { field: 'name', message: 'Name is required' }]

  return (
    <FormGroup
      style={{ ...props.formGroupStyle, marginBottom: "6px" }}
      className={`${props.formGroupClass || ""}`}
      row={props.row || false}
      required={props.required}>
      {props.label && (
        <Label
          for={props.context}
          {...(props.row ? props.labelCol : {})}
          style={{ ...props.labelStyle }}
          className={!props.boldLabel ? `${props.labelClass || ""}` : `custom-form-label ${props.labelClass || ""}`}>
          {props.label}
          {props.required ? <span className="text-danger">*</span> : ""}
        </Label>
      )}
      {props.row ? (
        <Col {...(props.row && props.inputCol)}>
          {props.multiple && <MultiInputContent {...props} />}
          {!props.multiple && <InputContent {...props} />}
          <span className="text-danger" style={{ fontSize: 14 }}>
            {props.errors?.length > 0 &&
              _.find(props.errors, (obj) => obj.field === props.context)
                ?.message}{" "}
          </span>
        </Col>
      ) : (
        <>
          {props.multiple && <MultiInputContent {...props} />}
          {!props.multiple && <InputContent {...props} />}
          <span className="text-danger" style={{ fontSize: 14 }}>
            {props.errors?.length > 0 &&
              _.find(props.errors, (obj) => obj.field === props.context)
                ?.message}{" "}
          </span>
        </>
      )}
      {
        props.labelAfterInput && (
          <Col {...(props.row && props.labelAfterInputCol)} className="d-flex align-items-center">
            {props.labelAfterInput}
          </Col>
        )
      }
    </FormGroup>
  );
};

export default FormTypeahead;
