export const salutation = [
  { value: "Mr.", label: "Mr." },
  { value: "Ms.", label: "Ms." },
  { value: "Mrs.", label: "Mrs." }
]

export const gender = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unknown", label: "Prefer Not to Say" }
]

export const preventDefault = (e) => {
  if (e.key.toLowerCase() === "e" || e.key === "-") {
    e.preventDefault()
  }
}

export const handleInputFocus = (updateFunction, object, field, defaultValue) => () => {
  if (object[field] === defaultValue) {
    updateFunction({ ...object, [field]: "" })
  }
}

export const noLeadingZerosInteger = (val) => {
  let cleanValue = val.replace(/[^\d]/g, "")
  if (cleanValue.length > 1) {
    cleanValue = cleanValue.replace(/^0+/, "")
  }

  return cleanValue
}

export const sanitizedCurrency = (val) => {
  // Remove non-digit characters except for a single period
  let cleanValue = val.replace(/[^\d.]/g, "")

  // Ensure only one period is present
  const parts = cleanValue.split('.')
  if (parts.length > 2) {
    cleanValue = `${parts[0]}.${parts.slice(1).join('')}`
  }

  // Ensure only two decimal places
  cleanValue = cleanValue.replace(/^(\d*\.\d{0,2})\d*$/, "$1")

  // Remove leading zeros unless followed by a period
  cleanValue = cleanValue.replace(/^0+(?=\d)/, "")

  return Number(cleanValue)
}

export const months = [
  { label: "January", value: "Jan" },
  { label: "February", value: "Feb" },
  { label: "March", value: "Mar" },
  { label: "April", value: "Apr" },
  { label: "May", value: "May" },
  { label: "June", value: "Jun" },
  { label: "July", value: "Jul" },
  { label: "August", value: "Aug" },
  { label: "September", value: "Sep" },
  { label: "October", value: "Oct" },
  { label: "November", value: "Nov" },
  { label: "December", value: "Dec" },
]