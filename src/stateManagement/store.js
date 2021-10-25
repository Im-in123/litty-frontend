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
  delCommentState,
  delCommentReducer,
  delReplyState,
  delReplyReducer,
  newReplyReplyState,
  newReplyReplyReducer,
  activeChatUserState,
  activeChatUserReducer,
  refreshProfileReducer,
  refreshFeedReducer,
  refreshFeedState,
  refreshProfileState,
  postContainerReducer,
  postContainerState,
} from "./reducers";

const reduceReducers =
  (...reducers) =>
  (prevState, value, ...args) => {
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
  delCommentReducer,
  delReplyReducer,
  newReplyReplyReducer,
  activeChatUserReducer,
  refreshFeedReducer,
  refreshProfileReducer,
  postContainerReducer
);

const initialState = {
  ...userDetailState,
  ...commentTriggerState,
  ...postCommentState,
  ...postTriggerState,
  ...bogusState,
  ...delCommentState,
  ...delReplyState,
  ...newReplyReplyState,
  ...activeChatUserState,
  ...refreshFeedState,
  ...refreshProfileState,
  ...postContainerState,
};

const store = createContext(initialState);
const { Provider } = store;

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(combinedReducers, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StoreProvider };
