import React, { createContext, useReducer } from "react";
import {
  userDetailState,
  userDetailReducer,
  postCommentState,
  postCommentReducer,
  commentTriggerState,
  commentTriggerReducer,
  commentInputSetterState,
  commentInputSetterReducer,
  delCommentState,
  delCommentReducer,
  delReplyState,
  delReplyReducer,
  newReplyReplyState,
  newReplyReplyReducer,
  refreshFeedReducer,
  refreshFeedState,
  postContainerReducer,
  postContainerState,
  volumeTriggerState,
  volumeReducer,
  slideTriggerState,
  slideReducer,
  checkAllFollowState,
  checkAllFollowReducer,
  updateFollowReducer,
  updateFollowTriggerState,
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
  commentInputSetterReducer,
  delCommentReducer,
  delReplyReducer,
  newReplyReplyReducer,

  refreshFeedReducer,
  postContainerReducer,
  volumeReducer,
  slideReducer,
  checkAllFollowReducer,
  updateFollowReducer
);

const initialState = {
  ...userDetailState,
  ...commentTriggerState,
  ...postCommentState,
  ...commentInputSetterState,
  ...delCommentState,
  ...delReplyState,
  ...newReplyReplyState,

  ...refreshFeedState,
  ...postContainerState,
  ...volumeTriggerState,
  ...slideTriggerState,
  ...checkAllFollowState,
  ...updateFollowTriggerState,
};

const store = createContext(initialState);
const { Provider } = store;

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(combinedReducers, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StoreProvider };
