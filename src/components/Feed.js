import React, { useState, useContext, useEffect } from "react";
import PostContent from "./PostContent";
import PostInfo from "./PostInfo";
import UserInfo from "./UserInfo";
import { POST_URL } from "../urls";
import { axiosHandler, getToken } from "../helper";
import { store } from "../stateManagement/store";
import { volumeAction } from "../stateManagement/actions";
import { VerifyFunc } from "../customs/others";

let p1;
let post = [];
let goneNext = false;
let canGoNext = false;
let shouldHandleScroll = false;
const Feed = (props) => {
  const [fetching, setFetching] = useState(true);
  const [postList, setPostList] = useState([]);
  const [overallAudio, setOverallAudio] = useState(true);

  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);

  useEffect(() => {
    //set volume to on or off
    dispatch({ type: volumeAction, payload: overallAudio });

    return () => {};
  }, [overallAudio]);

  useEffect(() => {
    VerifyFunc(userDetail);

    return () => {};
  }, []);

  useEffect(() => {
    getPostContent(1);

    return () => {};
  }, []);

  useEffect(() => {
    try {
      window.addEventListener("scroll", autoFetch);
    } catch (error) {
      console.log("couldnt add event listener to window");
    }

    return () => {
      window.removeEventListener("scroll", autoFetch);
    };
  }, []);
  const autoFetch = async () => {
    if (shouldHandleScroll) {
      let numb = document.documentElement.getBoundingClientRect();
      let height =
        document.documentElement.offsetHeight -
        document.documentElement.clientHeight;

      height = height * -1;

      if (numb.top <= height + 200) {
        console.log("finally", canGoNext, goneNext);
        if (canGoNext && !goneNext) {
          goneNext = true;
          shouldHandleScroll = false;
          await getPostContent();
        } else {
          console.log("passing cangonext", canGoNext, goneNext);
        }
      }
    } else {
      console.log("passing autofetch", canGoNext, goneNext);
    }
  };
  const getPostContent = async (page = null) => {
    canGoNext = false;
    const token = await getToken();

    const res = await axiosHandler({
      method: "get",
      url: page ? `${POST_URL}?page=${page}` : p1.next,
      token,
    }).catch((e) => {
      console.log("Error in Feed::::", e);

      shouldHandleScroll = true;
      canGoNext = true;
      goneNext = false;
    });

    if (res) {
      //refresh number of post to 0 if number of posts on page is greater than or equal to 27
      if (post.length >= 0 && post.length <= 27) {
        // for (var i in res.data.results) {
        //   post.push(res.data.results[i]);
        // }
        // setPostList(post);
        setPostList((items) => [...items, ...res.data.results]);
      } else {
        setFetching(true);
        setPostList([]);

        setTimeout(() => {
          post = res.data.results;
          setPostList((a) => res.data.results);
          setFetching(false);
        }, 1000);

        scrollToTop();
      }

      p1 = res.data;

      if (p1.next) {
        canGoNext = true;

        goneNext = false;

        shouldHandleScroll = true;
      } else {
        shouldHandleScroll = false;
      }
    }

    setFetching(false);
  };
  const scrollToTop = () => {
    setTimeout(() => {
      try {
        document.documentElement.scrollTop = 0;
      } catch (error) {}
    }, 300);
  };
  if (fetching) {
    return (
      <div id="feed">
        <div className="content-wrapper feed-wrapper">
          <div className="post-wall">
            <div className="post">
              <div className="post-wrapper">
                <UserInfo />

                <div className="post-content">
                  <div className="slideshow-container">
                    <div className="fade mySlides mySlidesget">
                      <div className="numbertext">loading..</div>
                      <img
                        src=""
                        alt="loading.."
                        className="iimm"
                        style={{ width: "100%" }}
                      />
                      <div className="text">loading..</div>
                    </div>
                  </div>
                  <br />
                </div>

                <div className="post-info">
                  <div className="likes">
                    <a onClick={(e) => e.preventDefault()}>
                      <div className="icon">
                        <i className="far fa-heart"></i>
                      </div>
                    </a>
                  </div>
                  <div className="comments" id="##">
                    <a href="#">
                      <div className="icon">
                        <i className="far fa-comment-alt"></i>
                      </div>
                    </a>
                  </div>
                  <div className="share" id="##">
                    <a href="#">
                      <div className="icon">
                        <i className="far fa-save"></i>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="caption">
                  <p>
                    <b></b>
                    loading...
                  </p>
                </div>
                <div className="post-date"> </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!fetching) {
    return (
      <>
        {postList.length > 0 &&
          postList.map((item, key) => (
            <div id={`feed${item.id}`} key={key}>
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

        <div className="load-more-post">
          <span>{p1?.next ? "Loading more ..." : ""}</span>
        </div>
        {!fetching ? (
          <div className="load-more-post">
            <span>
              {/* {postList.length < 1 || !p1?.next ? "No more posts!" : ""} */}
            </span>
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
};

export default Feed;
