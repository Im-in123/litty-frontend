import React, { useEffect, useState, useContext } from "react";
import { store } from "../../stateManagement/store";

import { LOCAL_CHECK, UPDATE_FOLLOW } from "../../urls";
import "./myfollow.css";
import { Link } from "react-router-dom";
import { axiosHandler, getToken } from "../../helper";
import { fetchMyProfile } from "../../customs/authController";

const MyFollow = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const {
    state: { updateFollowTrigger },
  } = useContext(store);
  const option = props.match.params.option;
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    let followerL = userDetail;

    if (option === "followers") {
      followerL.followers.map(async (item, key) => {
        let user = item.user;
        await checkFollower(user);
      });
    }
    if (option === "following") {
    }
    console.log("changed userDetail::;", followerL.followers);
    if (option === "following") {
    }
    setFollowers(userDetail.followers);
    setFollowing(userDetail.following);
  }, []);

  const checkFollower = async (user) => {
    userDetail.following.map((item, key) => {
      let o_user = item.user;
      if (o_user.username === user.username) {
        user.u_follow_back = true;

        return true;
      } else {
        return false;
      }
    });
  };

  const followHandler = async (e, id) => {
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
      const r1 = res.data["data"];
      console.log("rr2:::::", r1);

      if (r1 === "unfollowed") {
        e.target.innerHTML = "Follow";
      } else if (r1 === "followed") {
        e.target.innerHTML = "Following";
      }
      await fetchMyProfile(dispatch);
    }
  };

  return (
    <div className="follow-main">
      <h1>My {option}</h1>
      {option === "followers" &&
        followers.map((item, key) => (
          <div className="item" key={key}>
            <div className="user">
              <Link to={`/other-profile/${item.user.username}`}>
                <img
                  src={
                    LOCAL_CHECK
                      ? item.user.user_picture
                      : item.user.user_picture_url
                  }
                  alt="user-pic"
                ></img>
                <div className="name">{item.user.username}</div>
              </Link>
            </div>

            <div className="option">
              <button onClick={(e) => followHandler(e, item.user.id)}>
                {item.user.u_follow_back ? "Following" : "Follow Back"}
              </button>
            </div>
          </div>
        ))}
      {option === "following" &&
        following.map((item, key) => (
          <div className="item" key={key}>
            <div className="user">
              <Link to={`/other-profile/${item.user.username}`}>
                <img
                  src={
                    LOCAL_CHECK
                      ? item.user.user_picture
                      : item.user.user_picture_url
                  }
                  alt="user-pic"
                ></img>
                <div className="name">{item.user.username}</div>
              </Link>
            </div>

            <div className="option">
              <button onClick={(e) => followHandler(e, item.user.id)}>
                Following
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MyFollow;
