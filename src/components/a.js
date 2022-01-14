import React, { useState, useContext, useEffect } from "react";
import "./comment.css";
import { store } from "../stateManagement/store";
import { axiosHandler, getToken } from "../helper";
import { UrlParser } from "../customs/others";
import {
  BASE_URL,
  BASE_URL1,
  COMMENT_URL,
  LOCAL_CHECK,
  REPLY_URL,
} from "../urls";
import {
  CommentTriggerAction,
  bogusTriggerAction,
  deleteCommentAction,
  newReplyAction,
} from "../stateManagement/actions";
import { render } from "react-dom/cjs/react-dom.development";

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
    maincomment();

    return () => {};
  }, [postComment]);

  const maincomment = () => {};

  if (props) {
    return (
      <>
        <div id={"popup1" + props.id} className="overlay">
          <div className="popup">
            <h2>Comment</h2>
            <a
              className="close"
              onClick={() =>
                dispatch({ type: bogusTriggerAction, payload: null })
              }
              href="##"
            >
              &times;
            </a>
            <LoadComment post_id={props.id} />

            <CommentComp post_id={props.id} author_id={userDetail.user.id} />
          </div>
        </div>{" "}
      </>
    );
  }
  return (
    <>
      <div id="popup1" className="overlay">
        <div className="popup">
          <h2>Here i am</h2>
          <a
            className="close"
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
    //         //  alert("postcomment",postComment)
    //         // alert("post_id", props.post_id)
    //         getComments()
    //         // document.body.style.overflow = 'hidden';
    // }else{
    //         setFetching(false)
    //         setRender(false)
    // }
  }, [postComment]);

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
          setCommentData({ post_id: props.id });
          alert("comment reply submitted");
          let container = document.querySelector(
            "#appendrep" + replyResult.data.postcomment
          );
          container.style.display = "flex";
          //  dispatch({type:deleteCommentAction,payload:"heya"});
          let comment = document.querySelector(
            "#appendrep_comment" + replyResult.data.postcomment
          );
          let username = document.querySelector(
            "#appendrep_username" + replyResult.data.postcomment
          );
          let img = document.querySelector(
            "#appendrep_img" + replyResult.data.postcomment
          );
          img.src = BASE_URL1 + replyResult.data.author.user_picture;
          comment.innerHTML = replyResult.data.comment;
          username.innerHTML = replyResult.data.author.username;
          dispatch({ type: bogusTriggerAction, payload: null });

          //  dispatch({type:CommentTriggerAction,payload:replyResult.data});
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
        const replyResult = await axiosHandler({
          method: "post",
          url: REPLY_URL,
          token,
          data: rrdata,
        }).catch((e) => {
          console.log("CommentReplyPost error::::", e.response.data);
          setLoading(false);
        });
        if (replyResult) {
          console.log("reply-reply results", replyResult.data);
          setLoading(false);
          setCommentData({ post_id: props.id });
          alert("reply to reply submitted");
          let container = document.querySelector(
            "#appendreprep" + replyResult.data.postcomment
          );
          container.style.display = "flex";
          //  dispatch({type:deleteCommentAction,payload:"heya"});
          let comment = document.querySelector(
            "#appendreprep_comment" + replyResult.data.postcomment
          );
          let username = document.querySelector(
            "#appendreprep_username" + replyResult.data.postcomment
          );
          let to_username = document.querySelector(
            "#appendreprep_to_username" + replyResult.data.postcomment
          );
          let img = document.querySelector(
            "#appendreprep_img" + replyResult.data.postcomment
          );
          img.src = LOCAL_CHECK
            ? BASE_URL1 + replyResult.data.author.user_picture
            : replyResult.data.author.user_picture_url;
          comment.innerHTML = ": " + replyResult.data.comment;
          username.innerHTML = replyResult.data.author.username;
          to_username.innerHTML = replyResult.data.to.author.username;
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
        setCommentData({ post_id: props.id });

        // alert("comment submitted");
        let container = document.querySelector("#appendcom" + postComment);
        container.style.display = "flex";
        dispatch({ type: deleteCommentAction, payload: "heya" });
        let comment = document.querySelector(
          "#appendcom_comment" + postComment
        );
        let username = document.querySelector(
          "#appendcom_username" + postComment
        );
        let img = document.querySelector("#appendcom_img" + postComment);
        img.src = LOCAL_CHECK
          ? result.data.author.user_picture
          : result.data.author.user_picture_url;
        comment.innerHTML = result.data.comment;
        username.innerHTML = result.data.author.username;

        // dispatch({type:bogusTriggerAction,payload:null})

        // dispatch({type:CommentTriggerAction,payload:result.data});
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
          {" "}
          {loading ? "submiting.." : ""}
        </button>
      </form>
    </div>
  );
};

