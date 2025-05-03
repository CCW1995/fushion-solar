import _ from 'lodash';
import { capitalizeFirstLetter } from './capitalize';
// If the placeholder contains capitalWords, it will capitalize the word 
// Example:
// "Employee Id/NAME" -> "Employee ID/Name"
const capitalWords = ["id", "dn", "cn"]

export const formatPlaceholder = (placeholder) => {
  let specialChars = findSpecialChar(placeholder);
  if (specialChars.length === 0) {
    return capitalizeFirstLetter(placeholder);
  }

  let newPlaceHolder = [];

  specialChars.forEach((char, index) => {
    let word = index === 0 ? placeholder.slice(0, char.index) : placeholder.slice(specialChars[index - 1].index + 1, char.index);
    newPlaceHolder.push(word);
  });

  newPlaceHolder.push(placeholder.slice(specialChars[specialChars.length - 1].index + 1, placeholder.length));

  capitalWords.map(word => word.toLowerCase())
  newPlaceHolder = newPlaceHolder.map(word => capitalWords.includes(word.toLowerCase()) ?
    word.toUpperCase() :
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  newPlaceHolder = newPlaceHolder.join("");
  specialChars.forEach(char =>
    newPlaceHolder = newPlaceHolder.slice(0, char.index) + char.char + newPlaceHolder.slice(char.index, newPlaceHolder.length)
  );

  return newPlaceHolder;
}

export const findSpecialChar = (str) => {
  const regex = /[^A-Za-z0-9]/;
  let specialChars = [];
  Array.from(str).forEach((char, index) => {
    if (char !== "." && regex.test(char)) {
      specialChars.push({ char: char, index: index });
    }
  })
  return specialChars;
}

export const formatIC = (str) => {
  if (str.includes("-")) return str;
  return `${str.slice(0, 6)}-${str.slice(6, 8)}-${str.slice(8, str.length)}`;
}

export const formatFullName = (firstName, lastName) => {
  if (!firstName && !lastName) {
    return "-"
  }
  return `${firstName || ""} ${lastName || ""}`.trim()
}