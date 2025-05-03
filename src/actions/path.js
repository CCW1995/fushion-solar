import { SET_PATH } from "./type";

export const setPath = (payload) => (dispatch) => {
	dispatch(setPathSuccess(payload));
};

export const setPathSuccess = (payload) => ({
	type: SET_PATH,
	payload,
});
