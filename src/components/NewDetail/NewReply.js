import React, { useState, useContext, useEffect } from "react";

import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import { LOCAL_CHECK, REPLY_URL, REPLY_LIKE_URL } from "../../urls";
import {
  commentInputSetterAction,
  deleteReplyAction,
} from "../../stateManagement/actions";
import { Link } from "react-router-dom";
import moment from "moment";

const NewReply = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const {
    state: { postComment },
  } = useContext(store);

  const [isLiked, setIsLiked] = useState(false);
  const [likeLength, setLikeLength] = useState(false);

  useEffect(() => {
    if (props.data) {
      CheckLike(props.data.like);
    }
  }, []);
  const CheckLike = (like) => {
    try {
      for (var i in like) {
        if (like[i] === userDetail.user.id) {
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
  const SendReplyTo = async (reply_id, who, parent_id) => {
    let placeholderText = "replying to " + who + " ...";

    dispatch({
      type: commentInputSetterAction,
      payload: {
        placeholder: placeholderText,
        reply_id: reply_id,
        postComment: postComment,
        type: "reply-reply",
        parent_id: parent_id,
      },
    });
  };

  const SendReplyLike = async (reply_id, parent_id) => {
    setIsLiked(!isLiked);
    let data = { parent_id: parent_id, reply_id: reply_id };

    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: REPLY_LIKE_URL,
      token,
      data: data,
    }).catch((e) => {
      console.log("sendreplyLike error::::", e.response.data);
    });

    if (result) {
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

  const handleReplyDelete = async (reply_id) => {
    const token = await getToken();
    const data = { author_id: userDetail.user.id, reply_id: reply_id };
    const res = await axiosHandler({
      method: "DELETE",
      url: REPLY_URL + reply_id + "/",
      data,
      token,
    }).catch((e) => {
      console.log("Error in Delete Reply::::", e);
      alert("There was an error");
    });

    if (res) {
      if (res.data.data === "delete-successful") {
        dispatch({ type: deleteReplyAction, payload: reply_id });
      } else {
        console.log("needs checking");
      }
    }
  };
  if (props.data) {
    let reply = props.data;
    if (!reply.author) return <></>;
    let link;
    let link2;
    if (userDetail.user.username === reply.author.username) {
      link = `/my-profile/`;
    } else {
      link = `/other-profile/` + reply.author.username;
    }
    if (reply.to) {
      if (userDetail.user.username === reply.to.author.username) {
        link2 = `/my-profile/`;
      } else {
        link2 = `/other-profile/` + reply.to.author.username;
      }
    }

    return (
      <>
        <div className="comment" key={reply.id}>
          {!reply.to ? (
            <>
              <div className="comment-avatar">
                <Link to={link}>
                  <img
                    src={
                      LOCAL_CHECK
                        ? reply.author.user_picture
                        : reply.author.user_picture_url
                    }
                    alt=""
                  ></img>
                </Link>
              </div>
              <div className="comment-user-data">
                <div className="username" style={{ fontSize: "0.8rem" }}>
                  <Link to={link}>{reply.author.username}</Link>
                </div>
                <div className="comment-greply">
                  <div className="comment-text">
                    <div className="comment-span" id={props.data.id}>
                      {reply.comment}{" "}
                      <span className="comment-ago">
                        {" "}
                        {moment(reply.created_at).fromNow(true)}
                      </span>
                    </div>
                  </div>
                  <div className="greply">
                    {isLiked ? (
                      <span
                        className="replycont"
                        onClick={(e) =>
                          SendReplyLike(props.data.id, reply.postcomment)
                        }
                      >
                        <i className="fas fa-heart"></i>{" "}
                        <span className="reply-like-num">
                          {likeLength > 0 ? likeLength : null}
                        </span>
                      </span>
                    ) : (
                      <span
                        className="replytag"
                        onClick={(e) =>
                          SendReplyLike(props.data.id, reply.postcomment)
                        }
                      >
                        <i className="far fa-heart"></i>{" "}
                        <span className="reply-like-num">
                          {likeLength > 0 ? likeLength : null}
                        </span>
                      </span>
                    )}

                    <span
                      className="replytag"
                      onClick={(e) =>
                        SendReplyTo(
                          reply.id,
                          reply.author.username,
                          reply.postcomment
                        )
                      }
                    >
                      reply
                    </span>
                    {props.data.author.username === userDetail.user.username ? (
                      <span
                        className="replytag"
                        onClick={(e) => handleReplyDelete(reply.id)}
                      >
                        <i
                          className="fas fa-trash"
                          style={{ color: "black" }}
                        ></i>
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="comment-avatar">
                <Link to={link}>
                  <img
                    src={
                      LOCAL_CHECK
                        ? reply.author.user_picture
                        : reply.author.user_picture_url
                    }
                    alt=""
                  ></img>
                </Link>
              </div>
              <div className="comment-user-data">
                <div className="username" style={{ fontSize: "0.8rem" }}>
                  <Link to={link}>{reply.author.username}</Link>
                </div>
                <div className="comment-greply">
                  <div className="comment-text">
                    <div className="comment-span" id={props.data.id}>
                      <span className="repto"> replied to</span>
                      <span className="reply-username">
                        <Link to={link2}>{reply.to.author.username}</Link>
                      </span>
                      <span> : {reply.comment}</span>{" "}
                      <span className="comment-ago">
                        {" "}
                        {moment(reply.created_at).fromNow(true)}
                      </span>
                    </div>
                  </div>
                  <div className="greply">
                    {isLiked ? (
                      <span
                        className="replycont"
                        onClick={(e) =>
                          SendReplyLike(props.data.id, reply.postcomment)
                        }
                      >
                        <i className="fas fa-heart"></i>
                      </span>
                    ) : (
                      <span
                        className="replytag"
                        onClick={(e) =>
                          SendReplyLike(props.data.id, reply.postcomment)
                        }
                      >
                        <i className="far fa-heart"></i>
                      </span>
                    )}

                    <span className="reply-like-num">
                      {likeLength > 0 ? likeLength : null}
                    </span>
                    <span
                      className="replytag"
                      onClick={(e) =>
                        SendReplyTo(
                          reply.id,
                          reply.author.username,
                          reply.postcomment
                        )
                      }
                    >
                      reply
                    </span>
                    {props.data.author.username === userDetail.user.username ? (
                      <span
                        className="replytag"
                        onClick={(e) => handleReplyDelete(reply.id)}
                      >
                        <i
                          className="fas fa-trash"
                          style={{ color: "black" }}
                        ></i>
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  } else {
    return <></>;
  }
};
export default NewReply;
