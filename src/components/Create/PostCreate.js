import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./postcreate.css";
import { POST_URL } from "../../urls";
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import { postTriggerAction } from "../../stateManagement/actions";
let tags = [];
const PostCreate = (props) => {
  const [postData, setPostData] = useState({});
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const {
    state: { postTrigger },
  } = useContext(store);
  const [loading, setLoading] = useState(false);
  const [tagsEdited, setEditedTags] = useState([]);

  useEffect(() => {
    tagFunc();
    return () => {};
  }, []);

  const tagFunc = () => {
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
      const newTag = sanitizeNewTag(inputTags.textContent, e);
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
      setEditedTags(tags);
    });

    const sanitizeNewTag = (newTag, e) => {
      if (e.data === null) {
        const tagy = newTag.trim().toLowerCase();
        if (tagy !== "") {
          return tagy;
        } else {
          return false;
        }
      } else {
        const lastChar = newTag.slice(-1);
        const tag = newTag.slice(0, -1).trim().toLowerCase();
        return lastChar === "," && tag !== "" ? tag : false;
      }
    };

    const addTag = (tagToAdd) => {
      if (tags.includes(tagToAdd)) return;

      const tag = document.createElement("SPAN");
      tag.setAttribute("class", "tag");
      // const x = document.createElement("SPAN");
      // x.setAttribute("class", "x");
      // x.innerHTML = "&times;";
      tag.innerHTML = `#${tagToAdd}  &times;`;

      tags.push(tagToAdd);
      inputTags.insertAdjacentElement("beforebegin", tag);
      tagnum.textContent = 10 - tags.length;
      setEditedTags(tags);
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
  };
  const submit = async (e) => {
    setLoading(true);
    e.preventDefault();
    let image_video = document.querySelector("#add-image-video");
    let img_vid = image_video.files;

    const formData = new FormData();
    console.log("tagsEdited:::", tagsEdited);
    console.log("tags:::", tags);

    console.log("caption:::", postData.post);
    console.log("author_id:::", userDetail.user.id);
    console.log("image:::", image_video, img_vid);
    formData.append("author_id", userDetail.user.id);
    formData.append("caption", postData.post);
    formData.append("tags", tags);
    for (let i = 0; i < img_vid.length; i++) {
      if (img_vid[i].type.includes("image")) {
        formData.append("image", img_vid[i]);
      }
    }
    for (let i = 0; i < img_vid.length; i++) {
      if (img_vid[i].type.includes("video")) {
        formData.append("video", img_vid[i]);
      }
    }

    const token = await getToken();
    console.log("postcreate data:::", formData);
    const url = POST_URL;
    console.log("url::::", url);
    const method = "post";
    // return;
    const res = await axiosHandler({
      method,
      url,
      data: formData,
      token,
      headers: { "Content-Type": "multipart/form-data" },
    }).catch((e) => {
      console.log("res:::", e);
      alert("Bad internet connection. Try again!!");
      setLoading(false);
    });
    if (res) {
      console.log("create post data:::", res.data);
      setLoading(false);
      alert("created successfully!");
      setPostData({ post: "" });
      // tags = [];
      try {
        const tagels = document.querySelectorAll(".tag");
        console.log("tagels::::", tagels);

        for (var i in tagels) {
          let ii = tagels[i];
          console.log("ii:::", ii);
        }
      } catch (error) {
        console.log(error);
      }
      e.target.reset();
      dispatch({ type: postTriggerAction, payload: props.id });
      // window.location.href = "/my-profile";
    }
  };

  const onChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };
  const fileChange = (e) => {
    if (!e.target.files[0]) return;
    const fil = e.target.files[0];
    if (!postData.post) {
      setPostData({
        ...postData,
        post: fil.name.substring(0, 100),
      });
    }
  };

  return (
    <div className="widget-post" aria-labelledby="post-header-title">
      <div className="widget-post__header">
        <h2 className="widget-post__title" id="post-header-title">
          <i className="fa fa-pencil" aria-hidden="true"></i>
          Write caption
        </h2>
      </div>
      <form
        id="widget-form"
        className="widget-post__form"
        name="form"
        aria-label="post widget"
        onSubmit={submit}
      >
        <div className="widget-post__content">
          <label for="post-content" className="sr-only">
            share your moments
          </label>
          <textarea
            name="post"
            id="post-content"
            className="widget-post__textarea scroller"
            placeholder="share your moments..."
            value={postData.post}
            onChange={onChange}
            required={true}
            maxLength="100"
          ></textarea>
        </div>
        <div
          className="tag-wrapper"
          onMouseOver={() => {
            let qs = document.querySelector(".input-tags");
            qs.focus();
          }}
        >
          <div className="spanny-div">
            <span className="spanny">
              If you want add a new hashtag, write something and end it with a
              comma. Click on a hashtag to remove it.
            </span>
          </div>
          <div className="tags">
            <span className="input-tags" contentEditable></span>
            {/* <span className="input-tags" contenteditable></span> */}
            <ul className="tags-drop active"></ul>
          </div>
          <span className="spanny">
            <span id="tagnum">10</span> &nbsp; hashtags left
          </span>
        </div>
        <div className="widget-post__actions post--actions">
          <div className="post-actions__attachments">
            <button
              type="button"
              className="btn post-actions__upload attachments--btn"
            >
              <label for="upload-image" className="post-actions__label">
                <i className="fa fa-upload" aria-hidden="true"></i>
                add image/video
              </label>
            </button>
            <input
              type="file"
              id="add-image-video"
              accept="image/video*"
              multiple
              required={true}
              onChange={fileChange}
            />
          </div>
          <div className="post-actions__widget">
            <button type="submit" className="btn post-actions__publish">
              {loading ? "uploading..." : "post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
