import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { store } from "../stateManagement/store";
import { POST_DELETE, LOCAL_CHECK, UPDATE_FOLLOW, CHECK_FOLLOW } from "../urls";
import { axiosHandler, getToken } from "../helper";
import { checkAllFollowAction } from "../stateManagement/actions";

const UserInfo = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const {
    state: { checkAllFollow },
  } = useContext(store);
  const [plink, setPlink] = useState("");
  const [loading, setLoading] = useState("true");
  const [following, setFollowing] = useState(false);
  let check = checkAllFollow;

  useEffect(async () => {
    await checkname();
    const dropdowns = document.querySelectorAll(".dropdown-edit");
    for (let dropdown of dropdowns) {
      disclosure({
        el: dropdown,
        btn: ".summary",
      });
    }
    if (props.data) {
      // await checkFollowHandler(props.data.id);
    }
    return () => {};
  }, [props.data]);

  useEffect(() => {
    // console.log("checkAllFollow::::", checkAllFollow);
    // console.log("check::::", check);
    if (!props.data) return;
    for (var i in checkAllFollow) {
      console.log("checkAllFollow:::", checkAllFollow);
      let ii = check[i];
      if (ii.user === props.data.username) {
        if (ii.status === "yes") {
          setFollowing(true);
          return;
        } else {
          setFollowing(false);
          return;
        }
      }
    }

    return () => {};
  }, [checkAllFollow]);
  function disclosure(params) {
    const el = params.el;
    const btn = el.querySelector(params.btn || "summary");
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

  /**/

  const checkname = async () => {
    if (props.data) {
      if (userDetail.user.username === props.data.username) {
        setPlink(`/my-profile/`);
      } else {
        setPlink(`/other-profile/` + props.data.username);
      }
      setLoading(false);
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
        check = checkAllFollow.filter((e) => e.user !== props.data.username);
        check.push({ user: props.data.username, status: "no" });
        dispatch({
          type: checkAllFollowAction,
          payload: check,
        });
      } else if (rr1 === "followed") {
        setFollowing(true);

        check = checkAllFollow.filter((e) => e.user !== props.data.username);
        check.push({ user: props.data.username, status: "yes" });
        dispatch({
          type: checkAllFollowAction,
          payload: check,
        });
      }
    }
  };
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const token = await getToken();
    const data = { author_id: userDetail.user.id, post_id: props.id };
    const res = await axiosHandler({
      method: "POST",
      url: POST_DELETE,
      data,
      token,
    }).catch((e) => {
      console.log("Error in Delete post::::", e);
      alert("There was an error");
    });

    if (res) {
      console.log(" Delete post response::::", res.data);
      alert("Post deleted!");
      if (props.refresh === true) {
        window.location.href = "/my-profile";
      } else {
        let el = document.getElementById("post" + props.id);
        el.parentElement.removeChild(el);
      }
    }
  };
  if (loading) {
    return (
      <div className="user-info">
        <div className="user-avatar">
          <img src="" alt=""></img>
        </div>

        <div className="user-data">
          <div className="username"></div>

          <div className="post-date"></div>
        </div>
      </div>
    );
  } else {
    if (props.data) {
      // console.log("UserInfo props:::", props.data)

      return (
        <div className="user-info">
          <div className="userdiv">
            <div className="user-avatar-div">
              <Link to={plink}>
                <div className="user-avatar">
                  <img
                    src={
                      LOCAL_CHECK
                        ? props.data.user_picture
                        : props.data.user_picture_url
                    }
                    alt="author"
                  ></img>
                </div>
              </Link>
            </div>
            <div className="user-data">
              {userDetail.user.username !== props.data.username && (
                <>
                  {following ? (
                    <span onClick={() => followHandler(props.data.id)}>
                      following <i className="fas fa-user-friends u-icons"></i>
                    </span>
                  ) : (
                    <span onClick={() => followHandler(props.data.id)}>
                      <i className="fas fa-plus u-icons"></i>
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="drop-parent">
            <div className="dm">
              <div>
                {userDetail.user.username !== props.data.username && (
                  <Link
                    to={`/chatpage/username=${props.data.username}-timeout=${props.data.id}`}
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
                )}
              </div>
            </div>
            <div className="dropdown-edit" onClick={(e) => {}}>
              <button
                className="summary"
                aria-expanded="false"
                aria-controls="mypanel"
                aria-label="Accessibility parameters"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
              <div className="panel" id="mypanel">
                {userDetail.user.username === props.data.username && (
                  <Link
                    to={`/new/${props.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    <li>Edit</li>{" "}
                  </Link>
                )}

                <li>
                  <a href="#">share</a>
                </li>

                {userDetail.user.username === props.data.username && (
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(props.id);
                    }}
                  >
                    <a href="#">Delete</a>
                  </li>
                )}

                {userDetail.user.username !== props.data.username && (
                  <li>
                    <a href="#">Block posts from this user</a>
                  </li>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return "";
    }
  }
};

export default UserInfo;
