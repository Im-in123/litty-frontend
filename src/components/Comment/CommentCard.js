import React, { useState, useContext, useEffect } from "react";
import "./comment.css";
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
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
  bogusTriggerAction,
  deleteCommentAction,
  newReplyReplyAction,
  deleteReplyAction,
} from "../../stateManagement/actions";
import Reply from "./Reply";

const CommentCard = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  console.log("commentCard props::::", props);
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
      if (pid === commentTrigger.postcomment) {
        setReplyData([...replyData, commentTrigger]);
        props.setCommentCount(props.commentCount + 1);

        dispatch({ type: CommentTriggerAction, payload: false });
      }
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
    if (postComment === props.post_id) {
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
    }
    return () => {};
  }, [delReply]);

  if (props.data) {
    console.log("commentCard props.data:::", props.data);
    // setPid(props.data.id);
    console.log("456789765434567::111::", props.replyList);

    let comment = props.data.comment;
    let replies = props.data.reply;
    // let replyAvailable = false;
    // let replyLength;
    // let view = "view replies";

    // if (replies.length > 0) {
    //   replyAvailable = true;
    //   replyLength = replies.length;
    //   if (replyLength < 2) {
    //     view = "view reply";
    //   }
    // }
    console.log("commentCard replies:::", replies);

    const getReply = async (e, comment_id) => {
      e.preventDefault();
      // setReplyData({...replyData, post_id:props.post_id, comment_id:comment_id})
      console.log("reply data::::", replyData);
      //     console.log("postcomment:::", postComment)
      let data = { post_id: props.post_id, comment_id: comment_id };
      console.log("reply data1:::", data);
      // setLoading(true)
      let post_id = props.post_id;
      const token = await getToken();
      const result = await axiosHandler({
        method: "get",
        url: REPLY_URL + `?post_id=${props.post_id}&comment_id=${comment_id}`,
        token,
        data: data,
      }).catch((e) => {
        console.log("getReply error::::", e.response.data);
        //     setLoading(false)
      });

      if (result) {
        console.log("getReply results", result.data.results);
        setView("View more...");
        setReplyLength(null);

        setReplyData(result.data.results);
      }
    };

    const SendReply = async (comment_id, who) => {
      let placeholder = document.getElementById("placeholder" + postComment);
      let placeholderText = "replying to " + who + " ...";

      dispatch({
        type: bogusTriggerAction,
        payload: {
          placeholder: placeholderText,
          comment_id: comment_id,
          postComment: postComment,
          type: "comment-reply",
        },
      });
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
        method: "POST",
        url: COMMENT_DELETE_URL,
        data,
        token,
      }).catch((e) => {
        console.log("Error in Delete COmment::::", e);
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

    return (
      <div className="comment">
        <div className="comment-avatar">
          <img
            src={
              LOCAL_CHECK
                ? props.data.author.user_picture
                : props.data.author.user_picture_url
            }
            alt="author avatar"
          ></img>
        </div>
        <div className="comment-user-data">
          <div className="username">{props.data.author.username}</div>
          <div className="comment-greply">
            <div className="comment-text">
              <div className="comment-span" id={props.data.id}>
                {comment}
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
                  SendReply(props.data.id, props.data.author.username)
                }
              >
                reply
              </span>
              {props.data.author.username === userDetail.user.username ? (
                <span
                  className="replytag"
                  onClick={(e) => handleDelete(props.data.id)}
                >
                  <i class="fas fa-trash" style={{ color: "black" }}></i>
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          {replyData &&
            replyData.map((item, key) => {
              return <Reply key={key} data={item} />;
            })}
          {replyAvailable && (
            <div className="ravail" onClick={(e) => getReply(e, props.data.id)}>
              {view} {replyLength && <>({replyLength} ) </>}
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

export default CommentCard;
