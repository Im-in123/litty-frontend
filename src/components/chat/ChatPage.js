import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import "./chatpage.css";
import { UrlParser } from "../../customs/others";
import {
  BASE_URL1,
  BASE_URL2,
  CHAT_LIST_URL,
  GET_FOLLOWING_CHAT,
  LOCAL_CHECK,
  MESSAGE_URL,
  OTHER_PROFILE_URL,
  POST_URL,
} from "../../urls";
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import { postTriggerAction } from "../../stateManagement/actions";
import { activeChatUserAction } from "../../stateManagement/actions";
import { io } from "socket.io-client";
import useTyping from "./chatStuff/components/hooks/useTyping";
import NewMessageForm from "./chatStuff/components/NewMessageForm";
import InfoBar from "./chatStuff/components/InfoBar";
import Indicator from "./chatStuff/components/Indicator";
import Messages from "./chatStuff/components/Messages";
import useOutsideClick from "./chatStuff/components/hooks/useOutsideClick";

import "./chatStuff/css/input.css";
import "./chatStuff/css/messages.css";
import "./chatStuff/css/message.css";
import { Picker } from "emoji-mart";

let other_user_g = [];

let msgs_g = [];

let all_users_msgs = [];
const addUserMsgs = (user, data, page, cangn) => {
  let v = { user: user, msg_set: [...data], page: page, canGoNext: cangn };
  all_users_msgs.push(v);
};
const updateUserMsgMultiple = (data, user, page, cangn) => {
  console.log("user multiple::", user);
  console.log("data multiple::", data);

  let g = all_users_msgs.filter((item) => item.user === user);
  console.log("g multiple::", g);

  let h = g[0].msg_set;
  h = [...data.reverse(), ...h];
  g[0].msg_set = h;
  g[0].page = page;
  g[0].canGoNext = cangn;
  const index = all_users_msgs.findIndex((item) => item.user === user);
  console.log("index::", index);

  if (index !== -1) {
    let b = all_users_msgs.splice(index, 1)[0];
    console.log("b::", b);
  }
  all_users_msgs.push(g[0]);
};
const addSingleMsg = (data, user) => {
  console.log("user::", user);
  console.log("data::", data);

  let g = all_users_msgs.filter((item) => item.user === user);

  let h = g[0].msg_set;
  h = [data, ...h];
  g[0].msg_set = h;
  const index = all_users_msgs.findIndex((item) => item.user === user);
  if (index !== -1) {
    let b = all_users_msgs.splice(index, 1)[0];
  }
  all_users_msgs.push(g[0]);
};

