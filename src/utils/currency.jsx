export const currencyFormat = (value) => {
  let parts = (value.split("."))

  if (parts.length > 1) {
    if (parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2)
      value = parts.join(".")
    }
  }

  return value
}

export const financialFormat = (number) => { //formatting with thousand separator and two decimal places
  if (isNaN(number)) {
    return '0.00'
  }

  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)

  return formattedNumber
}

export const numericOnBlur = (value, withDecimal) => {
  if (value === "" || value === ".") {
    return withDecimal ? "0.00" : "0"
  }

  return value
}

export const numericOnFocus = (value, onChangeFunction, context, withDecimal) => {
  if (withDecimal) {
    if (value === "" || value === "0.00") {
      onChangeFunction("", context)
    }
  } else {
    if (value === "" || value === "0") {
      onChangeFunction("", context)
    }
  }

  return value
}