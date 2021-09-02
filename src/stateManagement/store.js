import React, { createContext, useReducer } from "react";
import {
  userDetailState,
  userDetailReducer,

  postCommentState,
  postCommentReducer,

  commentTriggerState,
  commentTriggerReducer,

  postTriggerState,
  postTriggerReducer,

  bogusState,
  bogusTriggerReducer,

  newCommentState,
  newCommentReducer,

  newReplyState,
  newReplyReducer,

  activeChatUserState,
  activeChatUserReducer

} from "./reducers";

const reduceReducers = (...reducers) => (prevState, value, ...args) => {
  return reducers.reduce(
    (newState, reducer) => reducer(newState, value, ...args),
    prevState
  );
};

const combinedReducers = reduceReducers(
 userDetailReducer,
 commentTriggerReducer,
 postCommentReducer,
 postTriggerReducer,
 bogusTriggerReducer,
 newCommentReducer,
 newReplyReducer,
 activeChatUserReducer
);

const initialState = {
  ...userDetailState,
  ...commentTriggerState,
  ...postCommentState,
  ...postTriggerState,
  ...bogusState,
  ...newCommentState,
  ...newReplyState,
  ...activeChatUserState

};

const store = createContext(initialState);
const { Provider } = store;

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(combinedReducers, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StoreProvider };
