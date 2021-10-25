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
} from "../../urls";
import {
  CommentTriggerAction,
  bogusTriggerAction,
  newReplyReplyAction,
} from "../../stateManagement/actions";
const CommentComp = (props) => {
  //     console.log("CommentComp props::::", props)
  //     const [commentData, setCommentData] = useState({post_id:props.post_id, author_id:props.author_id})
  const [commentData, setCommentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("Write you comment here...");
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
    state: { bogus },
  } = useContext(store);
  let pcont = "";

  useEffect(() => {
    // if(postComment===props.post_id){

    try {
      setPlaceholder(bogus.placeholder);
      pcont = document.getElementById("placeholder" + bogus.postComment);
      // pcont.style.background="yellow"
      // dispatch({type:bogusTriggerAction,payload:null})
    } catch (error) {
      // console.log(error)
      setPlaceholder("Write you comment here...");
    }
    // }
  }, [bogus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let bb;
    const token = await getToken();
    try {
      bb = bogus.postComment;
    } catch (error) {
      bb = false;
    }
    if (bb) {
      if (bogus.type === "comment-reply") {
        const rdata = {
          to_id: "null",
          comment_id: bogus.comment_id,
          comment: commentData.comment,
          author_id: props.author_id,
          type: bogus.type,
        };
        console.log("replycomment before send::::", rdata);
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
          console.log("CommentPost results", replyResult.data);
          setLoading(false);
          // props.setCurrentReply(replyResult.data);

          dispatch({ type: bogusTriggerAction, payload: null });

          dispatch({ type: CommentTriggerAction, payload: replyResult.data });
          setCommentData({ post_id: props.id });
        }
      } else if (bogus.type === "reply-reply") {
        const rrdata = {
          reply_id: bogus.reply_id,
          to_id: bogus.reply_id,
          comment: commentData.comment,
          author_id: props.author_id,
          parent_id: bogus.parent_id,
          type: bogus.type,
        };
        console.log("reply-reply before send::::", rrdata);
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
          console.log("reply-reply results", replyReplyResult.data);
          //   props.setCurrentReplyReply(replyReplyResult.data);
          dispatch({ type: bogusTriggerAction, payload: null });

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
      console.log("comment data::::", commentData);
      //     console.log("postcomment:::", postComment)
      let data = {
        ...commentData,
        post_id: postComment,
        author_id: props.author_id,
      };
      console.log("comment data1:::", data);
      const result = await axiosHandler({
        method: "post",
        url: COMMENT_URL,
        token,
        data: data,
      }).catch((e) => {
        alert("An error occured,counldn't post comment, try agian!");
        console.log("CommentPost error::::", e.response.data);
        setLoading(false);
      });

      if (result) {
        console.log("CommentPost results", result.data);
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
          alt="user avatar"
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
        <button
          className="submit-button"
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "submiting.." : ""}
        </button>
      </form>
    </div>
  );
};

export default CommentComp;
