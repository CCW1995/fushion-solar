import { SET_STATION_INFO } from "../actions/type";

const initialState = {
  currentState: {}
};

export const setStationInfo = payload => ({
  type: SET_STATION_INFO,
  payload,
});


export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STATION_INFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
