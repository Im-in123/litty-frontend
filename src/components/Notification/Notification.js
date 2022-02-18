import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./notification.css";
import {
  BASE_URL1,
  NOTIFICATION_URL,
  LOCAL_CHECK,
  NOTIFICATION_COUNT_URL,
} from "../../urls";
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import moment from "moment";

let g_noti = [];

let p1;
let goneNext = false;
let canGoNext = false;
let shouldHandleScroll = false;

const Notitfication = (props) => {
  const [notification, setNotification] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(true);

  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  useEffect(() => {
    try {
      window.addEventListener("scroll", autoFetchNotication);
    } catch (error) {
      console.log("couldnt add event listener to window");
    }

    return () => {
      window.removeEventListener("scroll", autoFetchNotication);
      g_noti = [];
      p1 = [];
    };
  }, []);
  useEffect(() => {
    getNotifications(1);
    return () => {};
  }, []);

  const autoFetchNotication = async () => {
    if (shouldHandleScroll) {
      // console.log("window.innerHeight:::", window.innerHeight);
      // console.log(" window.scrollY::", window.scrollY);
      // console.log("document.body.scrollHeight:::", document.body.scrollHeight);
      // console.log("added::", window.innerHeight + window.scrollY);
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 100
      ) {
        console.log("reached");
        console.log("finally", canGoNext, goneNext);
        if (canGoNext && !goneNext) {
          goneNext = true;
          shouldHandleScroll = false;

          await getNotifications();
        } else {
          console.log("passing cangonext", canGoNext, goneNext);
        }
      }
    } else {
      console.log("passing autofetch", canGoNext, goneNext);
    }
  };
  const getNotifications = async (page = null) => {
    let extra = `keyword=${""}`;

    console.log("getting notification");
    setFetching(true);
    let url;
    if (page) {
      url = `${NOTIFICATION_URL}?page=${page}&${extra}`;
    } else {
      url = `${p1.next}`;
    }
    const token = await getToken();
    const result = await axiosHandler({
      method: "get",
      url: url,
      token,
    }).catch((e) => {
      console.log("notification error::::", e);
      canGoNext = true;
      goneNext = false;
    });

    if (result) {
      console.log("notification results::::", result.data);
      console.log("notification qs::::", result.data.results);

      g_noti = [...g_noti, ...result.data.results];
      setNotification(g_noti);
      p1 = result.data;

      if (p1.next) {
        canGoNext = true;

        goneNext = false;

        shouldHandleScroll = true;
      } else {
        shouldHandleScroll = false;
        canGoNext = true;
      }
      setFetching(false);
      readNotifications();
      setLoading(false);
    }
  };
  const readNotifications = async () => {
    const data = { keyword: "mark-all-as-read" };
    const token = await getToken();
    const gp = await axiosHandler({
      method: "post",
      url: `${NOTIFICATION_COUNT_URL}`,
      data: data,
      token,
    }).catch((e) => {
      console.log("Error in readNotification ::::", e);
    });

    if (gp) {
      console.log(" readNotification::::", gp.data);
    }
  };
  if (loading) {
    return (
      <div className="containerNotification">
        <h3>Notifications</h3>
        <div className="notification-main">Loading...</div>
        <div className="load-more-post">
          <span></span>
        </div>
      </div>
    );
  }
  return (
    <div className="containerNotification">
      <h3>Notifications</h3>
      <div className="notification-main">
        {notification.map((item, key) => (
          <Noti data={item} key={key} />
        ))}
      </div>
      <div className="load-more-post">
        <span>
          {fetching ? (
            <>{p1 && p1.next ? "Loading ..." : ""}</>
          ) : (
            <>{p1 && p1.next ? "Loading more..." : "End of notifications!"}</>
          )}
        </span>
      </div>
    </div>
  );
};
export default Notitfication;

