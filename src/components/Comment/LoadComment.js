import React, { useState, useContext, useEffect } from "react";
import "./comment.css";
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import { UrlParser } from "../../customs/others";
import {
  BASE_URL,
  BASE_URL1,
  COMMENT_URL,
  LOCAL_CHECK,
  REPLY_URL,
} from "../../urls";
import {
  CommentTriggerAction,
  deleteCommentAction,
} from "../../stateManagement/actions";

import CommentCard from "./CommentCard";
import CommentComp from "./CommentComp";

const LoadComment = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const {
    state: { delComment },
  } = useContext(store);
  const {
    state: { delReply },
  } = useContext(store);
  const {
    state: { postComment },
  } = useContext(store);
  const {
    state: { commentTrigger },
  } = useContext(store);

  const {
    state: { bogus },
  } = useContext(store);

  const [render, setRender] = useState(false);

  const [commentList, setCommentList] = useState([]);
  const [nextMsgs, setNextMsgs] = useState([]);

  const [currentComment, setCurrentComment] = useState([]);
  const [error, setError] = useState(false);

  const [loader, setLoader] = useState([]);
  const [moreCmts, setMoreCmts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // let nextMsgs = [];

  useEffect(() => {
    if (postComment === props.post_id) {
      getComments(1);
    } else {
      setRender(false);
    }
    return () => {};
  }, [postComment, commentTrigger]);

  useEffect(() => {
    if (postComment === props.post_id) {
      console.log("currentComment:::", currentComment);
      if (currentComment) {
        setCommentList([...commentList, currentComment]);
        scrollToBottom(postComment);
        props.setCommentCount(props.commentCount + 1);
        setCurrentComment(false);
      }
    }
    return () => {};
  }, [currentComment]);

  const scrollToBottom = (p) => {
    setTimeout(() => {
      try {
        let chatArea = document.getElementById("contenta" + p);
        chatArea.scrollTop = chatArea.scrollHeight;
      } catch (error) {
        console.log("scrolltobottom error:::currentcomment");
      }
    }, 300);
  };

  useEffect(() => {
    if (postComment === props.post_id) {
      if (delComment) {
        let filtered = [];
        for (let i in commentList) {
          let f = commentList[i];

          if (f.id !== delComment) {
            filtered = [...filtered, f];
          }
        }
        setCommentList(filtered);
        props.setCommentCount(props.commentCount - 1);

        dispatch({ type: deleteCommentAction, payload: null });
      }
    }
    return () => {};
  }, [delComment]);

  const getComments = async (page = null, next = false) => {
    setLoadingMore(true);
    setError(false);
    let url;
    if (!page) {
      url = COMMENT_URL + `?post_id=${props.post_id}`;
    } else {
      url = COMMENT_URL + `?post_id=${props.post_id}`;
    }
    if (next) {
      url = nextMsgs.next;
      console.log("nextMsgs:::", nextMsgs);
    } else {
    }
    const token = await getToken();
    const result = await axiosHandler({
      method: "get",
      url: url,
      token,
    }).catch((e) => {
      console.log("getComments error::::", e);
      setError(true);
    });

    if (result) {
      setNextMsgs((n) => result.data);
      console.log("getComments data::::", result.data);

      console.log("getComments results::::", result.data.results);
      if (result.data.next) {
        setMoreCmts(true);
      } else {
        setMoreCmts(false);
      }
      if (commentList.length > 0 && next) {
        setCommentList((cm) => [...cm, ...result.data.results]);
      } else {
        setCommentList((cm) => result.data.results);
      }
      setRender(true);
      setLoadingMore(false);
    }
  };

  return (
    <>
      {render ? (
        <>
          {error ? (
            "An error occured, reload comment!"
          ) : (
            <div className="contenta" id={"contenta" + props.post_id}>
              {commentList.map((item, key) => {
                return (
                  <>
                    <CommentCard
                      post_id={props.post_id}
                      key={key}
                      data={item}
                      setCommentCount={props.setCommentCount}
                      commentCount={props.commentCount}
                    />
                  </>
                );
              })}
              {moreCmts && (
                <>
                  <div className="loadcoms">
                    {loadingMore ? (
                      <span>loading more...</span>
                    ) : (
                      <span onClick={() => getComments(null, true)}>
                        load more
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <CommentComp
            post_id={props.id}
            author_id={userDetail.user.id}
            setCurrentComment={setCurrentComment}
          />
        </>
      ) : (
        <>
          <div className="contenta" id={"append" + props.post_id}>
            <CommentCard
              setCommentCount={props.setCommentCount}
              commentCount={props.commentCount}
            />
          </div>
          <CommentComp
            post_id={props.id}
            author_id={userDetail.user.id}
            setCurrentComment={setCurrentComment}
          />
        </>
      )}
    </>
  );
};

export default LoadComment;
