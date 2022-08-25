import "../ProfileComp/myprofile.css";
import React, { useState, useEffect, useContext } from "react";
import { axiosHandler, getToken } from "../../helper";
import { store } from "../../stateManagement/store";
import { SAVED_URL } from "../../urls";
import UserInfo from "../UserInfo";
import PostContent from "../PostContent";
import PostInfo from "../PostInfo";
import NewDetail from "../NewDetail/NewDetail";
import { volumeAction } from "../../stateManagement/actions";
import { GalleryItem } from "../ProfileComp/MyProfile";

let post = [];

let p1;
let goneNext = false;
let canGoNext = false;
let shouldHandleScroll = false;
const Saved = (props) => {
  const [fetching, setFetching] = useState(true);

  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);

  const [list, setList] = useState(false);
  const [grid, setGrid] = useState(true);
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);

  const [close, setClose] = useState(false);

  const [myPost, setMyPost] = useState([]);

  const [overallAudio, setOverallAudio] = useState(true);

  useEffect(async () => {
    let r = await getMyPost(1);
    setFetching(false);

    return () => {};
  }, []);

  useEffect(() => {
    try {
      window.addEventListener("scroll", autoFetchSaved);
    } catch (error) {
      console.log("couldnt add event listener to window");
    }

    return () => {
      window.removeEventListener("scroll", autoFetchSaved);
      post = [];
      p1 = [];
    };
  }, []);

  const autoFetchSaved = async () => {
    if (shouldHandleScroll) {
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 100
      ) {
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

  const getMyPost = async (page = null) => {
    let extra = `keyword=${userDetail.user.username}`;

    const token = await getToken();
    let url;
    if (page) {
      url = `${SAVED_URL}?page=${page}&${extra}`;
    } else {
      url = `${p1.next}`;
    }
    const res = await axiosHandler({
      method: "get",
      url: url,
      token,
    }).catch((e) => {
      console.log("Error in MySaved::::", e);
      canGoNext = true;

      goneNext = false;
    });

    if (res) {
      console.log(" MySaved::::", res.data);
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

        shouldHandleScroll = true;
      } else {
        shouldHandleScroll = false;
        canGoNext = true;
      }
    }
  };

  if (fetching) {
    return <div>loading</div>;
  }
  return (
    <>
      <div id="main" className="flexbox-col-start-center">
        <div className="view-width">
          <section className="profile-page">
            <h2
              style={{
                textAlign: "center",
              }}
            >
              Saved
            </h2>
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
                  <div id={`feed${item.post.id}`} key={key}>
                    <div className="content-wrapper feed-wrapper">
                      <div className="post-wall">
                        <div className="post" id={"post" + item.post.id}>
                          <div className="post-wrapper">
                            <UserInfo
                              data={item.post.author}
                              id={item.post.id}
                              refresh={false}
                            />
                            <PostContent
                              id={item.post.id}
                              image={item.post.image}
                              video={item.post.video}
                              overallAudio={overallAudio}
                              setOverallAudio={setOverallAudio}
                            />
                            <PostInfo
                              id={item.post.id}
                              like={item.post.like}
                              caption={item.post.caption}
                              author={item.post.author}
                              created_at={item.post.created_at}
                              tags={item.post.tags}
                              comment_count={item.post.comment_count}
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
                          setId(item.post.id);
                          setUser(item.post.author);

                          setClose(false);
                          document.documentElement.style.overflow = "hidden";

                          const popup1Cont = document.querySelector("#popup1");
                          popup1Cont.style.visibility = "visible";
                          popup1Cont.style.opacity = 1;
                          popup1Cont.style.display = "block";
                        }}
                      >
                        <GalleryItem item={item.post} />
                      </a>
                    ))}
                </>
              )}
            </>
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

export default Saved;
