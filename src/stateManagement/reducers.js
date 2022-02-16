import {
  userDetailAction,
  CommentTriggerAction,
  postCommentAction,
  commentInputSetterAction,
  refreshFeedAction,
  postContainerAction,
  newReplyReplyAction,
  deleteCommentAction,
  deleteReplyAction,
  volumeAction,
  slideAction,
  checkAllFollowAction,
  updateFollowAction,
} from "./actions";

export const checkAllFollowState = {
  checkAllFollow: [],
};
export const slideTriggerState = {
  slideTrigger: [],
};
export const commentTriggerState = {
  commentTrigger: false,
};

export const postCommentState = {
  postComment: false,
};

export const userDetailState = {
  userDetail: null,
};

export const commentInputSetterState = {
  commentInputSetter: null,
};

export const delCommentState = {
  delComment: null,
};
export const delReplyState = {
  delReply: null,
};
export const newReplyReplyState = {
  newReplyReply: false,
};

export const refreshFeedState = {
  refreshFeed: true,
};

export const postContainerState = {
  postContainer: true,
};

export const volumeTriggerState = {
  volumeTrigger: true,
};
export const updateFollowTriggerState = {
  updateFollowTrigger: true,
};
export const commentTriggerReducer = (state, action) => {
  if (action.type === CommentTriggerAction) {
    return {
      ...state,
      commentTrigger: action.payload,
    };
  } else {
    return state;
  }
};

export const postCommentReducer = (state, action) => {
  if (action.type === postCommentAction) {
    return {
      ...state,
      postComment: action.payload,
    };
  } else {
    return state;
  }
};

export const userDetailReducer = (state, action) => {
  if (action.type === userDetailAction) {
    return {
      ...state,
      userDetail: action.payload,
    };
  } else {
    return state;
  }
};

export const commentInputSetterReducer = (state, action) => {
  if (action.type === commentInputSetterAction) {
    return {
      ...state,
      commentInputSetter: action.payload,
    };
  } else {
    return state;
  }
};

export const delCommentReducer = (state, action) => {
  if (action.type === deleteCommentAction) {
    return {
      ...state,
      delComment: action.payload,
    };
  } else {
    return state;
  }
};

export const delReplyReducer = (state, action) => {
  if (action.type === deleteReplyAction) {
    return {
      ...state,
      delReply: action.payload,
    };
  } else {
    return state;
  }
};

export const newReplyReplyReducer = (state, action) => {
  if (action.type === newReplyReplyAction) {
    return {
      ...state,
      newReplyReply: action.payload,
    };
  } else {
    return state;
  }
};

export const refreshFeedReducer = (state, action) => {
  if (action.type === refreshFeedAction) {
    return {
      ...state,
      refreshFeed: action.payload,
    };
  } else {
    return state;
  }
};

export const postContainerReducer = (state, action) => {
  if (action.type === postContainerAction) {
    return {
      ...state,
      postContainer: action.payload,
    };
  } else {
    return state;
  }
};

export const volumeReducer = (state, action) => {
  if (action.type === volumeAction) {
    return {
      ...state,
      volumeTrigger: action.payload,
    };
  } else {
    return state;
  }
};

export const slideReducer = (state, action) => {
  if (action.type === slideAction) {
    return {
      ...state,
      slideTrigger: action.payload,
    };
  } else {
    return state;
  }
};

export const checkAllFollowReducer = (state, action) => {
  if (action.type === checkAllFollowAction) {
    return {
      ...state,
      checkAllFollow: action.payload,
    };
  } else {
    return state;
  }
};

export const updateFollowReducer = (state, action) => {
  if (action.type === updateFollowAction) {
    return {
      ...state,
      updateFollowTrigger: action.payload,
    };
  } else {
    return state;
  }
};
