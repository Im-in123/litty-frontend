import "./myprofile.css";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { axiosHandler, getToken } from "../../helper";
import { store } from "../../stateManagement/store";
import {
  BASE_URL,
  BASE_URL1,
  LOCAL_CHECK,
  POST_URL,
  SAVED_URL,
} from "../../urls";
import UserInfo from "../UserInfo";
import PostContent from "../PostContent";
import PostInfo from "../PostInfo";
import { fetchMyProfile, logout } from "../../customs/authController";
import NewDetail from "../NewDetail/NewDetail";
import {
  commentInputSetterAction,
  volumeAction,
} from "../../stateManagement/actions";
import { UrlParser } from "../../customs/others";

let post = [];

let p1;
let goneNext = false;
let canGoNext = false;
let shouldHandleScroll = false;
const MyProfile = (props) => {
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const {
    state: { volumeTrigger },
  } = useContext(store);
  const [list, setList] = useState(false);
  const [grid, setGrid] = useState(true);
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);

  const [followers, setFollowers] = useState(false);
  const [following, setFollowing] = useState(false);
  const [close, setClose] = useState(false);

  const [myPost, setMyPost] = useState([]);

  const [overallAudio, setOverallAudio] = useState(true);
  const [end, setEnd] = useState(false);
  useEffect(async () => {
    console.log("MyProfile props:::", props);

    setFollowers(userDetail.followers.length);
    setFollowing(userDetail.following.length);

    let r = await getMyPost(1);
    setFetching(false);
    fetchMyProfile(dispatch);

    return () => {};
  }, []);

  useEffect(() => {
    try {
      window.addEventListener("scroll", autoFetchProfile);
    } catch (error) {
      console.log("couldnt add event listener to window");
    }

    return () => {
      window.removeEventListener("scroll", autoFetchProfile);
      post = [];
      p1 = [];
    };
  }, []);

  const autoFetchProfile = async () => {
    if (shouldHandleScroll) {
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 100
      ) {
        console.log("reached");
        console.log("finally", canGoNext, goneNext);
        if (canGoNext && !goneNext) {
          goneNext = true;
          shouldHandleScroll = false;

          await getMyPost();
        } else {
          console.log("passing cangonext", canGoNext, goneNext);
        }
      }
    } else {
      console.log("passing autofetch", canGoNext, goneNext);
    }
  };
  useEffect(() => {
    console.log("overallAudio:::", overallAudio);
    dispatch({ type: volumeAction, payload: overallAudio });

    return () => {};
  }, [overallAudio]);

  const getMyPost = async (page = null) => {
    let extra = `keyword=${userDetail.user.username}`;

    setLoading(true);

    const token = await getToken();
    let url;
    if (page) {
      url = `${POST_URL}?page=${page}&${extra}`;
    } else {
      url = `${p1.next}`;
    }
    const res = await axiosHandler({
      method: "get",
      url: url,
      token,
    }).catch((e) => {
      console.log("Error in MyPost::::", e);
      canGoNext = true;

      goneNext = false;
      setError(true);
    });

    if (res) {
      console.log(" MyPost::::", res.data);
      if (post.length > 0) {
        for (var i in res.data.results) {
          post.push(res.data.results[i]);
        }

        setMyPost(post);
      } else {
        post = res.data.results;
        setMyPost(res.data.results);
      }
      p1 = res.data;

      if (p1.next) {
        canGoNext = true;

        goneNext = false;
        setEnd(false);
        shouldHandleScroll = true;
      } else {
        setEnd(true);
        shouldHandleScroll = false;
        canGoNext = true;
      }
    }
    setLoading(false);
    console.log("PostList:::", myPost);
    console.log("post:::", post);
  };

  if (fetching) {
    return (
      <main id="main" className="flexbox-col-start-center">
        <div className="view-width">
          <section className="profile-header">
            <div className="profile-header-inner flexbox">
              <div className="phi-info-wrapper flexbox">
                <div className="phi-info-left flexbox">
                  <div className="phi-profile-picture-wrapper">
                    <div className="phi-profile-picture-inner flexbox">
                      <img className="phi-profile-picture" alt="" />
                    </div>
                  </div>

                  <div className="phi-profile-username-wrapper flexbox-col-left">
                    <h3 className="phi-profile-username flexbox">
                      <span className="material-icons-round"></span>
                    </h3>
                    <div className="ps-fm">
                      <p className="">Followers </p>
                      <p className="">Following </p>
                      <p className="">Likes</p>
                    </div>
                    <p className="phi-profile-tagline">Loading...</p>
                    <br></br>
                    <br></br>
                  </div>
                </div>
                <div className="phi-info-right flexbox-right">
                  <div className="buttons-fm">
                    <button
                      type="button"
                      className="btn-primary-gray button btn-primary flexbox"
                    >
                      <ion-icon name="heart-outline"></ion-icon>{" "}
                      <Link to="/settings">Settings</Link>{" "}
                      <div className="btn-secondary"></div>
                    </button>
                    <button
                      type="button"
                      className="btn-primary-gray button btn-primary flexbox"
                    >
                      <ion-icon name="heart-outline"></ion-icon> Logout
                      <div className="btn-secondary"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="profile-header-overlay"></div>
              <img
                className="profile-header-image"
                src="https://images.unsplash.com/photo-1616808943301-d80596eff29f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2010&q=80"
                alt=""
              />
            </div>
          </section>

          <section className="profile-page">
            <div className="profile-page-inner"></div>
          </section>
        </div>
      </main>
    );
  }
  return (
    <>
      <div id="main" className="flexbox-col-start-center">
        <div className="view-width">
          <section className="profile-header">
            <div className="profile-header-inner flexbox">
              <div className="phi-info-wrapper flexbox">
                <div className="phi-info-left flexbox">
                  <div className="phi-profile-picture-wrapper">
                    <div className="phi-profile-picture-inner flexbox">
                      {LOCAL_CHECK ? (
                        <img
                          className="phi-profile-picture"
                          src={`${userDetail.profile_picture}`}
                          alt=""
                        />
                      ) : (
                        <img
                          className="phi-profile-picture"
                          src={userDetail.profile_picture_url}
                          alt=""
                        />
                      )}
                    </div>
                  </div>

                  <div className="phi-profile-username-wrapper flexbox-col-left">
                    <h3 className="phi-profile-username flexbox">
                      {userDetail.user.username}
                      {userDetail.user.verification_badge && (
                        <span className="material-icons-round">verified</span>
                      )}
                    </h3>

                    <div className="ps-fm">
                      <Link to="/myfollow/followers">
                        {" "}
                        <p className="">Followers {followers}</p>
                      </Link>
                      <Link to="/myfollow/following">
                        {" "}
                        <p className="">Following {following}</p>
                      </Link>
                      <p className="">Likes {userDetail.like_count}</p>
                    </div>
                    <p className="phi-profile-tagline">{userDetail.bio}</p>
                    <br></br>
                    <p className="postnum">
                      {userDetail.all_post_count
                        ? userDetail.all_post_count
                        : "0"}
                      {userDetail.all_post_count === 1 ? " Post" : " Posts"}
                    </p>
                  </div>
                </div>
                <div className="phi-info-right flexbox-right">
                  <div className="buttons-fm">
                    <button
                      type="button"
                      className="btn-primary-gray button btn-primary flexbox"
                    >
                      <ion-icon name="heart-outline"></ion-icon>{" "}
                      <Link to="/settings">More</Link>{" "}
                      <div className="btn-secondary"></div>
                    </button>
                    <button
                      type="button"
                      className="btn-primary-gray button btn-primary flexbox"
                      onClick={() => logout(props)}
                    >
                      <ion-icon name="heart-outline"></ion-icon> Logout
                      <div className="btn-secondary"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="profile-header-overlay"></div>
              <img
                className="profile-header-image"
                src="https://images.unsplash.com/photo-1616808943301-d80596eff29f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2010&q=80"
                alt=""
              />
            </div>
          </section>

          <section className="profile-page">
            <div className="profile-page-list-style">
              <div
                className="g"
                style={{ borderBottom: "2px solid white" }}
                onClick={(e) => {
                  const qs = document.querySelector(".l");
                  qs.style.borderBottom = "none";
                  e.target.style.borderBottom = "2px solid white";
                  setGrid(true);
                  setList(false);
                }}
              >
                Grid
              </div>
              <div
                className="l"
                onClick={(e) => {
                  const qs = document.querySelector(".g");
                  qs.style.borderBottom = "none";
                  e.target.style.borderBottom = "2px solid white";
                  setList(true);
                  setGrid(false);
                }}
              >
                List
              </div>
            </div>
          </section>
        </div>
        <div className="containerz">
          {list && (
            <>
              {myPost &&
                myPost.map((item, key) => (
                  <div id="feed" id={`feed${item.id}`} key={key}>
                    <div className="content-wrapper feed-wrapper">
                      <div className="post-wall">
                        <div className="post" id={"post" + item.id}>
                          <div className="post-wrapper">
                            <UserInfo
                              data={item.author}
                              id={item.id}
                              refresh={false}
                            />
                            <PostContent
                              id={item.id}
                              image={item.image}
                              video={item.video}
                              overallAudio={overallAudio}
                              setOverallAudio={setOverallAudio}
                            />
                            <PostInfo
                              id={item.id}
                              like={item.like}
                              caption={item.caption}
                              author={item.author}
                              created_at={item.created_at}
                              tags={item.tags}
                              comment_count={item.comment_count}
                            />
                            <br />
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}

          <div className="gallery">
            <>
              {grid && (
                <>
                  {myPost &&
                    myPost.map((item, key) => (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setId(item.id);
                          setUser(item.author);

                          setClose(false);
                          document.documentElement.style.overflow = "hidden";

                          const popup1Cont = document.querySelector("#popup1");
                          popup1Cont.style.visibility = "visible";
                          popup1Cont.style.opacity = 1;
                          popup1Cont.style.display = "block";
                        }}
                      >
                        <GalleryItem item={item} />
                      </a>
                    ))}
                </>
              )}
            </>
          </div>
          {/* <div className="load-more-post">
            <span>{p1 && p1.next ? "Loading more..." : ""}</span>
          </div>
          <div className="load-more-post">
            <span>
              {myPost.length < 1 || !p1?.next ? "No more posts!" : ""}
            </span>
          </div> */}
          <div className="load-more-post">
            <span>{end ? "No more posts!" : "Loading more..."}</span>
          </div>
        </div>
      </div>
      <div id="popup1" className="overlay overlay-back">
        <div className="popup popup-back">
          <a
            className="close close-back"
            href="##"
            onClick={(e) => {
              e.preventDefault();
              document.documentElement.style.overflow = "auto";

              setClose(true);
              setId(null);
              setUser(null);
              dispatch({ type: commentInputSetterAction, payload: null });

              const popup1Cont = document.querySelector("#popup1");
              popup1Cont.style.visibility = "hidden";
              popup1Cont.style.opacity = 0;
              popup1Cont.style.display = "none";
            }}
          >
            &times;
          </a>
          <NewDetail post_id={id} close={close} user={user} />
        </div>
      </div>
    </>
  );
};

export default MyProfile;

export const GalleryItem = (props) => {
  // console.log("GalleryItem props:::", props);
  let item = props.item;
  let image;
  if (item) {
    if (item.image.length > 0) {
      let renderIcon = false;
      image = item.image[0];
      // console.log("image:::", image);
      if (item.image.length > 1) {
        renderIcon = true;
      }
      if (item.video.length > 0) renderIcon = true;
      let show_actual_img = false;
      if (LOCAL_CHECK) {
        if (image.thumbnail === BASE_URL1 + "/media/image_empty.jpg") {
          show_actual_img = true;
        }
      } else {
        if (image.thumbnail_url === BASE_URL1 + "/media/image_empty.jpg") {
          show_actual_img = true;
        }
      }
      return (
        <>
          <div className="gallery-item" tabIndex="0">
            {LOCAL_CHECK ? (
              <img
                src={!show_actual_img ? image.thumbnail : image.image}
                className="gallery-image"
                alt=""
              />
            ) : (
              <img
                src={!show_actual_img ? image.thumbnail_url : image.image_url}
                className="gallery-image"
                alt=""
              />
            )}

            {renderIcon && (
              <div className="gallery-item-type">
                <span className="visually-hidden">Gallery</span>
                <i className="fas fa-clone" aria-hidden="true"></i>
              </div>
            )}

            <div className="gallery-item-info">
              <ul>
                <li className="gallery-item-likes">
                  <span className="visually-hidden">Likes:</span>
                  <i className="fas fa-heart" aria-hidden="true"></i>{" "}
                  {item.like.length}
                </li>
                <li className="gallery-item-comments">
                  <span className="visually-hidden">Comments:</span>
                  <i className="fas fa-comment" aria-hidden="true"></i>{" "}
                  {item.comment_count}
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    }
    let video;
    if (item.video.length > 0) {
      let renderIcon = false;
      video = item.video[0];

      if (item.video.length > 1) {
        renderIcon = true;
      }
      return (
        <>
          <div className="gallery-item" tabIndex="0">
            <img
              src={LOCAL_CHECK ? video.thumbnail : video.thumbnail_url}
              className="gallery-image"
              alt=""
            />

            <div className="gallery-item-type">
              <span className="visually-hidden">Video</span>
              <i className="fas fa-video" aria-hidden="true"></i>
              &nbsp;
              {renderIcon && (
                <i className="fas fa-clone" aria-hidden="true"></i>
              )}
            </div>

            <div className="gallery-item-info">
              <ul>
                <li className="gallery-item-likes">
                  <span className="visually-hidden">Likes:</span>
                  <i className="fas fa-heart" aria-hidden="true"></i>{" "}
                  {item.like.length}
                </li>
                <li className="gallery-item-comments">
                  <span className="visually-hidden">Comments:</span>
                  <i className="fas fa-comment" aria-hidden="true"></i>{" "}
                  {item.comment_count}
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    }
  }
  return <></>;
};
