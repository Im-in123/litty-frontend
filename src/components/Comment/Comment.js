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
  deleteCommentAction,
  newReplyAction,
} from "../../stateManagement/actions";
import { render } from "react-dom/cjs/react-dom.development";
import LoadComment from "./LoadComment";

const Comment = (props) => {
  // console.log("Comment props:::", props)
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const {
    state: { commentTrigger },
  } = useContext(store);
  const {
    state: { postComment },
  } = useContext(store);

  useEffect(() => {
    return () => {};
  }, [postComment]);

  if (props) {
    return (
      <>
        <div id={"popup1" + props.id} class="overlay">
          <div class="popup">
            <h2>Comment</h2>
            <a
              class="close"
              onClick={() =>
                dispatch({ type: bogusTriggerAction, payload: null })
              }
              href="##"
            >
              &times;
            </a>

            <LoadComment
              post_id={props.id}
              setCommentCount={props.setCommentCount}
              commentCount={props.commentCount}
            />

            {/* <CommentComp post_id={props.id} author_id={userDetail.user.id} /> */}
          </div>
        </div>{" "}
      </>
    );
  }
  return (
    <>
      <div id="popup1" class="overlay">
        <div class="popup">
          <h2>...</h2>
          <a
            class="close"
            href="##"
            onClick={() => (document.body.style.color = "green")}
          >
            &times;
          </a>
          {/* <LoadComment post_id={props.id}/>
        
                <CommentComp post_id={props.id} author_id={userDetail.user.id} />
         */}
        </div>
      </div>{" "}
    </>
  );
};
export default Comment;
