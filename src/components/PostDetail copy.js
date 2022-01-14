import React, { useEffect, useState, useContext } from "react";
import { POST_DELETE, POST_URL } from "../urls";
import { axiosHandler, getToken } from "../helper";
import UserInfo from "./UserInfo";
import PostContent from "./PostContent";
import PostInfo from "./PostInfo";
import { store } from "../stateManagement/store";

// let post = [];
const PostDetail = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [post, setPost] = useState(false);

  useEffect(() => {
    if (!props.id) return;

    console.log(props);
    getPostDetail(props);
  }, [props.id]);

  const getPostDetail = async () => {
    setFetching(true);
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      // url: POST_URL + props.match.params.id + "/",
      url: POST_URL + props.id + "/",

      token,
    }).catch((e) => {
      console.log("getPostDetail Error::::", e);
      setError(true);
    });

    if (res) {
      console.log("getPostDetail::::", res.data);
      // post = res.data
      setPost(res.data);
      if (res.data.author.username === userDetail.user.username) {
        setIsAuth(true);
      }
      setFetching(false);
    }
  };

  if (fetching) {
    return (
      <div className="content-wrapper feed-wrapper">
        <div className="post-wall">
          <div className="post">
            <div className="post-wrapper"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="content-wrapper feed-wrapper">
      <div className="post-wall">
        <div className="post" id={"post" + post.id}>
          <div className="post-wrapper">
            <UserInfo data={post.author} id={post.id} />
            <PostContent id={post.id} image={post.image} video={post.video} />
            <PostInfo
              id={post.id}
              like={post.like}
              caption={post.caption}
              author={post.author}
              created_at={post.created_at}
              tags={post.tags}
              comment_count={post.comment_count}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostDetail;
