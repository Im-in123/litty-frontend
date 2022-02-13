import React, { useState, useContext, useEffect } from "react";
import "./newComment.css";
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import { UrlParser } from "../../customs/others";
import moment from "moment";
import {
  BASE_URL,
  BASE_URL1,
  COMMENT_URL,
  LOCAL_CHECK,
  REPLY_URL,
  COMMENT_LIKE_URL,
  COMMENT_DELETE_URL,
} from "../../urls";
import {
  CommentTriggerAction,
  commentInputSetterAction,
  deleteCommentAction,
  newReplyReplyAction,
  deleteReplyAction,
} from "../../stateManagement/actions";
import NewReply from "./NewReply";
import { Link } from "react-router-dom";

const NewComCard = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  // console.log("commentCard props::::", props);
  const {
    state: { commentTrigger },
  } = useContext(store);
  const {
    state: { postComment },
  } = useContext(store);
  const {
    state: { delReply },
  } = useContext(store);

  const [replyData, setReplyData] = useState([]);
  const c = props.data?.id;
  const [pid, setPid] = useState(c);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLength, setLikeLength] = useState(false);
  const [view, setView] = useState("View replies");
  const [replyLength, setReplyLength] = useState(null);
  const [replyAvailable, setReplyAvailable] = useState(false);
  const [nextReps, setNextReps] = useState([]);

  const {
    state: { newReplyReply },
  } = useContext(store);

  useEffect(() => {
    console.log("newReplyReply:::", newReplyReply);
    if (newReplyReply) {
      console.log("newReplyReply postcomment::", newReplyReply.postcomment);
      console.log("pid::", pid);
      if (pid === newReplyReply.postcomment) {
        setReplyData([...replyData, newReplyReply]);
        props.setCommentCount(props.commentCount + 1);

        dispatch({ type: newReplyReplyAction, payload: false });
      }
    }
  }, [newReplyReply]);

  useEffect(() => {
    console.log("reply Trigger:::", commentTrigger);
    if (commentTrigger) {
      console.log(
        "Comment reply trigger postcomment::",
        commentTrigger.postcomment
      );
      console.log("pid::", pid);

      setReplyData([commentTrigger, ...replyData]);
      props.setCommentCount(props.commentCount + 1);

      dispatch({ type: CommentTriggerAction, payload: false });
    }
  }, [commentTrigger]);

  useEffect(() => {
    if (props.data) {
      CheckLike(props.data.like);

      let replies = props.data.reply;

      if (replies.length > 0) {
        setReplyAvailable(true);
        setReplyLength(replies.length);
        if (replyLength < 2) {
          setView("View reply");
        }
      }
    }
  }, []);

  const CheckLike = (like) => {
    try {
      for (var i in like) {
        if (like[i] === userDetail.user.id) {
          console.log("found it:::", like[i]);
          setIsLiked(true);
          setLikeLength(props.data.like.length);

          break;
        } else {
          setIsLiked(false);
          setLikeLength(props.data.like.length);
        }
      }
    } catch (error) {
      setIsLiked(false);
    }
  };

  useEffect(() => {
    if (delReply) {
      let filtered = [];
      for (let i in replyData) {
        let f = replyData[i];

        if (f.id !== delReply) {
          filtered = [...filtered, f];
        }
      }
      setReplyData(filtered);
      props.setCommentCount(props.commentCount - 1);

      dispatch({ type: deleteReplyAction, payload: null });
    }

    return () => {};
  }, [delReply]);

  if (props.data) {
    // console.log("commentCard props.data:::", props.data);
    // console.log("456789765434567::111::", props.replyList);

    let comment = props.data.comment;
    let replies = props.data.reply;

    const getReply = async (e, comment_id, next = false) => {
      e.preventDefault();
      setView("loading...");

      console.log("reply data::::", replyData);
      let data = { post_id: props.post_id, comment_id: comment_id };
      console.log("reply data1:::", data);
      let url;
      url = REPLY_URL + `?post_id=${props.post_id}&comment_id=${comment_id}`;
      if (next) {
        if (nextReps.next) {
          url = nextReps.next;
          console.log("nextReps:::", nextReps);
        } else {
          url =
            REPLY_URL + `?post_id=${props.post_id}&comment_id=${comment_id}`;
        }
      }
      console.log("url reply:::", url, next);
      const token = await getToken();
      const result = await axiosHandler({
        method: "get",
        url: url,
        token,
        data: data,
      }).catch((e) => {
        console.log("getReply error::::", e);
      });

      if (result) {
        setNextReps((r) => result.data);
        if (result.data.next) {
          setView("View more...");
        } else {
          setReplyAvailable(false);
        }
        console.log("getReply results", result.data.results);
        setReplyLength(null);
        if (replyData.length > 0 && next) {
          let pp = [...replyData, ...result.data.results];
          setReplyData((r) => pp);
        } else {
          setReplyData((r) => result.data.results);
        }
      }
    };
    const SendReply = async (comment_id, who, e = null) => {
      console.log("eeeeee::::", e);
      let placeholderText = "replying to " + who + " ...";
      //   e.target.style.background = "red";
      e.target.style.color = "#ec0313";
      //   e.target.parentElement.style.background = "#ec0313";
      dispatch({
        type: commentInputSetterAction,
        payload: {
          placeholder: placeholderText,
          comment_id: comment_id,
          postComment: postComment,
          type: "comment-reply",
        },
      });
      setTimeout(() => {
        e.target.style.color = "burlywood";
      }, 10000);
    };
    const SendCommentLike = async (comment_id) => {
      setIsLiked(!isLiked);
      let data = { post_id: props.post_id, comment_id: comment_id };

      const token = await getToken();
      const result = await axiosHandler({
        method: "post",
        url: COMMENT_LIKE_URL,
        token,
        data: data,
      }).catch((e) => {
        console.log("sendcommentLike error::::", e.response.data);
        //     setLoading(false)
      });

      if (result) {
        console.log("sendcommentLike results", result.data);
        if (result.data.data === "success-added") {
          setIsLiked(true);
          setLikeLength(likeLength + 1);
        } else if (result.data.data === "success-removed") {
          setIsLiked(false);
          setLikeLength(likeLength - 1);
        } else {
          console.log("needs checking");
        }
      }
    };

    const handleDelete = async (comment_id) => {
      const token = await getToken();
      const data = { author_id: userDetail.user.id, comment_id: comment_id };
      const res = await axiosHandler({
        method: "DELETE",
        url: COMMENT_URL + comment_id + "/",
        data,
        token,
      }).catch((e) => {
        console.log("Error in Delete Comment::::", e);
        alert("There was an error");
      });

      if (res) {
        console.log(" Delete comment response::::", res.data);
        if (res.data.data === "delete-successful") {
          dispatch({ type: deleteCommentAction, payload: comment_id });
        } else {
          console.log("needs checking");
        }
      }
    };

    let link;
    if (props.data) {
      if (userDetail.user.username === props.data.author.username) {
        link = `/my-profile/`;
      } else {
        link = `/other-profile/` + props.data.author.username;
      }
    }

    return (
      <div className="comment">
        <div className="comment-avatar">
          <Link to={link}>
            <img
              src={
                LOCAL_CHECK
                  ? props.data.author.user_picture
                  : props.data.author.user_picture_url
              }
              alt="author avatar"
            ></img>
          </Link>
        </div>
        <div className="comment-user-data">
          <Link to={link}>
            <div className="username">{props.data.author.username}</div>
          </Link>
          <div className="comment-greply">
            <div className="comment-text">
              <div className="comment-span" id={props.data.id}>
                {comment}{" "}
                <span className="comment-ago">
                  {" "}
                  {moment(props.data.created_at).fromNow(true)}
                </span>
              </div>
            </div>
            <div className="greply">
              {isLiked ? (
                <span
                  className="replycont"
                  onClick={(e) => SendCommentLike(props.data.id)}
                >
                  <i className="fas fa-heart"></i>
                  <span className="reply-like-num">
                    {likeLength > 0 ? likeLength : null}
                  </span>
                </span>
              ) : (
                <span
                  className="replytag"
                  onClick={(e) => SendCommentLike(props.data.id)}
                >
                  <i className="far fa-heart"></i>
                  <span className="reply-like-num">
                    {likeLength > 0 ? likeLength : null}
                  </span>
                </span>
              )}

              <span
                className="replytag"
                onClick={(e) =>
                  SendReply(props.data.id, props.data.author.username, e)
                }
              >
                reply
              </span>
              {props.data.author.username === userDetail.user.username ? (
                <span
                  className="replytag"
                  onClick={(e) => handleDelete(props.data.id)}
                >
                  <i className="fas fa-trash" style={{ color: "black" }}></i>
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          {replyData &&
            replyData.map((item, key) => {
              return <NewReply key={key} data={item} />;
            })}
          {replyAvailable && (
            <div
              className="ravail"
              onClick={(e) => getReply(e, props.data.id, true)}
            >
              {view} {replyLength && <>({replyLength}) </>}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="comment">
        <div className="user-avatar">
          <img alt="author avatar"></img>
        </div>
        <div className="comment-user-data">
          <div className="username"></div>
          <div className="comment-greply">
            <div className="comment-text">Loading...</div>
          </div>
        </div>
      </div>
    );
  }
};

export default NewComCard;
