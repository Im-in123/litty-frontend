import React, { useState, useEffect, useContext } from "react";
import { store } from "../stateManagement/store";
import { postCommentAction } from "../stateManagement/actions";
import Comment from "./Comment/Comment";
import { POST_LIKE_URL, SAVED_URL } from "../urls";
import { axiosHandler, getToken } from "../helper";
import { Link } from "react-router-dom";

const PostInfo = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);

  const [likesend, setLikeSend] = useState(false);
  const [plink, setPlink] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked1, setIsLiked1] = useState(false);
  const [commentCount, setCommentCount] = useState(props.comment_count);

  let changed = false;
  let likeCount;
  let likevalue;
  let like = props.like;
  let like_count = like.length;
  if (like_count === 0) {
    like_count = null;
  }
  let caption = props.caption;
  let author = props.author.username;
  let created_at = props.created_at;
  let tags = props.tags;
  let isliked = null;
  const [actiontype, setActiontype] = useState("unlike");
  useEffect(() => {
    return () => {};
  }, []);
  useEffect(() => {
    setprofilelink();
    try {
      for (var i in like) {
        let like1 = like[i];
        if (like1.user.username === userDetail.user.username) {
          isliked = like1.user.username;
          setActiontype("like");
          setIsLiked1(true);
          break;
        } else {
          isliked = null;
          setActiontype("unlike");
          setIsLiked1(false);
        }
      }
    } catch (error) {
      isliked = null;
      setActiontype("unlike");
    }

    //check to see if this post in posts saved by user
    for (var g in userDetail.saved) {
      if (userDetail.saved[g] === props.id) {
        setIsSaved(true);
      }
    }
    setCommentCount(props.comment_count);
  }, []);

  const setprofilelink = async () => {
    if (userDetail.user.username === props.author.username) {
      setPlink(`/my-profile/`);
    } else {
      setPlink(`/other-profile/` + props.author.username);
    }
  };

  const likeHandler = async (e) => {
    setIsLiked1(!isLiked1);

    if (!changed) {
      likeCount = document.querySelector("#likecount" + props.id);
      likevalue = likeCount.textContent;

      changed = true;
    }

    if (isLiked1) {
      if (likevalue === "") {
        likevalue = 0;
      }
      if (likevalue === 0) {
        console.log("");
      } else {
        likevalue = parseInt(likevalue) - 1;
      }
      if (likevalue === 0) {
        likevalue = null;
      }
      likeCount.textContent = likevalue;
    } else if (!isliked) {
      if (likevalue === "") {
        likevalue = 0;
      }
      likevalue = parseInt(likevalue) + 1;
      likeCount.textContent = likevalue;
    } else {
      alert("unknown actiontype:::", actiontype);
    }

    if (likesend) {
      console.log("like passed");
      return;
    }
    setLikeSend(true);
    let like_data = { post_id: props.id };
    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: POST_LIKE_URL,
      token,
      data: like_data,
    }).catch((e) => {
      console.log("SendLike error::::", e);
    });

    if (result) {
      console.log("SendLike results::::", result.data);
      let res = result.data;
      if (res.data === "success-added") {
        setIsLiked1(true);
      } else if (res.data === "success-removed") {
        setIsLiked1(false);
      } else {
        console.log("needs checking");
      }
    }

    setLikeSend(false);
  };

  const saveHandler = async (e) => {
    //Handler for adding and removing post from posts saved by user
    setIsSaved(!isSaved);

    let save_data = { post_id: props.id, user_id: userDetail.user.id };
    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: SAVED_URL,
      token,
      data: save_data,
    }).catch((e) => {
      console.log("Save error::::", e);
    });

    if (result) {
      let res = result.data;
      if (res.success === "added") {
        setIsSaved(true);
      }
      if (res.success === "removed") {
        setIsSaved(false);
      }
    }
  };

  return (
    <>
      <Comment
        id={props.id}
        setCommentCount={setCommentCount}
        commentCount={commentCount}
      />
      <div className="post-info">
        <div className="likes" onClick={(e) => likeHandler()}>
          <a onClick={(e) => e.preventDefault()}>
            <div className="icon">
              {isLiked1 ? (
                <i className="fas fa-heart icon-red"></i>
              ) : (
                <i className="fas fa-heart icon-white"></i>
              )}
            </div>
            <div id={"likecount" + props.id} className="count">
              {like_count && like_count}
            </div>
          </a>
        </div>

        <div className="comments" id="##">
          <a
            href={"#popup1" + props.id}
            onClick={() => {
              document.documentElement.style.overflow = "hidden";
              //set postcomment to post id
              dispatch({ type: postCommentAction, payload: props.id });
            }}
          >
            <div className="icon">
              <i className="fas fa-comment-alt"></i>
            </div>
            <div className="count">{commentCount}</div>
          </a>
        </div>
        <div className="save" id="##" onClick={(e) => saveHandler()}>
          <a onClick={(e) => e.preventDefault()}>
            {isSaved ? (
              <div className="icon1">
                <i class="fas fa-bookmark"></i>
              </div>
            ) : (
              <div className="icon2">
                {" "}
                <i class="far fa-bookmark"></i>
              </div>
            )}
          </a>
        </div>
      </div>

      <div className="caption">
        <p>
          <b>
            <Link to={plink}>{author} </Link>
          </b>{" "}
          {caption}
          <span>
            {" "}
            &nbsp;
            {tags.map((item, key) => (
              <>&nbsp;#{item.title}</>
            ))}
            &nbsp;
          </span>
        </p>
      </div>
      <div className="post-date">{/* {created_at} */}</div>
    </>
  );
};

export default PostInfo;
