import React, { useState, useContext, useEffect } from "react";
import "./comment.css";
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import { UrlParser, uuidv4 } from "../../customs/others";
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
        <div id={"popup1" + props.id} className="overlay">
          <div className="popup">
            <div className="popup-inner">
              <div>
                {" "}
                <h2>Comment</h2>
              </div>
              <div className="close-reload">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enable-background="new 0 0 24 24"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                  className="svg-reload"
                  onClick={() =>
                    dispatch({ type: CommentTriggerAction, payload: uuidv4() })
                  }
                >
                  <g>
                    <rect fill="none" height="24" width="24" />
                    <rect fill="none" height="24" width="24" />
                    <rect fill="none" height="24" width="24" />
                  </g>
                  <g>
                    <g />
                    <path d="M12,5V1L7,6l5,5V7c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6H4c0,4.42,3.58,8,8,8s8-3.58,8-8S16.42,5,12,5z" />
                  </g>
                </svg>
                <a
                  className="close"
                  onClick={() =>
                    dispatch({ type: bogusTriggerAction, payload: null })
                  }
                  href="##"
                >
                  &times;
                </a>
              </div>
            </div>
            <LoadComment
              post_id={props.id}
              setCommentCount={props.setCommentCount}
              commentCount={props.commentCount}
            />
          </div>
        </div>{" "}
      </>
    );
  }
  return (
    <>
      <div id="popup1" className="overlay">
        <div className="popup">
          <h2>...</h2>
          <a className="close" href="##">
            &times;
          </a>
        </div>
      </div>{" "}
    </>
  );
};
export default Comment;
