import { Buffer } from "buffer"

export const convertObjectToBase64 = (param) => {
  let tmp = JSON.stringify(param)
  return Buffer.from(tmp).toString("base64")
}

export const convertBase64ToObject = (base64String) => {
  let tmp = Buffer.from(base64String, "base64").toString()
  return JSON.parse(tmp)
}
