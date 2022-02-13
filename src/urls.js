// export const BASE_URL = "http://127.0.0.1:8000/";
// export const BASE_URL ="http://192.168.43.77:8000/";
export const BASE_URL = "https://litty-server.herokuapp.com/";

// export const BASE_URL1 = "http://127.0.0.1:8000";
// export const BASE_URL1 ="http://192.168.43.77:8000";
export const BASE_URL1 = "https://litty-server.herokuapp.com";

// export const BASE_URL2 = "127.0.0.1:8000";
// export const BASE_URL2 = "192.168.43.77:8000";
export const BASE_URL2 = "litty-server.herokuapp.com";

// export const CHAT_SOCKET_URL = "http://localhost:9000/";
export const CHAT_SOCKET_URL = "https://litty-chat-server.herokuapp.com/";

// export const LOCAL_CHECK = true;
export const LOCAL_CHECK = false;

export const LOGIN_URL = BASE_URL + "user/login";
export const SIGNUP_URL = BASE_URL + "user/signup";
export const ME_URL = BASE_URL + "user/me";
export const PROFILE_URL = BASE_URL + "user/profile";
export const USER_SEARCH_URL = BASE_URL + "user/user-search";
export const OTHER_PROFILE_URL = BASE_URL + "user/otherprofile";
export const GET_FOLLOWING_CHAT = BASE_URL + "user/get-following-chat";

export const REFRESH_URL = BASE_URL + "user/refresh";
export const LOGOUT_URL = BASE_URL + "user/logout";

export const POST_URL = BASE_URL + "post/";
export const SEARCH_PTV_URL = BASE_URL + "search-ptv/";
export const NOTIFICATION_URL = BASE_URL + "notification/";

export const COMMENT_URL = BASE_URL + "comment/";
export const REPLY_URL = BASE_URL + "reply/";
export const SAVED_URL = BASE_URL + "saved/";

export const POST_LIKE_URL = BASE_URL + "liked/";

// export const LIKE_URL = BASE_URL + "like-view";
export const POST_DELETE = BASE_URL + "post-delete";

export const COMMENT_LIKE_URL = BASE_URL + "comment-like";
export const REPLY_LIKE_URL = BASE_URL + "reply-like";
export const USER_SAVED_URL = BASE_URL + "user-saved";

export const COMMENT_DELETE_URL = BASE_URL + "comment-delete";
export const REPLY_DELETE_URL = BASE_URL + "reply-delete";

export const SECONDARY_EMAIL_VERIFICATION =
  BASE_URL + "user/secondary-email-verification";
export const FILE_UPLOAD_URL = BASE_URL + "file-upload/";

export const PROFILE_PIC_URL = BASE_URL + "user/propic-upload";
export const UPDATE_FOLLOW = BASE_URL + "user/update-follow";
export const CHECK_FOLLOW = BASE_URL + "user/check-follow";

export const CHAT_LIST_URL = BASE_URL + "message/chatlist/";
export const MESSAGE_URL = BASE_URL + "message/message/";
export const MESSAGE_GROUP_URL = BASE_URL + "message/message-group/";
export const MESSAGE_GROUP_CHAT_URL = BASE_URL + "message/message-group-chat/";
export const READ_WHOLE_ROOM_URL = BASE_URL + "message/read-whole-room";
