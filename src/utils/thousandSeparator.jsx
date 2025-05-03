import _ from "lodash"

export const thousandSeparatorFormatter = (val, decimalPlaces) => {
  if (!val) {
    val = 0;
  }

  let temp = `${val}`.replace(/[^0-9.]/g, '');
  temp = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces ?? 2,
    maximumFractionDigits: decimalPlaces ?? 2,
  }).format(temp);

  if (val < 0) {
    temp = `-${temp}`;
  }
  return temp
}

export const numericFormatter = val => {
  let numericValue = `${val}`.replace(/,/g, '');
  numericValue = parseFloat(numericValue).toFixed(2);

  return parseFloat(numericValue)
}

export const sanitizePriceInput = val => {
  if (_.isEmpty(val)) {
    return 0.00
  } else {
    return val.replace(/[^\d.]/g, "").replace(/^(\d*\.\d{0,2})\d*$/, "$1")
  }
}