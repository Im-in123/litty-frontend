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
  const [fetching, setFetching] = useState(true);

  const [commentList, setCommentList] = useState([]);

  const [currentComment, setCurrentComment] = useState([]);

  const [loader, setLoader] = useState([]);

  // const [replyData, setReplyData] = useState([]);

  useEffect(() => {
    if (postComment === props.post_id) {
      //  alert("postcomment",postComment)
      // alert("post_id", props.post_id)

      getComments();
    } else {
      setFetching(false);
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
    try {
      setTimeout(() => {
        let chatArea = document.getElementById("contenta" + p);
        chatArea.scrollTop = chatArea.scrollHeight;
      }, 300);
    } catch (error) {
      console.log("scrolltobottom error:::currentcomment");
    }
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

  const getComments = async () => {
    setFetching(true);

    const token = await getToken();
    const result = await axiosHandler({
      method: "get",
      url: COMMENT_URL + `?post_id=${props.post_id}`,
      token,
    }).catch((e) => {
      console.log("getComments error::::", e.response.data);
    });

    if (result) {
      console.log("getComments results::::", result.data.results);
      setCommentList(result.data.results);
      setFetching(false);
      setRender(true);
    }
  };

  return (
    <>
      {render ? (
        <>
          <div class="contenta" id={"contenta" + props.post_id}>
            {commentList.map((item, key) => {
              return (
                <CommentCard
                  post_id={props.post_id}
                  key={key}
                  data={item}
                  setCommentCount={props.setCommentCount}
                  commentCount={props.commentCount}
                  //   replyList={currentReply}
                />
              );
            })}
          </div>
          <CommentComp
            post_id={props.id}
            author_id={userDetail.user.id}
            setCurrentComment={setCurrentComment}
          />
        </>
      ) : (
        <>
          <div class="contenta" id={"append" + props.post_id}>
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
