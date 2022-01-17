import React, { useEffect, useState, useContext } from "react";
import { CHECK_FOLLOW, POST_DELETE, POST_URL, UPDATE_FOLLOW } from "../../urls";
import { axiosHandler, getToken } from "../../helper";
import { store } from "../../stateManagement/store";
import "./newDetail.css";
import "./newComment.css";
import NewComCard from "./NewComCard";
import { Link } from "react-router-dom";
import { UrlParser } from "../../customs/others";
import {
  BASE_URL,
  BASE_URL1,
  COMMENT_URL,
  LOCAL_CHECK,
  REPLY_URL,
  LIKE_URL,
  SAVED_URL,
} from "../../urls";
import {
  CommentTriggerAction,
  bogusTriggerAction,
  newReplyReplyAction,
  deleteCommentAction,
  activeChatUserAction,
} from "../../stateManagement/actions";
import NewVid from "./NewVid";
let post1 = [];

const NewDetail = (props) => {
  console.log("NewDetail props::", props);
  let post_id;
  let user;
  if (!props.post_id) {
    try {
      post_id = props.match.params.id;
    } catch (error) {}
  } else {
    post_id = props.post_id;
    user = props.user;
  }

  console.log("vars::", post_id, user);
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [post, setPost] = useState(false);

  const [isAuth, setIsAuth] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [likeIconStyle, setLikeIconStyle] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [actiontype, setActiontype] = useState("unlike");
  const [likesend, setLikeSend] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [edit, setEdit] = useState(false);
  const [tags, setTags] = useState(false);
  const [tagsEdited, setTagsEdited] = useState(false);

  const [caption, setCaption] = useState(false);
  const [captionEdit, setCaptionEdit] = useState(false);
  const [following, setFollowing] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(async () => {
    if (!post_id) return;

    await getPostDetail(post_id);
    await checkFollowHandler(user.id);
    const dropdowns = document.querySelectorAll(".dropdown-edit-new");
    for (let dropdown of dropdowns) {
      disclosure({
        el: dropdown,
        btn: ".summary-new",
      });
    }
    try {
      tagFunc();
    } catch (error) {
      console.log(error);
    }

    return () => {};
  }, [post_id]);

  useEffect(() => {
    console.log("props.closeeee::::", props.close);
    if (props.close) {
      try {
        var i;
        var slides = document.getElementsByClassName("mySlidesnew" + props.id);

        for (i = 0; i < slides.length; i++) {
          try {
            let sf = slides[i].children[1];
            sf.lastChild.pause();
          } catch (error) {}
        }
      } catch (error) {}
    }
    return () => {};
  }, [props.close]);

  function disclosure(params) {
    const el = params.el;
    const btn = el.querySelector(params.btn || "summary-new");
    const clicktouch =
      "ontouchstart" in document.documentElement ? "touchstart" : "click";
    const clickOut = (e) => !el.contains(e.target) && close();
    const keyup = (e) => {
      !el.contains(document.activeElement) && close();
      if (e.key === "Escape") {
        btn.focus();
        close();
      }
    };
    const open = () => {
      btn.setAttribute("aria-expanded", true);
      document.addEventListener("keyup", keyup);
      window.addEventListener(clicktouch, clickOut);
      if (typeof params.onopen === "function") params.onopen(el);
    };
    const close = () => {
      if (params.autoclose !== false) {
        btn.setAttribute("aria-expanded", false);
        document.removeEventListener("keyup", keyup);
        window.removeEventListener(clicktouch, clickOut);
        if (typeof params.onclose === "function") params.onclose(el);
      }
    };
    btn.onclick = (e) => {
      e.preventDefault();
      btn.getAttribute("aria-expanded") === "true" ? close() : open();
    };
  }

  const tagFunc = () => {
    let tags = [];
    const users = [
      "Ana",
      "Mariana",
      "Bere",
      "Carlos",
      "Juan",
      "Jorge",
      "Alyona",
      "Peter",
      "Kike",
      "Ursula",
    ];
    const inputTags = document.querySelector(".input-tags");
    const tagsContainer = document.querySelector(".tags");
    const tagsDrop = document.querySelector(".tags-drop");
    const tagListItems = document.querySelectorAll(".tags-drop__item");
    let usersList = [...tagListItems].map((user) => user.textContent);
    const tagnum = document.querySelector("#tagnum");
    inputTags.addEventListener("input", (e) => {
      if (tags.length >= 10) return;
      const newTag = sanitizeNewTag(inputTags.textContent);
      popupList(inputTags.textContent);
      if (!newTag) return;
      addTag(newTag);
      inputTags.textContent = "";
    });

    tagsContainer.addEventListener("click", (e) => {
      if (!e.target.matches(".tag")) {
        //inputTags.textContent = '';
        return;
      }
      e.target.remove();
      tags = tags.filter((tag) => tag !== e.target.textContent.slice(0, -2));
      tagnum.textContent = 10 - tags.length;

      console.log("removed tags::", tags);
      setTagsEdited(tags);
    });

    const sanitizeNewTag = (newTag) => {
      const lastChar = newTag.slice(-1);
      const tag = newTag.slice(0, -1).trim().toLowerCase();
      return lastChar === "," && tag !== "" ? tag : false;
    };

    const addTag = (tagToAdd) => {
      if (tags.includes(tagToAdd)) return;

      const tag = document.createElement("SPAN");
      tag.setAttribute("class", "tag");
      // const x = document.createElement("SPAN");
      // x.setAttribute("class", "x");
      // x.innerHTML = "&times;";
      tag.innerHTML = `${tagToAdd} &times;`;
      // tag.innerHTML = `${tagToAdd} <span class='x'>&times;<span>`;

      tags.push(tagToAdd);
      inputTags.insertAdjacentElement("beforebegin", tag);
      tagnum.textContent = 10 - tags.length;
      setTagsEdited(tags);
    };

    const popupList = (tagToCheck) => {
      tagsDrop.innerHTML = "";
      if (inputTags.textContent.trim() === "") return;
      const usersFiltered = users.filter((user) =>
        user.toLowerCase().includes(tagToCheck.toLowerCase())
      );

      if (usersFiltered.length === 0) return;
      console.log(usersFiltered);
      console.log("typing");
      const fragment = document.createDocumentFragment();
      usersFiltered.forEach((user) => {
        const li = document.createElement("LI");
        li.setAttribute("class", "tags-drop__item");
        li.setAttribute("tabindex", "0");
        li.textContent = user;
        fragment.appendChild(li);
      });
      tagsDrop.appendChild(fragment);
    };

    tagsDrop.addEventListener("click", (e) => {
      if (!e.target.matches(".tags-drop__item")) return;
      addTag(e.target.textContent);
      inputTags.textContent = "";
      tagsDrop.innerHTML = "";
      inputTags.focus();
    });
    tagsDrop.addEventListener("keypress", (e) => {
      if (!e.code === "Enter") return;
      addTag(e.target.textContent);
      inputTags.textContent = "";
      tagsDrop.innerHTML = "";
      inputTags.focus();
    });

    inputTags.addEventListener("dblclick", (e) => {
      const fragment = document.createDocumentFragment();
      users.forEach((user) => {
        const li = document.createElement("LI");
        li.setAttribute("class", "tags-drop__item");
        li.setAttribute("tabindex", "0");
        li.textContent = user;
        fragment.appendChild(li);
      });
      tagsDrop.appendChild(fragment);
    });
    document.addEventListener("keyup", (e) => {
      if (!e.code !== "Escape") return;
      console.log("pl");
    });
    console.log("tags::::::", post1.tags);
    let tagss = [];
    for (var i in post1.tags) {
      let t = post1.tags[i];
      tagss.push(t.title);
    }
    for (var i in tagss) {
      addTag(tagss[i]);
    }
  };
  const getPostDetail = async (id) => {
    setFetching(true);
    const token = await getToken();
    const res = await axiosHandler({
      method: "get",
      // url: POST_URL + props.match.params.id + "/",
      url: POST_URL + id + "/",

      token,
    }).catch((e) => {
      console.log("getPostDetail in NewDetail Error::::", e);
      setError(true);
    });

    if (res) {
      console.log("getPostDetail  NewDetail::::", res.data);
      post1 = res.data;
      setPost(res.data);
      if (res.data.author.username === userDetail.user.username) {
        setIsAuth(true);
      }
      if (!props.user) {
        user = res.data.author;
      }
      setCommentCount(res.data.comment_count);
      setLikeCount(res.data.like.length);
      await likeGet(res.data.like);
      for (var g in userDetail.saved) {
        if (userDetail.saved[g] === post_id) {
          setIsSaved(true);
        }
      }
      let tagss = [];
      for (var i in res.data.tags) {
        let t = res.data.tags[i];
        tagss.push(t.title);
      }
      setTags(tagss);
      // setTagsEdited(tagss);
      setCaption(res.data.caption);
      setCaptionEdit(res.data.caption);
      setError(false);
      setFetching(false);
    }
  };

  const likeGet = async (like) => {
    let isliked = null;
    try {
      for (var i in like) {
        let like1 = like[i];
        if (like1.user.username === userDetail.user.username) {
          isliked = like1.user.username;
          setActiontype("like");
          setIsLiked(true);
          break;
        } else {
          isliked = null;
          setActiontype("unlike");
          setIsLiked(false);
        }
      }
    } catch (error) {
      console.log("likeeeeeeeee error:::::::", error);
      isliked = null;
      setActiontype("unlike");
    }
    setLikeIconStyle(isliked ? "fas" : "far");
  };

  const likeHandler = async (e) => {
    setIsLiked(!isLiked);

    if (isLiked) {
      if (likeCount === 0 || likeCount === null) {
        setLikeCount(null);
      } else setLikeCount(likeCount - 1);
    } else if (!isLiked) {
      setLikeCount(likeCount + 1);
    } else {
      alert("unknown actiontype:::", actiontype);
    }

    if (likesend) {
      return;
    }
    setLikeSend(true);
    let like_data = { post_id: post_id };
    const token = await getToken();
    const result = await axiosHandler({
      method: "post",
      url: LIKE_URL,
      token,
      data: like_data,
    }).catch((e) => {
      console.log("SendLike error::::", e);
    });

    if (result) {
      console.log("SendLike results::::", result.data);
      let res = result.data;
      if (res.data === "success-added") {
        setIsLiked(true);
      } else if (res.data === "success-removed") {
        setIsLiked(false);
      } else {
        console.log("needs checking");
      }
    }

    setLikeSend(false);
  };
  const saveHandler = async (e) => {
    setIsSaved(!isSaved);

    let save_data = { post_id: post_id, user_id: userDetail.user.id };
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
      console.log("Save results::::", result.data);
      let res = result.data;
      if (res.success === "added") {
        setIsSaved(true);
      }
      if (res.success === "removed") {
        setIsSaved(false);
      }
    }
  };

  const onChange = (e) => {
    setCaptionEdit(e.target.value);
  };
  const submitEditing = async (e) => {
    e.preventDefault();
    if (!captionEdit) return;
    setBtnLoading(true);
    const token = await getToken();
    const data = { post_id: post_id, caption: captionEdit, tags: tagsEdited };
    console.log("check update data::::", data);

    const res = await axiosHandler({
      method: "patch",
      url: POST_URL,
      data: data,
      token,
    }).catch((e) => {
      console.log(e);
    });

    if (res) {
      console.log("submit post editing result:::", res.data.data);
      let data = res.data.data;
      setCaption(data.caption);
      setCaptionEdit(data.caption);
      let tagss = [];
      for (var i in data.tags) {
        let t = data.tags[i];
        tagss.push(t.title);
      }
      setTags(tagss);
      setTagsEdited(tagss);
    }
    setBtnLoading(false);
  };

  const checkFollowHandler = async (id) => {
    const token = await getToken();
    const data = { other_id: id };
    console.log("check followbefore data::::", data);

    const res = await axiosHandler({
      method: "post",
      url: CHECK_FOLLOW,
      data: data,
      token,
    }).catch((e) => {
      console.log(e);
    });

    if (res) {
      console.log("handleFollow:::", res.data);
      const rr1 = res.data["data"];
      console.log("rr2:::::", rr1);

      if (rr1 === "false") {
        setFollowing(false);
      } else if (rr1 === "true") {
        setFollowing(true);
      }
    }
  };

  const followHandler = async (id) => {
    setFollowing(!following);
    const token = await getToken();
    const data = { other_id: id };
    console.log("before data::::", data);

    const res = await axiosHandler({
      method: "post",
      url: UPDATE_FOLLOW,
      data: data,
      token,
    }).catch((e) => {
      console.log(e);
    });

    if (res) {
      console.log("handleFollow:::", res.data);
      const rr1 = res.data["data"];
      console.log("rr2:::::", rr1);

      if (rr1 === "unfollowed") {
        setFollowing(false);
      } else if (rr1 === "followed") {
        setFollowing(true);
      }
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const token = await getToken();
    const data = { author_id: userDetail.user.id, post_id: id };
    const res = await axiosHandler({
      method: "DELETE",
      url: POST_URL + post_id + "/",
      data,
      token,
    }).catch((e) => {
      console.log("Error in Delete post::::", e);
      alert("There was an error");
    });

    if (res) {
      console.log(" Delete post response::::", res.data);
      alert("Post deleted!");
      // if (props.refresh === true) {
      //   window.location.href = "/my-profile";
      // } else {
      //   let el = document.getElementById("post" + props.id);
      //   el.parentElement.removeChild(el);
      // }
    }
  };
  if (fetching) {
    return (
      <div className="wrapper-new">
        <div className="container-new">
          <article className="gallery-card-new">
            <section className="gallery-image-new">
              {error ? "An error occured, reload!" : "loading.."}
            </section>
            <section className="gallery-info-new"></section>
          </article>
        </div>
      </div>
    );
  }
  if (!fetching) {
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <div className="wrapper-new">
          <div className="container-new">
            <article className="gallery-card-new">
              {/* <button className="close-new">
                <i className="fa fa-times"></i>
              </button> */}

              <section className="gallery-image-new">
                <ContentSlide image={post.image} video={post.video} />
              </section>
              <section className="gallery-info-new">
                {/* <h2 className="gallery-title-new">Sunday Lunch! 🍔</h2> */}
                <div className="gallery-over-new">
                  <div className="gallery-first-new">
                    <div className="gallery-author-new">
                      {isAuth ? (
                        <>
                          <img
                            src={
                              LOCAL_CHECK
                                ? post.author.user_picture
                                : post.author.user_picture_url
                            }
                            alt=""
                          />

                          <Link to={`/my-profile/`}>
                            {post.author.username}
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to={`/other-profile/` + post.author.username}>
                            <img
                              src={
                                LOCAL_CHECK
                                  ? post.author.user_picture
                                  : post.author.user_picture_url
                              }
                              alt=""
                            />
                          </Link>

                          <Link to={`/other-profile/` + post.author.username}>
                            {post.author.username}
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="gallery-follow">
                      {!isAuth && (
                        <>
                          {following ? (
                            <span onClick={() => followHandler(user.id)}>
                              <i className="fas fa-user-friends profile-icons"></i>
                            </span>
                          ) : (
                            <span onClick={() => followHandler(user.id)}>
                              <i className="fas fa-plus profile-icons"></i>
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="drop-parent-new">
                    <div className="gallery-saved" onClick={saveHandler}>
                      {isSaved ? (
                        <i class="fas fa-bookmark"></i>
                      ) : (
                        <i class="far fa-bookmark"></i>
                      )}
                    </div>
                    <div className="dm-new">
                      {!isAuth && (
                        <div>
                          <Link
                            to={`/chatpage/username=${post.author.username}-timeout=${post.author.id}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#FFFFFF"
                            >
                              <path d="M0 0h24v24H0z" fill="none" />
                              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="dropdown-edit-new">
                      <button
                        className="summary-new"
                        aria-expanded="false"
                        aria-controls="mypanel-new"
                        aria-label="Accessibility parameters"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                          fill="#FFFFFF"
                          onMouseOver={(e) =>
                            (e.target.style.cursor = "pointer")
                          }
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>
                      <div className="panel-new" id="mypanel-new">
                        {userDetail.user.username === post.author.username && (
                          <li
                            onClick={() => {
                              let qs = document.querySelector(".gallery-edit");
                              qs.style.display = "flex";
                            }}
                          >
                            {" "}
                            <a href="#">Edit</a>
                          </li>
                        )}

                        <li>
                          <a href="#">share</a>
                        </li>

                        {userDetail.user.username === post.author.username && (
                          <li
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(post_id);
                            }}
                          >
                            <a href="#">Delete</a>
                          </li>
                        )}

                        {userDetail.user.username !== post.author.username && (
                          <li>
                            <a href="#">Block posts from this user</a>
                          </li>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="gallery-descr-new">{caption}</p>

                <div className="gallery-actions-new">
                  <span onClick={likeHandler}>
                    {isLiked ? (
                      <i className="fas fa-heart icon-size"></i>
                    ) : (
                      <i className="far fa-heart icon-size"></i>
                    )}
                    &nbsp; {likeCount && likeCount}
                  </span>
                  <span>
                    <i className="fa fa-comment icon-size-comment"></i>&nbsp;
                    &nbsp; {commentCount}
                  </span>
                </div>

                <div className="gallery-tags-new">
                  {tags.map((item, key) => (
                    <a href="#" key={key}>
                      #{item}
                    </a>
                  ))}
                </div>

                <div className="gallery-edit">
                  <span
                    className="close"
                    onClick={() => {
                      let qs = document.querySelector(".gallery-edit");
                      qs.style.display = "none";
                    }}
                  >
                    {" "}
                    &times;
                  </span>

                  <form onSubmit={submitEditing}>
                    <div className="form-content">
                      <div className="edit-caption">
                        <span className="spanny">Edit caption</span>
                        <textarea
                          maxLength="100"
                          name="caption"
                          placeholder="type a caption"
                          value={captionEdit}
                          onChange={onChange}
                          required={true}
                        ></textarea>
                        <span className="spanny">
                          {captionEdit.length ? captionEdit.length : 0}/100
                        </span>
                      </div>
                      <hr />
                      <div
                        className="tag-wrapper"
                        onMouseOver={() => {
                          let qs = document.querySelector(".input-tags");
                          qs.focus();
                        }}
                      >
                        <div>
                          <span className="spanny">
                            If you want add a new hashtag, write something and
                            end it with a comma. Click on a tagname to remove
                            it.
                          </span>
                        </div>
                        <div className="tags">
                          <span className="input-tags" contentEditable></span>
                          {/* <span className="input-tags" contenteditable></span> */}
                          <ul className="tags-drop active"></ul>
                        </div>
                        <span className="spanny">
                          <span id="tagnum"></span> &nbsp; hashtags left
                        </span>
                      </div>
                    </div>
                    <hr />
                    <button
                      onClick={(e) => submitEditing(e)}
                      disabled={btnLoading}
                    >
                      {btnLoading ? "updating" : "update"}
                    </button>
                  </form>
                </div>

                <hr />
                <ContentLoadComment
                  id={post_id}
                  setCommentCount={setCommentCount}
                  commentCount={commentCount}
                  close={props.close}
                />
              </section>
            </article>
          </div>
        </div>
      </div>
    );
  }
};

export default NewDetail;

const ContentSlide = (props) => {
  var slideIndex = 1;

  useEffect(() => {
    try {
      showSlides(slideIndex);
    } catch (error) {
      console.log("showslides error:::", error);
    }
    return () => {};
  }, []);

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

  function showSlides(n) {
    var i;

    var slides = document.getElementsByClassName("mySlidesnew" + props.id);
    var dots = document.getElementsByClassName("dotnew" + props.id);
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      try {
        // console.log("slide:::", slides[i]);
        // console.log("childnode:::", slides[i].childNodes);
        // console.log("children:::", slides[i].children);
        let sf = slides[i].children[1];
        // console.log("slidefinal:::", sf.lastChild);
        sf.lastChild.pause();
      } catch (error) {}
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active-new", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active-new";
    try {
      let sl = slides[slideIndex - 1].children[1].lastChild;
      console.log("second slide video::", sl);
      sl.play();
    } catch (error) {}
  }
  let whole_post_content = [];

  if (props.image) {
    for (let i in props.image) {
      whole_post_content.push(props.image[i]);
    }
  }
  if (props.video) {
    for (let i in props.video) {
      whole_post_content.push(props.video[i]);
    }
  }
  console.log("whole_post_content:", whole_post_content);
  let showcount = false;
  let count = whole_post_content.length;
  if (count > 1) {
    showcount = true;
  }
  return (
    <div
      className="post-content-new"
      style={{ borderBottom: showcount && "1px solid whitesmoke" }}
    >
      <div
        className="slideshow-container-new"
        style={{ height: !showcount && "100%" }}
      >
        {whole_post_content.map((item, key) => (
          <div className={`fade-new mySlides-new mySlidesnew${props.id}`}>
            <div className="numbertext-new">
              <div id={`numbertext-new${item.id}`}>
                {" "}
                {showcount && (
                  <>
                    {key + 1} / {showcount && count}
                  </>
                )}
              </div>
            </div>

            {item.image && (
              <img
                src={LOCAL_CHECK ? item.image : item.image_url}
                alt=""
                className="iimm-new"
              />
            )}
            {item.video && (
              <NewVid
                video={LOCAL_CHECK ? item.video : item.video_url}
                id={`vid${item.id}`}
                nid={item.id}
                cover={LOCAL_CHECK ? item.thumbnail : item.thumbnail_url}
              />
            )}

            <div className="text-new">{showcount && <>slide show</>}</div>
          </div>
        ))}

        {showcount && (
          <>
            <a className="prev-new" onClick={(e) => plusSlides(-1)}>
              ❮
            </a>
            <a className="next-new" onClick={(e) => plusSlides(1)}>
              ❯
            </a>
          </>
        )}
      </div>
      <br />
      <div style={{ textAlign: "center" }}>
        {showcount && (
          <>
            {whole_post_content.map((item, key) => (
              <span
                className={`dot-new dotnew${props.id}`}
                onClick={(e) => currentSlide(key + 1)}
              ></span>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const ContentLoadComment = (props) => {
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
  const {
    state: { delComment },
  } = useContext(store);
  const [fetching, setFetching] = useState(true);
  const [commentList, setCommentList] = useState([]);
  const [commentData, setCommentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentComment, setCurrentComment] = useState(false);
  const [placeholder, setPlaceholder] = useState("Say something nice..");
  const [moreCmts, setMoreCmts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextMsgs, setNextMsgs] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (props.id) getComments(props.id);

    return () => {};
  }, [props.id]);
  useEffect(() => {
    if (currentComment) {
      setCommentList([...commentList, currentComment]);
      scrollToBottom(props.id);
      // alert("scrolled to bottom");
      props.setCommentCount(props.commentCount + 1);
      setCurrentComment(false);
    }
    return () => {};
  }, [currentComment]);

  useEffect(() => {
    try {
      setPlaceholder(bogus.placeholder);
      let pcont = document.getElementById("comment-input-new");
      pcont.style.background = "#edd2d6";
      pcont.focus();
    } catch (error) {
      try {
        let pcont = document.getElementById("comment-input-new");
        pcont.style.background = "#fafafa";
      } catch (error) {}
      setPlaceholder("Say something nice..");
    }
  }, [bogus]);

  useEffect(() => {
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

    return () => {};
  }, [delComment]);

  const scrollToBottom = (p) => {
    setTimeout(() => {
      try {
        let chatArea = document.getElementById("contenta" + p);
        chatArea.scrollTop = chatArea.scrollHeight;
      } catch (error) {
        console.log("scrolltobottom error:::currentcomment");
      }
    }, 300);
  };

  const getComments = async (id, page = null, next = false) => {
    setLoadingMore(true);
    setError(false);
    let url;
    if (!page) {
      url = COMMENT_URL + `?post_id=${id}`;
    } else {
      url = COMMENT_URL + `?post_id=${id}`;
    }
    if (next) {
      url = nextMsgs.next;
      console.log("nextMsgs:::", nextMsgs);
    } else {
    }
    const token = await getToken();
    const result = await axiosHandler({
      method: "get",
      url: url,
      token,
    }).catch((e) => {
      console.log("getComments error::::", e);
      setError(true);
    });

    if (result) {
      setNextMsgs((n) => result.data);
      console.log("getComments data::::", result.data);

      console.log("getComments results::::", result.data.results);
      if (result.data.next) {
        setMoreCmts(true);
      } else {
        setMoreCmts(false);
      }
      if (commentList.length > 0 && next) {
        setCommentList((cm) => [...cm, ...result.data.results]);
      } else {
        setCommentList((cm) => result.data.results);
      }
      setLoadingMore(false);
      setFetching(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentData.comment) return;
    setLoading(true);
    let bb;
    const token = await getToken();
    try {
      bb = bogus.type;
    } catch (error) {
      bb = false;
    }
    if (bb) {
      if (bogus.type === "comment-reply") {
        const rdata = {
          to_id: "null",
          comment_id: bogus.comment_id,
          comment: commentData.comment,
          author_id: userDetail.user.id,
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
          // props.setCurrentReply(replyResult.data);

          dispatch({ type: bogusTriggerAction, payload: null });

          dispatch({ type: CommentTriggerAction, payload: replyResult.data });
          setCommentData({ post_id: props.id });
        }
      } else if (bogus.type === "reply-reply") {
        const rrdata = {
          reply_id: bogus.reply_id,
          to_id: bogus.reply_id,
          comment: commentData.comment,
          author_id: userDetail.user.id,
          parent_id: bogus.parent_id,
          type: bogus.type,
        };
        console.log("reply-reply before send::::", rrdata);
        const replyReplyResult = await axiosHandler({
          method: "post",
          url: REPLY_URL,
          token,
          data: rrdata,
        }).catch((e) => {
          console.log("CommentReplyreplyPost error::::", e.response.data);
          setLoading(false);
        });
        if (replyReplyResult) {
          console.log("reply-reply results", replyReplyResult.data);
          // props.setCurrentReplyReply(replyReplyResult.data);
          dispatch({ type: bogusTriggerAction, payload: null });

          dispatch({
            type: newReplyReplyAction,
            payload: replyReplyResult.data,
          });
          setCommentData({ post_id: props.id });
          setLoading(false);
        }
      } else {
        alert("this error is critical!");
      }
    } else {
      setCommentData({
        ...commentData,
        post_id: props.id,
        author_id: userDetail.user.id,
      });
      console.log("comment data::::", commentData);
      //     console.log("postcomment:::", postComment)
      let data = {
        ...commentData,
        post_id: props.id,
        author_id: userDetail.user.id,
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
        setCurrentComment(result.data);
        setCommentData({ post_id: props.id });
      }
    }
  };

  const onChange = (e) => {
    setCommentData({
      ...commentData,
      [e.target.name]: e.target.value,
    });
  };
  if (fetching) {
    return (
      <div className="gallery-comments-new">
        comment(s)
        <div className="comment-add-new">
          <div className="com-sub-new">
            <form onSubmit={handleSubmit}>
              <input
                id="comment-input-new"
                autocomplete="off"
                name="comment"
                maxlength="60"
                placeholder={placeholder}
                value={commentData.comment || ""}
                onChange={onChange}
              />
              <button
                className="submit-button"
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "commenting" : "comment"}
              </button>
            </form>
          </div>
        </div>
        <div className="contenta">
          <span className="txt-white"> Loading....</span>
        </div>
      </div>
    );
  }
  if (!fetching) {
    return (
      <div className="gallery-comments-new">
        comment(s)
        <div className="comment-add-new">
          <div className="com-sub-new">
            <form onSubmit={handleSubmit}>
              <input
                id="comment-input-new"
                autocomplete="off"
                name="comment"
                maxlength="60"
                placeholder={placeholder}
                value={commentData.comment || ""}
                onChange={onChange}
              />
              <button
                className="submit-button"
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "commenting" : "comment"}
              </button>
            </form>
          </div>

          <span className="chars-counter">
            <span id="chars-current">
              {commentData.comment?.length ? commentData.comment.length : 0}
            </span>
            /60
          </span>
        </div>
        <div className="contenta" id={"contenta" + props.id}>
          {error ? (
            "An error occured., reload!"
          ) : (
            <>
              {commentList.map((item, key) => {
                return (
                  <NewComCard
                    post_id={props.id}
                    key={key}
                    data={item}
                    setCommentCount={props.setCommentCount}
                    commentCount={props.commentCount}
                  />
                );
              })}

              {commentList.length < 1 && (
                <span className="txt-white">No comments</span>
              )}
              {moreCmts && (
                <>
                  <div className="loadcoms">
                    {loadingMore ? (
                      <span>loading more...</span>
                    ) : (
                      <span onClick={() => getComments(props.id, null, true)}>
                        load more
                      </span>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
};
