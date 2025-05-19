import { combineReducers } from "redux";
import ThemeOptions from "./themeOptions";
import AjaxReducer from "./ajax";
import PathReducer from "./path";
import ProfileReducer from "./profile";
import StationReducer from "./station";

export default combineReducers({
  AjaxReducer,
  ThemeOptions,

  ProfileReducer,
  PathReducer,
  StationReducer
});
