import React, { useEffect, useState, useContext } from "react";
import { store } from "../../stateManagement/store";

import { LOCAL_CHECK, OTHER_PROFILE_URL, UPDATE_FOLLOW } from "../../urls";
import "./myfollow.css";
import { Link } from "react-router-dom";
import { axiosHandler, getToken } from "../../helper";
import { fetchMyProfile } from "../../customs/authController";

const OtherFollow = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const {
    state: { updateFollowTrigger },
  } = useContext(store);
  const { username, option } = props.match.params;
  const [otherUser, setOtherUser] = useState([]);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let extra = `?keyword=${username}`;
    getOtherProfile(extra);
  }, []);

  const checkFollower = async (user) => {
    userDetail.following.map((item, key) => {
      let o_user = item.user;
      if (o_user.username === user.username) {
        user.u_follow = true;

        return true;
      } else {
        return false;
      }
    });
  };

  const checkFollowing = async (user) => {
    userDetail.following.map((item, key) => {
      let o_user = item.user;
      if (o_user.username === user.username) {
        user.u_follow = true;

        return true;
      } else {
        return false;
      }
    });
  };
  const getOtherProfile = async (extra) => {
    const token = await getToken();
    const gp = await axiosHandler({
      method: "get",
      url: OTHER_PROFILE_URL + extra,
      token,
    }).catch((e) => {
      console.log("Error in otherfollow::::", e);
    });

    if (gp) {
      console.log(" otherfollow res::::", gp.data);
      setOtherUser(gp.data);
      let followerL = gp.data;

      if (option === "followers") {
        followerL.followers.map(async (item, key) => {
          let user = item.user;
          await checkFollower(user);
        });
      }
      if (option === "following") {
        followerL.following.map(async (item, key) => {
          let user = item.user;
          await checkFollowing(user);
        });
      }
      console.log("changed userDetail::;", followerL.followers);
      if (option === "following") {
      }
      setFollowers(followerL.followers);
      setFollowing(followerL.following);
    }
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
      {option === "following" && <h1>People {username} follows</h1>}
      {option === "followers" && <h1> {username}'s followers</h1>}
      {option === "followers" &&
        followers.map((item, key) => (
          <>
            {item.user.username === userDetail.user.username ? (
              <div className="item" key={key}>
                <Link to={`/my-profile/`}>
                  <div className="user">
                    <img
                      src={
                        LOCAL_CHECK
                          ? item.user.user_picture
                          : item.user.user_picture_url
                      }
                      alt="user-pic"
                    ></img>
                    <div className="name">{item.user.username}</div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="item" key={key}>
                <Link to={`/other-profile/${item.user.username}`}>
                  <div className="user">
                    <img
                      src={
                        LOCAL_CHECK
                          ? item.user.user_picture
                          : item.user.user_picture_url
                      }
                      alt="user-pic"
                    ></img>
                    <div className="name">{item.user.username}</div>
                  </div>
                </Link>
                <div className="option">
                  <button onClick={(e) => followHandler(e, item.user.id)}>
                    {item.user.u_follow ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            )}
          </>
        ))}
      {option === "following" &&
        following.map((item, key) => (
          <>
            {item.user.username === userDetail.user.username ? (
              <div className="item" key={key}>
                <Link to={`/my-profile/`}>
                  <div className="user">
                    <img
                      src={
                        LOCAL_CHECK
                          ? item.user.user_picture
                          : item.user.user_picture_url
                      }
                      alt="user-pic"
                    ></img>
                    <div className="name">{item.user.username}</div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="item" key={key}>
                <Link to={`/other-profile/${item.user.username}`}>
                  <div className="user">
                    <img
                      src={
                        LOCAL_CHECK
                          ? item.user.user_picture
                          : item.user.user_picture_url
                      }
                      alt="user-pic"
                    ></img>
                    <div className="name">{item.user.username}</div>
                  </div>
                </Link>
                <div className="option">
                  <button onClick={(e) => followHandler(e, item.user.id)}>
                    {item.user.u_follow ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            )}
          </>
        ))}
    </div>
  );
};

export default OtherFollow;
