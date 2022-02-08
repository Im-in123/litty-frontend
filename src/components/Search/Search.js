import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./search.css";
import {
  BASE_URL1,
  LOCAL_CHECK,
  POST_URL,
  PROFILE_URL,
  SEARCH_PTV_URL,
  USER_SEARCH_URL,
} from "../../urls";
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import { uuidv4 } from "../../customs/others";
let gp1, gu1;
let g_users = [];
let g_posts = [];
let g_all = [];
let goneNextp = false;
let canGoNextp = true;
let goneNextu = false;
let canGoNextu = true;
let goneNext = false;
let canGoNext = false;
let shouldHandleScroll = true;

let shouldHandleScrollp = false;
let shouldHandleScrollu = false;
let currentPagep = 1;
let currentPageu = 1;
let new_users1 = [],
  new_users2 = [];
let new_posts1 = [],
  new_posts2 = [];
let category = "All";
const Search = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [searchb, setSearchb] = useState("");
  const [users, setUsers] = useState([]);
  const [users2, setUsers2] = useState([]);
  const [all, setAll] = useState([]);
  const [mode, setMode] = useState("all");

  const [posts, setPosts] = useState([]);
  const [posts2, setPosts2] = useState([]);

  // const [category, setCategory] = useState("All");

  let debouncer;

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    let dropdown = document.querySelector(".dropdown");
    dropdown.onclick = function () {
      dropdown.classList.toggle("active");
    };
    return () => {};
  }, []);
  useEffect(() => {
    try {
      window.addEventListener("scroll", autoFetchSearch);
    } catch (error) {
      console.log("couldnt add event listener to window");
    }

    return () => {
      window.removeEventListener("scroll", autoFetchSearch);
      g_all=[]
      new_users1 = []
      new_users2 = [];
      new_posts1 = []
      new_posts2 = [];
      gp1=[]
      gu1=[]
      category = "All";
      setMode("all");
    };
  }, []);
  useEffect(() => {
    getter();
  }, [search, searchb]);

  const getter = async (addt = null) => {
    clearTimeout(debouncer);

    debouncer = setTimeout(async () => {
      if (addt) {
      } else {
        g_all = [];
        setAll([]);
        console.log("should be empty g_all:::", g_all);
      }
      console.log("category::", category);
      if (category === "All") {
        await getResultAll(addt);
        shouldHandleScroll = true;
      }
      if (category === "People") {
        await getUsers(addt);
        shouldHandleScroll = true;
      }
      if (category === "Hashtags") {
        await getPosts(addt);
        shouldHandleScroll = true;
      }
    }, 2000);
  };

  const autoFetchSearch = async () => {
    if (shouldHandleScroll) {
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 100
      ) {
        console.log("reached");
        console.log("finally", canGoNext, goneNext);
        shouldHandleScroll = false;
        // if (shouldHandleScrollp) shouldHandleScrollp = !shouldHandleScrollp;
        // if (shouldHandleScrollu) shouldHandleScrollu = !shouldHandleScrollu;

        await getter(true);
      } else {
        console.log("passing autofetch", canGoNext, goneNext);
      }
    }
  };
  function show(value) {
    document.querySelector(".text-box").value = value;
  }

  const getResultAll = async (addt = null) => {
    console.log("getting all result");
    await getUsers(addt);
    await getPosts(addt);
    g_all = [...new_users2, ...new_posts2];
    console.log("g_all:::", g_all);
    setAll(g_all);
  };

  const getPosts = async (addt = null) => {
    console.log("getting all posts");
    let extra = `keyword=${search}`;
    setFetching(true);
    let url;

    if (addt !== null) {
      console.log("addt::", addt);
      url = gp1.next ? gp1.next : null;
    } else {
      url = `${SEARCH_PTV_URL}?page=${currentPagep}&${extra}`;
    }
    if (!url) {
      console.log("returning in posts");

      setFetching(false);
      return;
    }
    const token = await getToken();
    console.log("url p:::", url);
    const result = await axiosHandler({
      method: "get",
      url: url,
      token,
    }).catch((e) => {
      console.log("getposts error::::", e);
      setFetching(false);
    });

    if (result) {
      // alert("aye");

      console.log("getposts results::::", result.data);
      g_posts = result.data.results;
      let total_length = g_posts.length;
      total_length = Math.ceil(total_length / 2);
      console.log("total_length:::", total_length);
      if (!addt) {
        new_posts1 = [];
        new_posts2 = [];
      }

      for (var i in g_posts) {
        let ii = g_posts[i];
        if (i < 7 && new_posts1.length <= 6) {
          new_posts1.push(ii);
        } else {
          new_posts2.push(ii);
        }
      }
      console.log("new_posts1::", new_posts1);
      console.log("new_posts2::", new_posts2);

      setPosts(new_posts1);
      setPosts2(new_posts2);

      gp1 = result.data;

      if (gp1.next) {
        canGoNextp = true;

        goneNextp = false;

        shouldHandleScrollp = true;
      } else {
        shouldHandleScrollp = false;
        canGoNextp = false;
        goneNextp = true;
      }
      setFetching(false);
    }
  };
  const getUsers = async (addt = null) => {
    setFetching(true);
    let extra = `keyword=${search}`;

    let url;

    if (addt !== null) {
      console.log("addtu::", addt);
      url = gu1.next ? gu1.next : null;
    } else {
      url = `${PROFILE_URL}?page=${currentPageu}&${extra}`;
    }
    console.log("url u:::", url);
    if (!url) {
      console.log("returning in users");

      setFetching(false);

      return;
    }
    const token = await getToken();
    const result = await axiosHandler({
      method: "get",
      url: url,
      token,
    }).catch((e) => {
      console.log("getUser error::::", e);

      setFetching(false);
    });

    if (result) {
      console.log("getUser results::::", result.data);
      g_users = result.data.results;
      let total_length = g_users.length;
      total_length = Math.ceil(total_length / 2);
      console.log("total_length:::", total_length);

      if (!addt) {
        new_users1 = [];
        new_users2 = [];
      }
      for (var i in g_users) {
        let ii = g_users[i];
        if (i < 3 && new_users1.length <= 2) {
          new_users1.push(ii);
        } else {
          new_users2.push(ii);
        }
      }
      console.log("new_user1::", new_users1);
      console.log("new_user2::", new_users2);

      for (var o in new_users2) {
        let oo = new_users2[o];
        g_all.push(oo);
      }
      setUsers(new_users1);

      setUsers2(new_users2);

      gu1 = result.data;

      if (gu1.next) {
        canGoNextu = true;

        goneNextu = false;

        shouldHandleScrollu = true;
      } else {
        shouldHandleScrollu = false;
        canGoNextu = false;
        goneNextu = true;
      }

      setFetching(false);
    }
  };

  return (
    <div className="containerSearch">
      <div class="search-div">
        <div className="search-input">
          <input
            type="search"
            class="search-field"
            placeholder="Type something..."
            name="search"
            value={search}
            onChange={(e) => {
              if (e.target.value.includes("#")) {
                alert("search must not contain the '#' symbol");
              } else setSearch(e.target.value);
            }}
          />
          <button onClick={() => setSearchb((u) => uuidv4())}>
            {fetching ? (
              "loading"
            ) : (
              <span class="material-icons-outlined">search</span>
            )}
          </button>
        </div>

        <div class="dropdown">
          <input class="text-box" type="text" placeholder="All" readonly />
          <div class="options">
            <div
              onClick={() => {
                // setCategory("All");
                category = "All";

                show("All");
                setMode("all");
              }}
            >
              All
            </div>
            <div
              onClick={() => {
                // setCategory("People");
                category = "People";
                show("People");
                setMode("users");
              }}
            >
              People
            </div>
            <div
              onClick={() => {
                // setCategory("Hashtags");
                category = "Hashtags";

                show("Posts/Hashtags");
                setMode("posts");
              }}
            >
              Posts/Hashtags
            </div>
          </div>
        </div>
      </div>
      <div className="search-results">
        {mode === "users" && (
          <div className="users-list">
            <></>
            <h4>Users</h4>

            {users &&
              users.map((item, key) => <UserDiv item={item} key={key} />)}
            {!fetching ? (
              <p> {users.length < 1 && "No users found"}</p>
            ) : (
              <div className="load-more">
                <span>loading</span>
              </div>
            )}
          </div>
        )}

        {mode === "users" && (
          <div className="users-list">
            {users2 &&
              users2.map((item, key) => <UserDiv item={item} key={key} />)}{" "}
            {!fetching ? (
              <>
                <p>
                  {shouldHandleScrollu ? (
                    <div className="load-more">
                      <span>loading</span>
                    </div>
                  ) : (
                    ""
                  )}
                </p>
              </>
            ) : (
              <div className="load-more">
                <span>loading</span>
              </div>
            )}
          </div>
        )}
        {mode === "posts" && (
          <div className="posts-list">
            <h4>Posts tags/captions</h4>
            {posts &&
              posts.map((item, key) => <PostDiv item={item} key={key} />)}
          </div>
        )}
        {mode === "posts" && (
          <div className="posts-list-2">
            {posts2 &&
              posts2.map((item, key) => <PostDiv item={item} key={key} />)}
            {!fetching ? (
              <>
                <p> {posts.length < 1 && "No posts found"}</p>
                <p>
                  {shouldHandleScrollp ? (
                    <div className="load-more">
                      <span>loading</span>
                    </div>
                  ) : (
                    ""
                  )}
                </p>
              </>
            ) : (
              <div className="load-more">
                <span>loading</span>
              </div>
            )}
          </div>
        )}

        {mode === "all" && (
          <>
            <div className="users-list">
              <h4>Users</h4>

              {users &&
                users.map((item, key) => <UserDiv item={item} key={key} />)}
              {!fetching ? (
                <p> {users.length < 1 && "No users found"}</p>
              ) : (
                <div className="load-more">
                  <span>loading</span>
                </div>
              )}
            </div>
            <div className="posts-list">
              <h4>Posts tags/captions</h4>
              {posts &&
                posts.map((item, key) => <PostDiv item={item} key={key} />)}
              {!fetching ? (
                <p> {posts.length < 1 && "No posts found"}</p>
              ) : (
                <div className="load-more">
                  <span>loading</span>
                </div>
              )}
            </div>
            <div>
              {all && all.map((item, key) => <AllDiv item={item} key={key} />)}
            </div>
            {shouldHandleScrollu || shouldHandleScrollp ? (
              <div className="load-more">
                <span>loading...</span>
              </div>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Search;

const UserDiv = (props) => {
  if (!props.item) return <></>;
  const item = props.item;
  return (
    <Link to={`/other-profile/` + item.user.username}>
      <div className="user" key={props.key}>
        <div className="pic">
          <img
            alt="image"
            src={
              LOCAL_CHECK ? item.user.user_picture : item.user.user_picture_url
            }
          />
        </div>
        <div className="username">
          <span>{item.user.username}</span>
          {item.user.verification_badge && (
            <span className="material-icons-round verification">verified</span>
          )}
        </div>
      </div>
    </Link>
  );
};

const PostDiv = (props) => {
  if (!props.item) return <></>;
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
          <Link
            to={`/new/${item.id}`}
            // target="_blank"
            // rel="noopener noreferrer"
          >
            <div className="user-post" key={props.key}>
              <div className="gallery-item" key={props.key}>
                {LOCAL_CHECK ? (
                  <img
                    src={!show_actual_img ? image.thumbnail : image.image}
                    alt=""
                  />
                ) : (
                  <img
                    src={
                      !show_actual_img ? image.thumbnail_url : image.image_url
                    }
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
            </div>
          </Link>
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
          <Link
            to={`/new/${item.id}`}
            // target="_blank"
            // rel="noopener noreferrer"
          >
            <div className="user-post">
              <div className="gallery-item" key={props.key}>
                <img
                  src={LOCAL_CHECK ? video.thumbnail : video.thumbnail_url}
                  className=""
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
            </div>
          </Link>
        </>
      );
    }
  }
};

const AllDiv = (props) => {
  if (!props.item) return <></>;
  const item = props.item;
  if (item.user) {
    return (
      <div className="users-list">
        <UserDiv item={item} key={props.key} />
      </div>
    );
  }
  if (item.author) {
    return (
      <div
        className="posts-list-2"
        // style={{ paddingLeft: 20 }}
      >
        <PostDiv item={item} key={props.key} />
      </div>
    );
  }
};