const ChatPage = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const {
    state: { activeChatUser },
  } = useContext(store);
  const [small, setSmall] = useState(false);

  const [chatListObj, setChatListObj] = useState([]);

  const [msg, setMsg] = useState([]);

  const [fetching, setFetching] = useState(true);
  const { showEmoji, setShowEmoji, ref } = useOutsideClick(false);

  const [loading, setLoading] = useState(true);
  const [moreMsgs, setMoreMsgs] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchingMsgs, setFetchingMsgs] = useState(true);

  const [error, setError] = useState(false);
  const [activeUser, setActiveUser] = useState([]);
  const [chat_id, setChatId] = useState([]);

  const [activeUserProfile, setActiveUserProfile] = useState([]);
  const [sending, setSending] = useState(false);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [user, setUser] = useState();
  const [file, setFile] = useState();
  const [activeTyping, setActiveTyping] = useState(false);

  const socketRef = useRef();

  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping();

  const url = "http://localhost:9000/";
  const { username, timeout } = props.match.params;
  let guessKey;

  useEffect(async () => {
    checkSize();

    await getOtherProfile(username);
    await createUserChat(other_user_g.id);

    await getChatList();

    await getChatMsgs(other_user_g.id, 1);
    document
      .querySelector("input[type='file']")
      .addEventListener("change mouseout", function () {
        var fileinput = document.querySelector(this),
          value = fileinput.value.split(/[\/]/g).pop();

        fileinput.siblings("span").text(value);
      });

    return () => {};
  }, [username, timeout]);

  useEffect(() => {
    if (!activeUser) return;
    guessKey =
      parseInt(userDetail.user.id) +
      parseInt(activeUser ? activeUser.id : timeout);
    console.log("guessKey1::", guessKey);
    if (!guessKey) return;
    guessKey = guessKey + "getit";
    console.log("guessKey2::", guessKey);
    socketRef.current = io(url, {
      query: { room: guessKey, name: userDetail.user.username },
    });

    setUser({
      name: username,
    });

    socketRef.current.on("allUsersData", ({ users }) => {
      setUsers(users);
      console.log("users:", users);
    });

    socketRef.current.on("send message", (message) => {
      console.log("new msg:::", message);
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      console.log("incomingMessage::", incomingMessage);

      let msd = message.data.message_attachments;
      for (var i in msd) {
        let ii = msd[i];
        ii.attachment.file_upload = BASE_URL1 + ii.attachment.file_upload;
      }
      message.data.message_attachments = msd;
      setSending(false);
      msgs_g.push(message.data);

      setMsg((msg) => [...msg, message.data]);
      addSingleMsg(message.data, other_user_g.username);
      console.log("all_users_msg:::", all_users_msgs);
      scrollToBottom();
    });

    socketRef.current.on("start typing message", (typingInfo) => {
      console.log("typing...", typingInfo);
      if (typingInfo.senderId !== socketRef.current.id) {
        setActiveTyping(true);
        const user = typingInfo.user;

        // setTypingUsers((users) => [...users, user]);
      }
    });

    socketRef.current.on("stop typing message", (typingInfo) => {
      console.log("stoped typing...", typingInfo);

      if (typingInfo.senderId !== socketRef.current.id) {
        const user = typingInfo.user;

        setActiveTyping(false);

        // setTypingUsers((users) => users.filter((u) => u.name !== user.name));
      }
    });
    return () => {
      socketRef.current.close();
      console.log("closed socket");
    };
  }, [activeUser, username]);

  const clicker = (e) => {
    document
      .getElementsByClassName("friends_list")[0]
      .classList.toggle("active");
  };

  const getOtherProfile = async (username, setU = true) => {
    let extra = `?keyword=${username}`;
    const token = await getToken();
    const gp = await axiosHandler({
      method: "get",
      url: OTHER_PROFILE_URL + extra,
      token,
    }).catch((e) => {
      console.log("Error in getOtherProfile in Chat::::", e);
      setError(true);
    });

    if (gp) {
      console.log(" getOtherProfile in Chat res::::", gp.data);
      other_user_g = gp.data.user;
      if (setU) {
        setActiveUser((u) => (u = gp.data.user));
      }
      setActiveUserProfile((uu) => (uu = gp.data));
    }
  };

  const getChatList = async (extra = "") => {
    console.log("in getChatList");

    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: CHAT_LIST_URL,
      token,
    }).catch((e) => {
      console.log("Error in getChatList::::", e);
    });

    if (res) {
      console.log(" getChatList::::", res.data.results);

      setChatListObj([chatListObj, ...res.data.results]);
    }
    setFetching(false);
  };
  const getChatMsgs = async (id, page = null) => {
    // setMoreMsgs(false);
    console.log("in getChatMsgs");
    let shouldGoNext = true;
    if (page) {
      if (all_users_msgs.length > 0) {
        let mychat = all_users_msgs.filter(
          (item) => item.user === other_user_g.username
        );
        if (mychat.length > 0) {
          if (mychat[0].canGoNext) {
            setMoreMsgs(true);
          } else {
            setMoreMsgs(false);
          }

          mychat = mychat[0].msg_set;

          console.log("ogchat::", mychat);

          let mychat4 = mychat.sort(function (a, b) {
            if (a.id > b.id) return 1;
            if (a.id < b.id) return -1;
            return 0;
          });
          console.log("c4::", mychat4);

          setMsg((msg) => [...mychat]);
          console.log("mychat..::", mychat);
          scrollToBottom();
          setLoadingMore(false);
          setFetchingMsgs(false);

          return;
        }
      }
    } else {
      if (all_users_msgs.length > 0) {
        let mychat = all_users_msgs.filter(
          (item) => item.user === other_user_g.username
        );
        if (mychat.length > 0) {
          mychat = mychat[0];
          let mypage = mychat.page;
          if (mypage) {
            page = mypage + 1;
            shouldGoNext = mychat.canGoNext;
            console.log("pagehere::", page);

            // mychat = mychat.msg_set;
            // setMsg((msg) => [...mychat].reverse());
            // console.log("mychat::", mychat);
            // scrollToBottom();
            // return;
          }
        } else {
          page = 1;
        }
      }
    }

    if (!shouldGoNext) {
      console.log("cant go next, returning");
      setFetchingMsgs(false);

      setLoadingMore(false);

      return;
    }
    let extra = `user_id=${id}`;
    const token = await getToken();
    let url;
    url = `${MESSAGE_URL}?page=${page}&${extra}`;

    const res = await axiosHandler({
      method: "get",
      url: url,
      token,
    }).catch((e) => {
      console.log("Error in getChatMsg::::", e);
    });

    if (res) {
      setFetchingMsgs(false);
      console.log(" getChatMsg::::", res.data);
      setLoadingMore(false);
      setMoreMsgs(false);

      if (all_users_msgs.length > 0) {
        let mychat = all_users_msgs.filter(
          (item) => item.user === other_user_g.username
        );
        if (mychat.length > 0) {
          mychat = mychat[0];
          console.log("updating");
          let data = res.data;
          if (data.next) {
            setMoreMsgs(true);

            mychat.page += 1;
            console.log("mychat.page", mychat.page);
            updateUserMsgMultiple(
              data.results,
              other_user_g.username,
              mychat.page,
              true
            );
            console.log("all_users_msgs:::", all_users_msgs, mychat.page);
            setMsg((msg) => [...res.data.results, ...msg]);

            return;
          } else {
            setMoreMsgs(false);

            updateUserMsgMultiple(
              data.results,
              other_user_g.username,
              mychat.page,
              false
            );
            console.log("all_users_msgs:::", all_users_msgs, mychat.page);
            setMsg((msg) => [...res.data.results, ...msg]);

            return;
          }
        }
        setMoreMsgs(false);
      }

      scrollToBottom();
      let cgn_ = false;
      if (res.data.next) cgn_ = true;
      addUserMsgs(other_user_g.username, res.data.results, page, cgn_);
      console.log("all_users_msgs:::", all_users_msgs);
      setMsg((msg) => [...res.data.results].reverse());
      setFetchingMsgs(false);
    }
  };
  const createUserChat = async (other_id) => {
    console.log("in createuserchat");
    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: CHAT_LIST_URL,
      token,
      data: { other_id: other_id, user_id: userDetail.user.id },
    }).catch((e) => {
      console.log("createUserchat error::::", e.response.data);
    });

    if (result) {
      console.log("createUserchat results::::", result.data);
      setChatId((c) => (c = result.data));
    }
  };
  const sendSocketMessage = (data) => {
    if (!socketRef.current) return;
    if (file) {
      const messageObject = {
        senderId: socketRef.current.id,
        type: "file",
        body: "file not attached here",
        mimeType: file.type,
        fileName: file.name,
        user: user,
        data: data,
      };
      setNewMessage("");
      setFile();
      socketRef.current.emit("send message", messageObject);
    } else {
      const messageObject = {
        senderId: socketRef.current.id,
        type: "text",
        body: newMessage,
        user: user,
        data: data,
      };
      socketRef.current.emit("send message", messageObject);
      console.log("emitted sendsockmsg");
    }
  };
  const sendMessageHandler = async (e) => {
    const token = await getToken();
    const formData = new FormData();
    formData.append("message", newMessage);
    formData.append("sender_id", userDetail.user.id);
    formData.append("receiver_id", activeUser.id);
    formData.append("chat_id", chat_id.id);
    if (file) {
      console.log("file::", file);
      for (let i = 0; i < file.length; i++) {
        formData.append("attachments", file[i]);
      }
    }
    console.log(activeUser.id, chat_id.id, formData);

    const res = await axiosHandler({
      method: "post",
      url: `${MESSAGE_URL}`,
      token,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }).catch((e) => {
      console.log("Error in send Message::::", e);
    });

    if (res) {
      console.log(" Send Message results::::", res.data);
      setMessages([res.data, ...messages]);
      return res.data;
    }
    return false;
  };
  const startTypingMessage = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("start typing message", {
      senderId: socketRef.current.id,
      user: userDetail.user.username,
    });
  };

  const stopTypingMessage = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("stop typing message", {
      senderId: socketRef.current.id,
      user: userDetail.user.username,
    });
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    setSending(true);
    scrollToBottom();
    console.log("sending::", newMessage);
    cancelTyping();
    // sendSocketMessage(newMessage);
    const res = await sendMessageHandler();
    if (!res) return;
    await sendSocketMessage(res);
    setNewMessage("");
  };

  function selectFile(e) {
    if (typeof e.target.files[0] !== "undefined") {
      if (e.target.files.length > 1) {
        let fl = e.target.files.length - 1;
        setNewMessage(e.target.files[0].name + " and " + fl + " others");
      } else {
        setNewMessage(e.target.files[0].name);
      }

      setFile(e.target.files);
    } else {
      return null;
    }
  }
  const handleEmojiShow = () => {
    setShowEmoji((v) => !v);
  };
  const handleEmojiSelect = (e) => {
    setNewMessage((newMessage) => (newMessage += e.native));
  };
  useEffect(() => {
    if (isTyping) startTypingMessage();
    else stopTypingMessage();
  }, [isTyping]);

  const handleNewMessageChange = (e) => {
    console.log("onchange::", e.target.value);
    setNewMessage(e.target.value);
  };

  const getChat = async (user) => {
    if (other_user_g.username === user.username) return;
    setActiveUser(user);
    setFetchingMsgs(true);

    setMsg([]);
    console.log("change user::", user);
    await getOtherProfile(user.username, false);
    await getChatMsgs(user.id, 1);
  };

  const renderMessages = (item) => {
    // console.log("render messages:::", item);
    let files = null;
    if (item) {
      try {
        if (item.message_attachments) {
          files = item.message_attachments;
          // console.log("message_attachments::", item.message_attachments);
        }
      } catch (error) {}

      return (
        <>
          <div className="msg">
            <div
              key={item.id}
              className={
                item.sender.user.username === userDetail.user.username
                  ? "user friend t"
                  : "user me t"
              }
            >
              <div className="avatarbox">
                {/* <div className="avatar_overlay"><img src="https://s-media-cache-ak0.pinimg.com/736x/c9/b8/87/c9b8873c63d378702f5b932d6acfa28b.jpg"/></div> */}
              </div>
              <div className="text">
                {item.message}
                <small>
                  {" "}
                  {Math.round(
                    (new Date().getTime() -
                      new Date(item.created_at).getTime()) /
                      60000
                  )}{" "}
                  ago
                </small>
                <div className="file-box">
                  {files &&
                    files.map((item, key) => (
                      <div className="file-obj" key={key}>
                        {item.attachment.mediaType === "audio" && (
                          <>
                            <audio
                              src={item.attachment.file_upload}
                              controls
                              preload="none"
                            ></audio>
                          </>
                        )}
                        {item.attachment.mediaType === "video" && (
                          <video
                            src={item.attachment.file_upload}
                            controls
                            preload="none"
                          ></video>
                        )}
                        {item.attachment.mediaType === "image" && (
                          <>
                            <img
                              src={item.attachment.file_upload}
                              alt="image"
                            />
                          </>
                        )}
                        {item.attachment.mediaType === "other_file" && (
                          <div className="other_file">
                            {item.attachment.og_name} &nbsp;
                            <a
                              href={item.attachment.file_upload}
                              download={item.attachment.og_name}
                            >
                              download
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  const scrollToBottom = () => {
    clearTimeout();
    setTimeout(() => {
      try {
        let chatArea = document.getElementById("scrollto");
        chatArea.scrollTop = chatArea.scrollHeight;
      } catch (error) {}
    }, 1000);
  };

  const checkSize = (e) => {
    let currentHideNav = window.innerWidth <= 1000;
    console.log("width stuff::", currentHideNav);
    if (currentHideNav === true) {
      setSmall(true);
    } else {
      setSmall(false);
    }
  };

  if (fetching) {
    return <div className="content">loading...</div>;
  }
  return (
    <div className="content">
      <aside>
        <div className="head" onClick={clicker}>
          <div className="avatar"></div>

          {small ? (
            <div className="name">Click here to toggle chat list</div>
          ) : (
            <div className="name"> Chat list</div>
          )}
        </div>
        <div className="friends_list ok">
          {chatListObj.map((item, key) => (
            <RenderUsers2 item={item} key={key} getChat={getChat} />
          ))}
        </div>
      </aside>
      <div className="midcont">
        <div className="head">
          <div className="avatarbox">
            <div className="avatar_overlay">
              {/* <img src={`${activeUserProfile.profile_picture}`} /> */}
              <img src={`${activeUser.user_picture}`} />
            </div>
          </div>
          <h4>
            {activeUser.username} &nbsp; {activeTyping && "is typing..."}
          </h4>
          <div className="configschat">
            <i className="fa fa-phone"></i>
            <i className="fa fa-camera-retro"></i>
            <i className="fa fa-ellipsis-v"></i>
          </div>
        </div>
        <div className="messagescont" id="scrollto">
          {!fetchingMsgs ? (
            <>
              <div className="load-more">
                {moreMsgs && (
                  <span
                    onClick={() => {
                      setLoadingMore(true);
                      getChatMsgs(activeUser.id);
                    }}
                  >
                    {loadingMore ? "Loading..." : "Load previous..."}
                  </span>
                )}
              </div>
              {msg &&
                msg.map((item, key) => {
                  return renderMessages(item);
                })}
              {sending && (
                <div className="msg">
                  <div className="user friend t">
                    <div className="avatarbox"></div>
                    <div className="text">sending...</div>
                  </div>
                </div>
              )}
              {msg.length < 1 && (
                <div className="show-no-message">
                  <span> No messages.. Send a message to start chatting.</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <span>loading</span>
              </div>
            </>
          )}
        </div>
        <span id="hidden-span"></span>
        <div className="bottomchat">
          <div className="">
            <form onSubmit={handleSendMessage} className="bottom-form">
              <div className="input-text">
                {" "}
                <input
                  className="inputbutton"
                  type="text"
                  required
                  onKeyPress={startTyping}
                  onKeyUp={stopTyping}
                  name="message"
                  onChange={handleNewMessageChange}
                  value={newMessage}
                  placeholder="Press enter to send.."
                  autoFocus={true}
                  disabled={sending}
                />
              </div>
              <div className="sub-bottom-chat">
                <label>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  <input
                    type="file"
                    className="chat-file-input"
                    onChange={selectFile}
                    multiple
                  />
                </label>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                  className="emogi"
                  onClick={handleEmojiShow}
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
                <button type="submit" className="btn-svg" disabled={sending}>
                  {!newMessage ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="gray"
                      className="send svg-disabled"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#FFFFFF"
                      className="send "
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <div>
                {showEmoji && (
                  <div ref={ref}>
                    <Picker onSelect={handleEmojiSelect} emojiSize={20} />
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const RenderUsers2 = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  let item = props.item;
  let user, me, notification;
  // console.log("render users2:::", item);

  if (item.other) {
    if (item.other.username === userDetail.user.username) {
      user = item.user;
      notification = item.other_notification;
      me = item.other;
    }
  }
  if (item.user) {
    if (item.user.username === userDetail.user.username) {
      user = item.other;
      notification = item.user_notification;
      me = item.user;
    }
  }

  if (user) {
    if (user.username === userDetail.user.username) {
      return null;
    }
    return (
      <>
        <div
          className={"friend  fcenter"}
          key={user.id}
          onClick={() => props.getChat(user)}
        >
          <div className="avatarbox">
            <div className="avatar_overlay">
              <img
                src={LOCAL_CHECK ? user.user_picture : user.user_picture_url}
              />
            </div>
          </div>
          <div className="namemsg">
            <p className="b">{user.username} </p>
          </div>
          <div className="timeago">
            <p>20 mins ago</p>
          </div>
        </div>
      </>
    );
  }
  return <></>;
};
export default ChatPage;
