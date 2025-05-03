import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";
import localForage from "localforage";

const persistConfig = {
  key: "ERPdb",
  storage: localForage,
  blacklist: ["ajaxReducer"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(initialState) {
  return createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(thunk, reduxImmutableStateInvariant()))
  );
}
