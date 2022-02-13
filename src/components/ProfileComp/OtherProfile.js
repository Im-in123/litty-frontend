import "./myprofile.css";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { axiosHandler, getToken } from "../../helper";
import { store } from "../../stateManagement/store";
import { UrlParser } from "../../customs/others";
import {
  BASE_URL,
  BASE_URL1,
  POST_URL,
  OTHER_PROFILE_URL,
  UPDATE_FOLLOW,
  LOCAL_CHECK,
  CHECK_FOLLOW,
} from "../../urls";
import UserInfo from "../UserInfo";
import PostContent from "../PostContent";
import PostInfo from "../PostInfo";
import { GalleryItem } from "./MyProfile";
import PostDetail from "../PostDetail";
import NewDetail from "../NewDetail/NewDetail";
import { volumeAction } from "../../stateManagement/actions";

let post = [];
let otherUser = [];

let p1;
let goneNext = false;
let canGoNext = false;
let shouldHandleScroll = false;
let o_name;
const OtherProfile = (props) => {
  const [fetching, setFetching] = useState(true);
  const [followFetching, setFollowFetching] = useState(true);
  const [close, setClose] = useState(false);
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);

  const [error, setError] = useState(false);
  const [myPost, setMyPost] = useState([]);
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);

  const {
    state: { volumeTrigger },
  } = useContext(store);

  const [otherUser, setOtherUser] = useState("");
  const [followers, setFollowers] = useState(false);
  const [following, setFollowing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [followError, setFollowError] = useState(false);

  const [followLoading, setFollowLoading] = useState(false);
  const [list, setList] = useState(false);
  const [grid, setGrid] = useState(true);
  const [overallAudio, setOverallAudio] = useState(true);

  useEffect(async () => {
    const othername = props.match.params.username;
    o_name = othername;
    let extra = `?keyword=${othername}`;
    await getOtherProfile(extra);

    return () => {};
  }, []);
  useEffect(() => {
    try {
      window.addEventListener("scroll", autoFetchOtherProfile);
    } catch (error) {
      console.log("couldnt add event listener to window");
    }

    return () => {
      window.removeEventListener("scroll", autoFetchOtherProfile);
      post = [];
      p1 = [];
    };
  }, []);
  // function atEnd() {
  //   var c = [
  //     document.scrollingElement.scrollHeight,
  //     document.body.scrollHeight,
  //     document.body.offsetHeight,
  //   ].sort(function (a, b) {
  //     return b - a;
  //   }); // select longest candidate for scrollable length
  //   return window.innerHeight + window.scrollY + 2 >= c[0]; // compare with scroll position + some give
  // }
  // function scrolling() {
  //   if (atEnd()) console.log("is at end");
  // }
  // window.addEventListener("scroll", scrolling, { passive: true });
  const autoFetchOtherProfile = async () => {
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
    dispatch({ type: volumeAction, payload: overallAudio });

    return () => {};
  }, [overallAudio]);
  const getOtherProfile = async (extra) => {
    setFetching(true);
    const token = await getToken();
    const gp = await axiosHandler({
      method: "get",
      url: OTHER_PROFILE_URL + extra,
      token,
    }).catch((e) => {
      console.log("Error in getOtherProfile::::", e);
      setError(true);
    });

    if (gp) {
      console.log(" getOtherProfile res::::", gp.data);
      setOtherUser(gp.data);
      setFollowers(gp.data.followers.length);
      setFollowing(gp.data.following.length);

      try {
        o_name = gp.data.user.username;
        await getMyPost(1);
      } catch (error) {
        setError(true);
      }
      try {
        await checkFollowHandler(gp.data);
      } catch (error) {
        setError(true);
        console.log("error check follow:::", error);
      }
    }
    setFetching(false);
  };

  const getMyPost = async (page) => {
    // setFetching(true);
    let extra = `keyword=${o_name}`;
    let url;
    if (page) {
      url = `${POST_URL}?page=${page}&${extra}`;
    } else {
      url = `${p1.next}`;
    }
    const token = await getToken();
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
        // setMyPost([...myPost, ...res.data.results]);

        setMyPost([...post]);
      } else {
        post = res.data.results;
        setMyPost(res.data.results);
      }
      p1 = res.data;

      if (p1.next) {
        canGoNext = true;

        goneNext = false;

        shouldHandleScroll = true;
      } else {
        shouldHandleScroll = false;
        canGoNext = true;
      }
    }
    console.log("post:::", post);
  };

  const checkFollowHandler = async (other) => {
    setFollowLoading(true);
    const token = await getToken();
    const data = { other_id: other.user.id };
    console.log("check followbefore data::::", data);

    const res = await axiosHandler({
      method: "post",
      url: CHECK_FOLLOW,
      data: data,
      token,
    }).catch((e) => {
      console.log(e);
      setFollowError(true);
    });

    if (res) {
      setFollowLoading(false);

      console.log("handleFollow:::", res.data);
      const rr1 = res.data["data"];
      console.log("rr2:::::", rr1);

      if (rr1 === "false") {
        setIsFollowing(false);
      } else if (rr1 === "true") {
        setIsFollowing(true);
      }
    }
    setFollowError(false);
  };

  const followHandler = async (e) => {
    setFollowLoading(true);
    const token = await getToken();
    const data = { other_id: otherUser.user.id };
    console.log("before data::::", data);

    const res = await axiosHandler({
      method: "post",
      url: UPDATE_FOLLOW,
      data: data,
      token,
    }).catch((e) => {
      console.log(e);
      setFollowError(true);
    });

    if (res) {
      setFollowLoading(false);

      console.log("handleFollow:::", res.data);
      const rr1 = res.data["data"];
      console.log("rr2:::::", rr1);
      var vv = document.getElementById("followers");

      if (rr1 === "unfollowed") {
        setIsFollowing(false);

        setFollowers((f) => f - 1);
      } else if (rr1 === "followed") {
        setIsFollowing(true);
        setFollowers((f) => f + 1);
      }
    }
    setFollowError(false);
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
                      <p className="">
                        Followers <span id="followers"></span>
                      </p>
                      <p className="">
                        Following <span id="following"></span>
                      </p>
                      <p className="">Likes</p>
                    </div>
                    <p className="phi-profile-tagline">Loading...</p>
                    <br />
                  </div>
                </div>
                <div className="phi-info-right flexbox-right">
                  <div className="buttons-fm">
                    <button
                      type="button"
                      className="btn-primary-gray button btn-primary flexbox"
                    >
                      <ion-icon name="heart-outline"></ion-icon>
                      <span id="follow-btn">...</span>
                    </button>
                    <button
                      type="button"
                      className="btn-primary-gray button btn-primary flexbox"
                    >
                      <ion-icon name="heart-outline"></ion-icon> Message
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
                          src={`${otherUser.profile_picture}`}
                          alt=""
                        />
                      ) : (
                        <img
                          className="phi-profile-picture"
                          src={otherUser.profile_picture_url}
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                  <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"
                  ></link>
                  <div className="phi-profile-username-wrapper flexbox-col-left">
                    <h3 className="phi-profile-username flexbox">
                      {otherUser.user.username}
                      {otherUser.user.verification_badge && (
                        <span className="material-icons-round">verified</span>
                      )}
                    </h3>

                    <div className="ps-fm">
                      <p className="">
                        Followers <span id="followers">{followers}</span>
                      </p>
                      <p className="">
                        Following <span id="following">{following}</span>
                      </p>
                      <p className="">Likes 2B</p>
                    </div>
                    <p className="phi-profile-tagline">{otherUser.bio}</p>
                    <br />
                    <p className="postnum">
                      {otherUser.post_count ? otherUser.post_count : "0"}
                      {otherUser.post_count === 1 ? " Post" : " Posts"}
                    </p>
                  </div>
                </div>
                <div className="phi-info-right flexbox-right">
                  <div className="buttons-fm">
                    <button
                      type="button"
                      className="btn-primary-gray button btn-primary flexbox"
                      onClick={followHandler}
                    >
                      <ion-icon name="heart-outline"></ion-icon>
                      <span id="follow-btn">
                        {followLoading ? (
                          "..."
                        ) : (
                          <>{isFollowing ? "Unfollow" : "Follow"}</>
                        )}
                      </span>
                    </button>
                    <Link
                      to={`/chatpage/username=${otherUser.user.username}-timeout=${otherUser.user.id}`}
                    >
                      {" "}
                      <button
                        type="button"
                        className="btn-primary-gray button btn-primary flexbox"
                      >
                        <ion-icon name="heart-outline"></ion-icon> Message
                      </button>
                    </Link>
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
                        document.documentElement.style.overflow = "hidden";

                        setClose(false);
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
          </div>
          <div className="load-more-post">
            <span>{p1 && p1.next ? "Loading more..." : ""}</span>
          </div>
          <div className="load-more-post">
            <span>
              {myPost.length < 1 || !p1?.next ? "No more posts!" : ""}
            </span>
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

export default OtherProfile;