const LoadComment = (props) => {
  const [render, setRender] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [commentList, setCommentList] = useState([]);
  const [loader, setLoader] = useState([]);

  const {
    state: { postComment },
    dispatch,
  } = useContext(store);
  const {
    state: { commentTrigger },
  } = useContext(store);
  const {
    state: { newComment },
  } = useContext(store);
  const {
    state: { bogus },
  } = useContext(store);

  useEffect(() => {
    if (postComment === props.post_id) {
      //  alert("postcomment",postComment)
      // alert("post_id", props.post_id)
      try {
        console.log("newComment:::", newComment);
      } catch (error) {
        console.log("errrrr:::errrr");
      }
      getComments();

      // document.body.style.overflow = 'hidden';
    } else {
      setFetching(false);
      setRender(false);
    }
    return () => {};
  }, [postComment, commentTrigger]);

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

  if (fetching) {
    return (
      <>
        <div className="contenta" id={"append" + props.post_id}>
          <CommentCard />
        </div>
      </>
    );
  }

  return (
    <>
      {render ? (
        <>
          <div className="contenta">
            <div
              className="comment"
              id={"appendcom" + props.post_id}
              style={{ display: "none" }}
            >
              <div className="comment-avatar">
                <img src="" alt="" id={"appendcom_img" + props.post_id}></img>
              </div>
              <div className="comment-user-data">
                <div
                  className="username"
                  id={"appendcom_username" + props.post_id}
                ></div>

                <div className="comment-text">
                  <span
                    className="comment-span"
                    id={"appendcom_comment" + props.post_id}
                  ></span>
                  <span className="replytag"></span>
                </div>
              </div>
            </div>

            {commentList.map((item, key) => {
              return (
                <CommentCard post_id={props.post_id} key={key} data={item} />
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="contenta" id={"append" + props.post_id}>
            <CommentCard />
          </div>
        </>
      )}
    </>
  );
};

const CommentCard = (props) => {
  const [tt, setTt] = useState(true);
  const [replyData, setReplyData] = useState(false);
  const {
    state: { postComment },
    dispatch,
  } = useContext(store);
  const {
    state: { newComment },
  } = useContext(store);
  const {
    state: { newReply },
  } = useContext(store);
  const [newReplyData, setNewReplyData] = useState(false);
  const [temp, setTemp] = useState([]);

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
      setReplyData(result.data.results);
    }
  };
  const SendReply = async (comment_id, who) => {
    let placeholder = document.getElementById("placeholder" + postComment);
    // console.log("placeholder:::", placeholder)
    let placeholderText = "replying to " + who + " ...";
    // console.log("placeholderText:::", placeholderText)
    // placeholder.placeholder=placeholderText;
    // placeholder.textContent=placeholderText
    // placeholder.style.color="yellow";
    // placeholder.innerHTML= placeholderText
    // setReplyData({...replyData, post_id:props.post_id, comment_id:comment_id})
    console.log("sendreply data::::", replyData);
    //     console.log("postcomment:::", postComment)
    let data = { post_id: props.post_id, comment_id: comment_id };
    console.log("send reply data1:::", data);
    // setLoading(true)
    const token = await getToken();
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
  if (props.data) {
    let comment = props.data.comment;
    let replies = props.data.reply;
    let replyAvailable = false;
    let replyLength;
    let view = "view replies";
    if (replies.length > 0) {
      replyAvailable = true;
      replyLength = replies.length;
      if (replyLength < 2) {
        view = "view reply";
      }
    }
    console.log("replies:::", replies);
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
          <div className="comment-text">
            <span className="comment-span" id={props.data.id}>
              {comment}
            </span>
            <span
              className="replytag"
              onClick={(e) =>
                SendReply(props.data.id, props.data.author.username)
              }
            >
              reply
            </span>

            <div
              className="comment"
              style={{ display: "none" }}
              id={"appendrep" + props.data.id}
            >
              <div className="comment-avatar">
                <img src="" alt="" id={"appendrep_img" + props.data.id}></img>
              </div>
              <div className="comment-user-data">
                <div
                  className="username"
                  style={{ fontSize: "0.8rem" }}
                  id={"appendrep_username" + props.data.id}
                ></div>
                <div className="comment-text">
                  <span
                    className="comment-span"
                    id={"appendrep_comment" + props.data.id}
                  ></span>
                  <span className="replytag"></span>
                </div>
              </div>
            </div>

            {replyData &&
              replyData.map((item, key) => {
                return <Reply key={key} data={item} />;
              })}
            <div
              id={"appendreprep" + props.data.id}
              style={{ display: "none", paddingLeft: "5px" }}
            >
              <div className="comment-avatar">
                <img
                  src=""
                  alt=""
                  id={"appendreprep_img" + props.data.id}
                ></img>
              </div>{" "}
              &nbsp;
              <p>
                <span
                  className="reply-username"
                  id={"appendreprep_username" + props.data.id}
                >
                  a
                </span>
                <span className="repto"> &nbsp; replied</span>
                <span
                  className="reply-username"
                  id={"appendreprep_to_username" + props.data.id}
                >
                  b
                </span>
                <span
                  className="reply-comment"
                  id={"appendreprep_comment" + props.data.id}
                >
                  heya
                </span>
              </p>{" "}
            </div>
            {replyAvailable && (
              <p
                className="comment-rtext"
                onClick={(e) => getReply(e, props.data.id)}
              >
                {" "}
                {view} ({replyLength && replyLength})
              </p>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="comment">
        <div className="user-avatar">
          <img alt="author avatar"></img>
        </div>
        <div className="user-data">
          <div className="username"></div>

          <div className="comment-text">Loading...</div>
        </div>
      </div>
    );
  }
};

export default Comment;

const Reply = (props) => {
  const {
    state: { postComment },
    dispatch,
  } = useContext(store);

  const SendReplyTo = async (reply_id, who, parent_id) => {
    let placeholderText = "replying to " + who + " ...";

    console.log("sendreplyTo data::::", reply_id, who, parent_id);
    dispatch({
      type: bogusTriggerAction,
      payload: {
        placeholder: placeholderText,
        reply_id: reply_id,
        postComment: postComment,
        type: "reply-reply",
        parent_id: parent_id,
      },
    });
  };
  if (props.data) {
    console.log("Reply props::", props.data);
    let reply = props.data;
    return (
      <>
        <div className="comment" key={reply.id}>
          {" "}
          {!reply.to ? (
            <>
              <div className="comment-avatar">
                <img
                  src={
                    LOCAL_CHECK
                      ? reply.author.user_picture
                      : reply.author.user_picture_url
                  }
                  alt="author avatar"
                ></img>
              </div>
              <div className="comment-user-data">
                <div className="username" style={{ fontSize: "0.8rem" }}>
                  {reply.author.username}
                </div>
                <div className="comment-text">
                  <span className="comment-span" id={props.data.id}>
                    {reply.comment}
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
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="comment-avatar">
                <img
                  src={
                    LOCAL_CHECK
                      ? reply.author.user_picture
                      : reply.author.user_picture_url
                  }
                  alt="author avatar"
                ></img>
              </div>{" "}
              &nbsp;
              <p>
                <span className="reply-username">{reply.author.username}</span>
                <span className="repto"> &nbsp; replied</span>
                <span className="reply-username">{reply.author.username}</span>
                <span className="reply-comment">: {reply.comment}</span>
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
              </p>{" "}
            </>
          )}{" "}
        </div>
      </>
    );
  } else {
    return <></>;
  }
};
