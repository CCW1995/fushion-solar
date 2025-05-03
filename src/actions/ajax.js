import { BEGIN_AJAX_CALL, AJAX_CALL_ERROR, AJAX_CALL_SUCCESS } from "./type";

export const beginAjaxCall = () => ({ type: BEGIN_AJAX_CALL });

export const ajaxCallSuccess = () => ({ type: AJAX_CALL_SUCCESS });

export const ajaxCallError = (payload) => ({
  type: AJAX_CALL_ERROR,
  payload,
});
