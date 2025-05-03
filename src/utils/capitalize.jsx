export const capitalizeFirstLetter = (text) => {
  return text[0].toUpperCase() + text.slice(1)
}

export const capitalizeEachFirstLetter = (text, splitter) => {
  let tmp = text?.split(splitter ?? " ")
  let tmpText = ""
  tmp = tmp?.filter(val => val !== "")
  tmp?.map((val, index) => {
    if (index !== 0) {
      tmpText += " "
    }
    tmpText += capitalizeFirstLetter(val)
  })
  return tmpText
}