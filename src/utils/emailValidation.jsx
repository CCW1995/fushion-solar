import _ from "lodash";

const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

export const emailValidation = ({
  errors,
  fieldName,
  fieldValue,
  onChange,
  errorKey
}) => {
  let tmp = _.cloneDeep(errors)
  let tmpIndex = _.findIndex(tmp, item => item.field === fieldName)
  const value = fieldValue?.trim()
  if (!_.isEmpty(value) && !emailRegex.test(value)) {
    if (tmpIndex === -1) {
      tmp.push({
        field: fieldName,
        message: "Please enter a valid email address"
      })
    }
  } else {
    tmp.splice(tmpIndex, 1)
  }
  if (errorKey) {
    onChange(errorKey, tmp)
  } else {
    onChange(tmp)
  }
}
