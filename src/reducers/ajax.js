import {
  BEGIN_AJAX_CALL,
  AJAX_CALL_ERROR,
  AJAX_CALL_SUCCESS,
} from "../actions/type";

let initialState = {
  ajaxCallProgress: 0,
  ajaxErrorMessage: "",
  ajaxSuccessMessage: "",
  ajaxError: false,
  ajaxSuccess: false,
};

export default function ajaxReducer(state = initialState, action) {
  switch (action.type) {
    case BEGIN_AJAX_CALL:
      return {
        ...state,
        ajaxCallProgress: state.ajaxCallProgress + 1,
        ajaxError: false,
        ajaxSuccess: false,
      };

    case AJAX_CALL_ERROR:
      return {
        ...state,
        ajaxCallProgress: state.ajaxCallProgress - 1,
        ajaxErrorMessage: action.payload,
        ajaxError: true,
        ajaxSuccess: false,
      };

    case AJAX_CALL_SUCCESS:
      return {
        ...state,
        ajaxCallProgress: state.ajaxCallProgress - 1,
        ajaxSuccessMessage: action.payload,
        ajaxError: false,
        ajaxSuccess: true,
      };

    default:
      return state;
  }
}
