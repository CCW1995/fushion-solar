const regex = /^[+]?\d+(-\d+)?$/;

export const validateContactNo = (input) => {
  return regex.test(input)
}

// Example usage:
// console.log(validateNumber("123"));    - true
// console.log(validateNumber("-123"));   - true
// console.log(validateNumber("+123"));   - true
// console.log(validateNumber("12.34"));  - true
// console.log(validateNumber("-12.34")); - true
// console.log(validateNumber("+12.34")); - true
// console.log(validateNumber("abc"));    - false
// console.log(validateNumber("12."));    - false
// console.log(validateNumber(".123"));   - false
