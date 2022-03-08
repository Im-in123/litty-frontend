import React, { useState, useContext, useEffect } from "react";
import "./comment.css";
import { store } from "../../stateManagement/store";

import { commentInputSetterAction } from "../../stateManagement/actions";
import LoadComment from "./LoadComment";

const Comment = (props) => {
  const {
    state: { userDetail },
    dispatch,
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
                <a
                  className="close"
                  onClick={() => {
                    document.documentElement.style.overflow = "auto";

                    dispatch({ type: commentInputSetterAction, payload: null });
                  }}
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
