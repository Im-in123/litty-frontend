import {
 
 secondChangeAction,
 userDetailAction, 
 CommentTriggerAction,
 postCommentAction,
 postTriggerAction,
 bogusTriggerAction,
 activeChatUserAction
} from "./actions";

export const commentTriggerState = {
  commentTrigger: false,
};

export const postCommentState = {
  postComment: false,
};

export const postTriggerState = {
  postTrigger: false,
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

export const newCommentState = {
  newComment: null,
};

export const newReplyState = {
  newReply: null,
};

export const activeChatUserState = {
  activeChatUser: null,
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

export const secondChangeReducer= (state, action) => {
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


export const newCommentReducer = (state, action) => {
  if (action.type === newCommentReducer) {
    return {
      ...state,
      newComment: action.payload,
    };
  } else {
    return state;
  }
};


export const newReplyReducer = (state, action) => {
  if (action.type === newReplyReducer) {
    return {
      ...state,
      newReply: action.payload,
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