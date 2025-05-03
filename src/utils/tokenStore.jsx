import Cookies from "js-cookie";

export const storeItem = (itemName, Item) => Cookies.set(itemName, Item);
export const clearItem = (itemName) => Cookies.remove(itemName);
export const getItem = (itemName) => Cookies.get(itemName);