const Noti = (props) => {
  const data = props.data;
  if (!data) return <></>;
  return (
    <div className={` notification ${data.action}`}>
      <div className="message">
        <div className="user-image">
          <Link to={`/other-profile/` + data.sender.username}>
            <img
              alt="image"
              src={
                LOCAL_CHECK
                  ? data.sender.user_picture
                  : data.sender.user_picture_url
              }
            />
          </Link>
        </div>
        <div className="inner">
          <div className="username">
            <Link to={`/other-profile/` + data.sender.username}>
              {data.sender.username}
            </Link>
          </div>
          {data.action === "post-like" && (
            <div className="user-msg">
              {data.message}
              <p className="s-p">
                {moment(data.created_at).format("DD/MM/YYYY")}{" "}
                {moment(data.created_at).format("hh:mm a")}
              </p>
            </div>
          )}
          {data.action === "comment-like" && (
            <div className="user-msg">
              {data.message}
              <p>{data.comment.comment}</p>
              <p className="s-p">
                {moment(data.created_at).format("DD/MM/YYYY")}{" "}
                {moment(data.created_at).format("hh:mm a")}
              </p>
            </div>
          )}
          {data.action === "reply-like" && (
            <div className="user-msg">
              {data.message}
              <p>{data.reply.comment}</p>
            </div>
          )}
          {data.action === "post-comment" && (
            <div className="user-msg">
              {data.message}
              <p>{data.comment.comment}</p>
              <p className="s-p">
                {moment(data.created_at).format("DD/MM/YYYY")}{" "}
                {moment(data.created_at).format("hh:mm a")}
              </p>
            </div>
          )}
          {data.action === "comment-reply" && (
            <div className="user-msg">
              {data.message}
              <p>{data.reply.comment}</p>
            </div>
          )}
          {data.action === "reply-reply" && (
            <div className="user-msg">
              {data.message}
              <p>{data.reply.comment}</p>
              <p className="s-p">
                {moment(data.created_at).format("DD/MM/YYYY")}{" "}
                {moment(data.created_at).format("hh:mm a")}
              </p>
            </div>
          )}

          {data.action === "user-follow" && (
            <div className="user-msg">
              {data.message}
              <p className="s-p">
                {moment(data.created_at).format("DD/MM/YYYY")}{" "}
                {moment(data.created_at).format("hh:mm a")}
              </p>
            </div>
          )}

          {data.action === "message" && (
            <Link
              to={`/chatpage/username=${data.sender.username}-timeout=${data.sender.id}`}
            >
              <div className="user-msg">
                {data.message}
                <p className="s-p">
                  {moment(data.created_at).format("DD/MM/YYYY")}{" "}
                  {moment(data.created_at).format("hh:mm a")}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      <PostCont item={data.post} />
      {/* <div className="action">
        <span class="material-icons-outlined close">cancel</span>
      </div> */}
    </div>
  );
};

const PostCont = (props) => {
  if (!props.item) return <></>;
  let item = props.item;
  let image;
  if (item) {
    if (item.image.length > 0) {
      let renderIcon = false;
      image = item.image[0];
      // console.log("image:::", image);
      if (item.image.length > 1) {
        renderIcon = true;
      }
      if (item.video.length > 0) renderIcon = true;
      let show_actual_img = false;

      if (LOCAL_CHECK) {
        if (image.thumbnail === BASE_URL1 + "/media/image_empty.jpg") {
          show_actual_img = true;
        }
      } else {
        if (image.thumbnail_url === BASE_URL1 + "/media/image_empty.jpg") {
          show_actual_img = true;
        }
      }

      return (
        <>
          <Link
            to={`/new/${item.id}`}
            // target="_blank"
            // rel="noopener noreferrer"
          >
            <div className="img-content" key={image.id}>
              {LOCAL_CHECK ? (
                <img
                  src={!show_actual_img ? image.thumbnail : image.image}
                  alt=""
                />
              ) : (
                <img
                  src={!show_actual_img ? image.thumbnail_url : image.image_url}
                  alt=""
                />
              )}
            </div>
          </Link>
        </>
      );
    }
    let video;
    if (item.video.length > 0) {
      let renderIcon = false;
      video = item.video[0];

      if (item.video.length > 1) {
        renderIcon = true;
      }
      return (
        <>
          <Link
            to={`/new/${item.id}`}
            // target="_blank"
            // rel="noopener noreferrer"
          >
            <div className="img-content" key={video.id}>
              <img
                src={LOCAL_CHECK ? video.thumbnail : video.thumbnail_url}
                className=""
                alt=""
              />
            </div>
          </Link>
        </>
      );
    }
  }
};
