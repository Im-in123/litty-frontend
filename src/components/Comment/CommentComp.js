import React, { useState, useContext, useEffect } from "react";
import "./comment.css";
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import { COMMENT_URL, LOCAL_CHECK, REPLY_URL } from "../../urls";
import {
  CommentTriggerAction,
  commentInputSetterAction,
  newReplyReplyAction,
} from "../../stateManagement/actions";
const CommentComp = (props) => {
  const [commentData, setCommentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("Write a comment ...");
  const [loading1, setLoading1] = useState(false);
  const {
    state: { commentTrigger },
    dispatch,
  } = useContext(store);
  const {
    state: { userDetail },
  } = useContext(store);

  const {
    state: { postComment },
  } = useContext(store);
  const {
    state: { commentInputSetter },
  } = useContext(store);
  let pcont = "";

  useEffect(() => {
    try {
      setPlaceholder(commentInputSetter.placeholder);
      pcont = document.getElementById(
        "placeholder" + commentInputSetter.postComment
      );
    } catch (error) {
      setPlaceholder("Write a comment ...");
    }
    // }
  }, [commentInputSetter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentData.comment) return;

    setLoading(true);
    let bb;
    const token = await getToken();
    try {
      bb = commentInputSetter.postComment;
    } catch (error) {
      bb = false;
    }
    if (bb) {
      if (commentInputSetter.type === "comment-reply") {
        const rdata = {
          to_id: "null",
          comment_id: commentInputSetter.comment_id,
          comment: commentData.comment,
          author_id: props.author_id,
          type: commentInputSetter.type,
        };
        const replyResult = await axiosHandler({
          method: "post",
          url: REPLY_URL,
          token,
          data: rdata,
        }).catch((e) => {
          console.log("CommentReplyPost error::::", e.response.data);
          setLoading(false);
        });
        if (replyResult) {
          setLoading(false);

          dispatch({ type: commentInputSetterAction, payload: null });

          dispatch({ type: CommentTriggerAction, payload: replyResult.data });
          setCommentData({ post_id: props.id });
        }
      } else if (commentInputSetter.type === "reply-reply") {
        const rrdata = {
          reply_id: commentInputSetter.reply_id,
          to_id: commentInputSetter.reply_id,
          comment: commentData.comment,
          author_id: props.author_id,
          parent_id: commentInputSetter.parent_id,
          type: commentInputSetter.type,
        };
        const replyReplyResult = await axiosHandler({
          method: "post",
          url: REPLY_URL,
          token,
          data: rrdata,
        }).catch((e) => {
          console.log("CommentReplyreplyPost error::::", e.response.data);
          setLoading(false);
        });
        if (replyReplyResult) {
          dispatch({ type: commentInputSetterAction, payload: null });

          dispatch({
            type: newReplyReplyAction,
            payload: replyReplyResult.data,
          });
          setCommentData({ post_id: props.id });
          setLoading(false);
        }
      } else {
        alert("this error is critical!");
      }
    } else {
      setCommentData({
        ...commentData,
        post_id: postComment,
        author_id: props.author_id,
      });

      let data = {
        ...commentData,
        post_id: postComment,
        author_id: props.author_id,
      };
      const result = await axiosHandler({
        method: "post",
        url: COMMENT_URL,
        token,
        data: data,
      }).catch((e) => {
        alert("An error occured,counldn't post comment, try agian!");
        setLoading(false);
      });

      if (result) {
        setLoading(false);
        props.setCurrentComment(result.data);
        setCommentData({ post_id: props.id });
      }
    }
  };

  const onChange = (e) => {
    setCommentData({
      ...commentData,
      [e.target.name]: e.target.value,
    });
  };
  if (loading1) {
    return (
      <div className="comment-input">
        <div className="user-avatar">
          <img alt="user avatar"></img>
        </div>
        <form></form>
      </div>
    );
  }
  return (
    <div className="comment-input">
      <div className="comment-avatar">
        <img
          src={
            LOCAL_CHECK
              ? userDetail.profile_picture
              : userDetail.profile_picture_url
          }
          alt=""
        ></img>
      </div>
      <form>
        <input
          name="comment"
          type="text"
          maxLength="200"
          id={`placeholder${postComment}`}
          placeholder={placeholder}
          value={commentData.comment || ""}
          onChange={onChange}
          required
        />
        {loading ? (
          <div style={{ color: "black", fontWeight: "bold", fontSize: 13 }}>
            Submitting...
          </div>
        ) : (
          <button
            className="submit-button"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          ></button>
        )}
      </form>
    </div>
  );
};

export default CommentComp;
