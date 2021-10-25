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
    console.log(props);
    getPostDetail(props);
  }, []);

  const getPostDetail = async () => {
    setFetching(true);
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      url: POST_URL + props.match.params.id + "/",
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

  const handleDelete = async () => {
    const token = await getToken();
    const data = { author_id: userDetail.user.id, post_id: post.id };
    const res = await axiosHandler({
      method: "POST",
      url: POST_DELETE,
      data,
      token,
    }).catch((e) => {
      console.log("Error in Delete post::::", e);
      alert("There was an error");
      // setError(true)
    });

    if (res) {
      console.log(" Delete post response::::", res.data);
      alert("Post deleted!");
      window.location.href = "/my-profile";
      // setMyPost(res.data)

      // setFetching(false)
    }
  };

  if (fetching) {
    return (
      <div className="content-wrapper feed-wrapper">
        <div className="post-wall">
          <div className="post">
            <div className="post-wrapper">
              {isAuth && (
                <div>
                  <button>Edit</button>
                  <button>Delete</button>
                </div>
              )}
              <div>
                <button>Share</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="content-wrapper feed-wrapper">
      <div className="post-wall">
        <div className="post">
          <div className="post-wrapper">
            {isAuth && (
              <div>
                <button>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            )}
            <div>
              <button>Share</button>
            </div>

            <UserInfo data={post.author} />
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
