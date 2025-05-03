import Axios from "axios";
import Cookies from "js-cookie";

import getDomainURL from "utils/api";
import { storeItem, clearItem } from "utils/tokenStore";
import { setUserProfile } from "reducers/profile";
import { beginAjaxCall, ajaxCallError, ajaxCallSuccess } from "./ajax";

export const getProfile = () => (dispatch) => {
  dispatch(beginAjaxCall());

  const token = Cookies.get(window.location.href.includes("/admin-impersonate")
    ? "ERP_IMPERSONATE_ACCESS_TOKEN"
    : "ERP_ACCESS_TOKEN")
  Axios.defaults.headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${token}`,
  };
  Axios.defaults.responseType = "json";
  return Axios.get(`${getDomainURL()}/api/profile`)
    .then((response) => {
      if (response.headers['x-is-impersonating'] === 'true') {
        storeItem('ERP_IMPERSONATE_PERMISSION_TOKEN', response.headers['x-permission-cache-key'])
      }
      clearItem("PERMISSION_ALERT");
      dispatch(setUserProfile(response.data));
      dispatch(ajaxCallSuccess());
    })
    .catch((error) => {
      if (error) {
        if (error === 401) {
          alert(
            "Due to inactivity, your session has expired, please login again."
          );
        }
        dispatch(ajaxCallError(error));
      } else {
        dispatch(ajaxCallError(error));
      }
    });
};
