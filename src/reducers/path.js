import { SET_PATH } from "../actions/type";

const initialState = {
  currentState: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PATH:
      return {
        ...state,
        currentState: action.payload,
      };
    default:
      return state;
  }
};
