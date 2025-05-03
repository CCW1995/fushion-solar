import { combineReducers } from "redux";
import ThemeOptions from "./themeOptions";
import AjaxReducer from "./ajax";
import PathReducer from "./path";
import ProfileReducer from "./profile";

export default combineReducers({
  AjaxReducer,
  ThemeOptions,

  ProfileReducer,
  PathReducer
});
