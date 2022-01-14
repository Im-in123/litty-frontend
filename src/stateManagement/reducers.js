import {
  secondChangeAction,
  userDetailAction,
  CommentTriggerAction,
  postCommentAction,
  postTriggerAction,
  bogusTriggerAction,
  activeChatUserAction,
  refreshFeedAction,
  refreshProfileAction,
  postContainerAction,
  newReplyReplyAction,
  deleteCommentAction,
  deleteReplyAction,
  volumeAction,
  slideAction,
  checkAllFollowAction,
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

export const postTriggerState = {
  postTrigger: 1,
};

export const secondChangeState = {
  secondChange: false,
};

export const userDetailState = {
  userDetail: null,
};

export const bogusState = {
  bogus: null,
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

export const activeChatUserState = {
  activeChatUser: null,
};

export const refreshFeedState = {
  refreshFeed: true,
};

export const refreshProfileState = {
  refreshProfile: null,
};

export const postContainerState = {
  postContainer: true,
};

export const volumeTriggerState = {
  volumeTrigger: true,
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

export const postTriggerReducer = (state, action) => {
  if (action.type === postTriggerAction) {
    return {
      ...state,
      postTrigger: action.payload,
    };
  } else {
    return state;
  }
};

export const secondChangeReducer = (state, action) => {
  if (action.type === secondChangeAction) {
    return {
      ...state,
      secondChange: action.payload,
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

export const bogusTriggerReducer = (state, action) => {
  if (action.type === bogusTriggerAction) {
    return {
      ...state,
      bogus: action.payload,
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

export const activeChatUserReducer = (state, action) => {
  if (action.type === activeChatUserAction) {
    return {
      ...state,
      activeChatUser: action.payload,
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

export const refreshProfileReducer = (state, action) => {
  if (action.type === refreshProfileAction) {
    return {
      ...state,
      refreshProfile: action.payload,
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
