import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import "./chatpage.css";
import "./chatStuff/css/chat.css";
import { UrlParser } from "../../customs/others";
import {
  CHAT_LIST_URL,
  CHAT_SOCKET_URL,
  LOCAL_CHECK,
  MESSAGE_URL,
  OTHER_PROFILE_URL,
  READ_WHOLE_ROOM_URL,
} from "../../urls";
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import { io } from "socket.io-client";
import useTyping from "./chatStuff/components/hooks/useTyping";

import useOutsideClick from "./chatStuff/components/hooks/useOutsideClick";
import moment from "moment";

import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

let other_user_g = [];

let msgs_g = [];
let chat_id = [];
let all_users_msgs = [];
const addUserMsgs = (user, data, page, cangn) => {
  let v = { user: user, msg_set: [...data], page: page, canGoNext: cangn };
  all_users_msgs.push(v);
};
const updateUserMsgMultiple = (data, user, page, cangn) => {
  // console.log("user multiple::", user);
  // console.log("data multiple::", data);

  let g = all_users_msgs.filter((item) => item.user === user);
  // console.log("g multiple::", g);

  let h = g[0].msg_set;
  h = [...data.reverse(), ...h];
  g[0].msg_set = h;
  g[0].page = page;
  g[0].canGoNext = cangn;
  const index = all_users_msgs.findIndex((item) => item.user === user);
  // console.log("index::", index);

  if (index !== -1) {
    let b = all_users_msgs.splice(index, 1)[0];
    // console.log("b::", b);
  }
  all_users_msgs.push(g[0]);
};
const addSingleMsg = (data, user) => {
  // console.log("user::", user);
  // console.log("data::", data);

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

const updateReadMsg = (user) => {
  try {
    let g = all_users_msgs.filter((item) => item.user === user);
    let h = g[0].msg_set;
    for (var o in h) {
      let ii = h[o];
      ii.is_read = true;
    }
  } catch (error) {
    console.log(error);
  }
};

//  = ({ message: { type, body, ownedByCurrentUser, fileName, user: { name } } }) => {

const ChatPage = (props) => {
  const {
    state: { userDetail },
    dispatch,
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

  const [activeUserProfile, setActiveUserProfile] = useState([]);
  const [sending, setSending] = useState(false);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [user, setUser] = useState();
  const [file, setFile] = useState();
  const [activeTyping, setActiveTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const socketRef = useRef();

  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping();

  const url = CHAT_SOCKET_URL;
  const { username, timeout } = props.match.params;
  let guessKey;
  let el;
  useEffect(() => {
    firstRun();
  }, [username, timeout]);

  const firstRun = async () => {
    checkSize();

    await getOtherProfile(username);
    await createUserChat(other_user_g.id);

    await getChatList();

    await getChatMsgs(other_user_g.id, 1);

    try {
      el = document.querySelector(".content");
      el.addEventListener("mousemove", mouseMove);
    } catch (error) {
      console.log("couldnt add mousemove event listener to window");
    }

    return () => {
      el.removeEventListener("mousemove", mouseMove);

      document
        .querySelector("input[type='file']")
        .removeEventListener("change mouseout", function () {
          var fileinput = document.querySelector(this),
            value = fileinput.value.split(/[\/]/g).pop();

          fileinput.siblings("span").text(value);
        });
    };
  };

  var mouseTimeout;
  var timeoutTime = true;
  const mouseMove = () => {
    if (!timeoutTime) return;
    clearTimeout(timeout);
    startMouseMessage();
    timeoutTime = false;

    mouseTimeout = setTimeout(function () {
      console.log("mousemoving");
      stopMouseMessage();
      timeoutTime = true;
    }, 10000);
  };
  useEffect(() => {
    if (!activeUser) return;
    guessKey =
      parseInt(userDetail.user.id) +
      parseInt(activeUser ? activeUser.id : timeout);
    // console.log("guessKey1::", guessKey);
    if (!guessKey) return;
    guessKey = guessKey + "getit";
    // console.log("guessKey2::", guessKey);
    socketRef.current = io(url, {
      query: { room: guessKey, name: userDetail.user.username },
    });

    setUser({
      name: username,
    });

    socketRef.current.on("allUsersData", ({ users }) => {
      setUsers(users);
      // console.log("users:", users);
    });

    socketRef.current.on("send message", (message) => {
      // console.log("new msg:::", message);
      //const incomingMessage = {
      // ...message,
      // ownedByCurrentUser: message.senderId === socketRef.current.id,
      // };
      // console.log("incomingMessage::", incomingMessage);

      setSending(false);
      msgs_g.push(message.data);

      setMsg((msg) => [...msg, message.data]);
      addSingleMsg(message.data, other_user_g.username);
      // console.log("all_users_msg:::", all_users_msgs);
      scrollToBottom();
    });

    socketRef.current.on("start typing message", (typingInfo) => {
      // console.log("typing...", typingInfo);
      if (typingInfo.senderId !== socketRef.current.id) {
        setActiveTyping(true);
        updateReadMsg(other_user_g.username);
        // const user = typingInfo.user;
        setMsg((msg) => [...msg, []]);
      }
    });

    socketRef.current.on("stop typing message", (typingInfo) => {
      console.log("stoped typing...", typingInfo);

      if (typingInfo.senderId !== socketRef.current.id) {
        //const user = typingInfo.user;

        setActiveTyping(false);
        updateReadMsg(other_user_g.username);
        setMsg((msg) => [...msg, []]);
      }
    });

    socketRef.current.on("start moving mouse", (mouseInfo) => {
      if (mouseInfo.senderId !== socketRef.current.id) {
        if (userDetail.user.username !== mouseInfo.user) {
          console.log("started moving mouse...", mouseInfo);
          setIsOnline(true);

          updateReadMsg(other_user_g.username);
          //const user1 = mouseInfo.user;
          setMsg((msg) => [...msg, []]);
        }
      }
    });

    socketRef.current.on("stop moving mouse", (mouseInfo) => {
      if (mouseInfo.senderId !== socketRef.current.id) {
        if (userDetail.user.username !== mouseInfo.user) {
          const user1 = mouseInfo.user;
          console.log("stoped moving mouse...", mouseInfo);
          setIsOnline(false);

          updateReadMsg(other_user_g.username);
          setMsg((msg) => [...msg, []]);
          updateChanger(user1);
        }
      }
    });
    return () => {
      socketRef.current.close();
      console.log("closed socket");
    };
  }, [activeUser, username]);

  let readTimeout;
  let readTimeoutTime = true;

  let sock_temp_name = userDetail.user.username;
  const updateChanger = (name) => {
    sock_temp_name = name;
    if (!readTimeoutTime) return;
    clearTimeout(readTimeout);

    readTimeoutTime = false;
    readTimeout = setTimeout(async () => {
      if (sock_temp_name !== userDetail.username) {
        // console.log("changing sock_tem_name::", sock_temp_name);
        // alert("stop");
        await readWholeRoom();
        await getChatList();
      } else {
        // console.log("another big error:::", sock_temp_name);
        alert("another big error");
      }
      readTimeoutTime = true;
    }, 20000);
  };

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
      // console.log(" getOtherProfile in Chat res::::", gp.data);
      other_user_g = gp.data.user;
      if (setU) {
        setActiveUser((u) => (u = gp.data.user));
      }
      setActiveUserProfile((uu) => (uu = gp.data));
    }
  };

  const getChatList = async () => {
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
      // console.log(" getChatList::::", res.data.results);

      setChatListObj([...res.data.results]);
    }
    setFetching(false);
  };
  const getChatMsgs = async (id, page = null) => {
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

          // console.log("ogchat::", mychat);

          let mychat4 = mychat.sort(function (a, b) {
            if (a.id > b.id) return 1;
            if (a.id < b.id) return -1;
            return 0;
          });
          // console.log("c4::", mychat4);

          setMsg((msg) => [...mychat]);
          // console.log("mychat..::", mychat);
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
            // console.log("pagehere::", page);
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
      // console.log(" getChatMsg::::", res.data);
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
            // console.log("mychat.page", mychat.page);
            updateUserMsgMultiple(
              data.results,
              other_user_g.username,
              mychat.page,
              true
            );
            // console.log("all_users_msgs:::", all_users_msgs, mychat.page);
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
            // console.log("all_users_msgs:::", all_users_msgs, mychat.page);
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
      // console.log("all_users_msgs:::", all_users_msgs);
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
      // console.log("createUserchat results::::", result.data);
      // setChatId((c) => (c = result.data));
      chat_id = result.data;
    }
  };

  const readWholeRoom = async () => {
    console.log("in readWholeRoom");
    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: READ_WHOLE_ROOM_URL,
      token,
      data: { chatlist_id: chat_id.id },
    }).catch((e) => {
      console.log("readWholeRoom error::::", e);
    });

    if (result) {
      // console.log("readWholeRoom results::::", result.data);
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
    // console.log("chat_id::", chat_id.id);
    formData.append("message", newMessage);
    formData.append("sender_id", userDetail.user.id);
    formData.append("receiver_id", activeUser.id);
    formData.append("chatlist_id", chat_id.id);
    if (file) {
      // console.log("file::", file);
      for (let i = 0; i < file.length; i++) {
        formData.append("attachments", file[i]);
      }
    }
    // console.log(activeUser.id, chat_id.id, formData);

    const res = await axiosHandler({
      method: "post",
      url: `${MESSAGE_URL}`,
      token,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }).catch((e) => {
      console.log("Error in send Message::::", e);
      setSending(false);
    });

    if (res) {
      // console.log(" Send Message results::::", res.data);
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
  const startMouseMessage = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("start moving mouse", {
      senderId: socketRef.current.id,
      user: userDetail.user.username,
    });
  };

  const stopMouseMessage = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("stop moving mouse", {
      senderId: socketRef.current.id,
      user: userDetail.user.username,
    });
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    setSending(true);
    scrollToBottom();
    // console.log("sending::", newMessage);
    cancelTyping();
    const res = await sendMessageHandler();
    if (!res) return;
    await sendSocketMessage(res);
    setNewMessage("");
    await getChatList();
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
    // console.log("onchange::", e.target.value);
    setNewMessage(e.target.value);
  };

  const getChat = async (user, chatlist) => {
    if (other_user_g.username === user.username) return;
    setActiveUser(user);
    setFetchingMsgs(true);
    chat_id = chatlist;
    setMsg([]);
    // console.log("change user::", user);
    await getOtherProfile(user.username, false);
    await getChatMsgs(user.id, 1);
    setFile(null);
    setNewMessage("");
  };

  const renderMessages = (item) => {
    // console.log("render messages:::", item);
    if (!item) return <></>;
    if (item.length < 1) return <></>;

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
                <div className="avatar_overlay">
                  <img
                    src={
                      LOCAL_CHECK
                        ? UrlParser(item.sender.user.user_picture)
                        : item.sender.user.user_picture_url
                    }
                  />
                </div>
              </div>
              <div className="text">
                <div>{item.message}</div>
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
                <br />
                <div className="date-and-seen">
                  <div className="date">
                    <small>
                      {moment(item.created_at).format("YYYY/MM/DD")}{" "}
                    </small>
                    <small>{moment(item.created_at).format("hh:mm a")}</small>
                  </div>
                  <div className="seen">
                    {userDetail.user.username === item.sender.user.username ? (
                      <>
                        {item.is_read ? (
                          <span class="material-icons">done_all</span>
                        ) : (
                          <span class="material-icons">check</span>
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </div>
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
    <div className="content">
      <aside>
        <div className="head">
          <div className="avatar"></div>

          {small ? (
            <div className="name">Chat list loading..</div>
          ) : (
            <div className="name"> Chat list loading...</div>
          )}
        </div>
        <div className="friends_list ok"></div>
      </aside>
      <div className="midcont">
        <div className="head">
          <div className="avatarbox">
            <div className="avatar_overlay">
              <img src="" />
            </div>
          </div>

          <h4>Loading...</h4>
        </div>
        <div className="messagescont" id="scrollto">
          <>
            <div>
              <span>loading...</span>
            </div>
          </>
        </div>
        <span id="hidden-span"></span>
        <div className="bottomchat">
          <div className="">
            <form className="bottom-form">
              <div className="input-text">
                {" "}
                <input
                  className="inputbutton"
                  type="text"
                  required
                  name="message"
                  placeholder="Press enter to send.."
                  // autoFocus={true}
                  disabled={true}
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
                    className={`${file ? "svg-send" : "svg-disabled"}`}
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  <input type="file" className="chat-file-input" multiple />
                </label>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                  className="emogi"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
                <button type="submit" className="btn-svg" disabled={true}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="gray"
                    className={`svg-disabled"}`}
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <div></div>
            </form>
          </div>
        </div>
      </div>
    </div>;
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
              {isOnline && <div className="online"></div>}
              <Link to={`/other-profile/` + activeUser.username}>
                <img
                  src={`${
                    LOCAL_CHECK
                      ? activeUser.user_picture
                      : activeUser.user_picture_url
                  }`}
                />
              </Link>
            </div>
          </div>
          <Link to={`/other-profile/` + activeUser.username}>
            <h4>
              {activeUser.username} &nbsp; {activeTyping && "is typing..."}
            </h4>
          </Link>
          {/* <div className="configschat">
            <i className="fa fa-phone"></i>
            <i className="fa fa-camera-retro"></i>
            <i className="fa fa-ellipsis-v"></i>
          </div> */}
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
                  // autoFocus={true}
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
                    className={`${file ? "svg-send" : "svg-disabled"}`}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="gray"
                    className={`${newMessage ? "svg-send" : "svg-disabled"}`}
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
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

  // if (item.other) {
  //   if (item.other.username === userDetail.user.username) {
  //     user = item.user;
  //     notification = item.user_notification;
  //     me = item.other;
  //   }
  // }
  if (item.user) {
    if (item.user.username === userDetail.user.username) {
      user = item.other;
      notification = item.user_notification;
      me = item.user;
    } else {
      if (item.other) {
        if (item.other.username === userDetail.user.username) {
          user = item.user;
          notification = item.other_notification;
          me = item.other;
        }
      }
    }
  }
  if (user) {
    if (user.username === userDetail.user.username) {
      return null;
    }
    let item_message = item.last_message;
    let item_message_str;
    if (item_message?.length > 10) {
      item_message_str = `${item_message.substring(0, 10)}...`;
    } else {
      item_message_str = item.last_message;
    }

    return (
      <>
        <div
          className={"friend  fcenter"}
          key={user.id}
          onClick={() => props.getChat(user, item)}
        >
          <div className="avatarbox">
            {/* <div className="online"></div> */}

            <div className="avatar_overlay">
              <img
                src={LOCAL_CHECK ? user.user_picture : user.user_picture_url}
              />
            </div>
          </div>
          <div className="namemsg">
            <p className="b">{user.username} </p>
            <p className="b-str">
              {item_message_str}
              {notification && notification !== 0 ? <>({notification})</> : ""}
            </p>
          </div>
          <div className="timeago">
            <p> {moment(item.updated_at).format("YYYY/MM/DD")} </p>
          </div>
        </div>
      </>
    );
  }
  return <></>;
};
export default ChatPage;
