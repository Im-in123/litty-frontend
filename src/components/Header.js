import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { store } from "../stateManagement/store";
import { LOCAL_CHECK, NOTIFICATION_COUNT_URL } from "../urls";

import "./header.css";
import { axiosHandler, getToken } from "../helper";
const Header = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);

  const [notiNum, setNotiNum] = useState(null);
  let itval;
  useEffect(() => {
    getNotification();
    autoNotification();
    return () => {
      clearInterval(itval);
    };
  }, [userDetail]);

  const autoNotification = () => {
    clearInterval(itval);

    itval = setInterval(() => {
      getNotification();
    }, 50000);
  };
  const getNotification = async () => {
    if (!userDetail) return;

    let extra = `?keyword=${"unread-count"}`;
    const token = await getToken();
    const gp = await axiosHandler({
      method: "get",
      url: `${NOTIFICATION_COUNT_URL}${extra}`,
      token,
    }).catch((e) => {
      console.log("Error in getNotification in header::::", e);
    });

    if (gp) {
      const noti = gp.data["unread-count"];
      if (noti !== 0) {
        setNotiNum(noti);
      } else {
        setNotiNum(null);
      }
    }
  };

  return (
    <div id="header">
      <div className="fixed-header">
        <div className="content-wrapper header-content">
          <div className="app-title">
            <div className="title">
              <a href="/">Litty</a>
            </div>
          </div>
          {userDetail && (
            <div className="navmenu">
              <div className="diva">
                <a href="/">
                  {" "}
                  <img src="/images/home-icon.svg" alt="home" />{" "}
                </a>
              </div>
              <div className="diva">
                {" "}
                <Link to="/search">
                  <img src="/images/search_white.svg" alt="discover" />
                </Link>
              </div>
              <div className="diva">
                <Link to="/create">
                  {" "}
                  <img src="/images/add_white.svg" alt="add" />{" "}
                </Link>
              </div>

              <div className="diva">
                <Link to="/notification" onClick={() => setNotiNum(null)}>
                  <img src="/images/notifications.svg" alt="notifications" />

                  {notiNum && (
                    <span className="notification-number">{notiNum}</span>
                  )}
                </Link>
              </div>
            </div>
          )}
          {userDetail && (
            <div className="header-right-side">
              <div className="header-info">
                <svg width="25" height="7">
                  <rect width="100%" height="100%" fill="whitesmoke" />
                </svg>
                <svg width="20" height="7" style={{ float: "right" }}>
                  <rect width="100%" height="100%" fill="whitesmoke" />
                </svg>
              </div>
              <Link to="/my-profile">
                {" "}
                <div className="user-avatar">
                  <img
                    src={
                      LOCAL_CHECK
                        ? userDetail.profile_picture
                        : userDetail.profile_picture_url
                    }
                    alt="user-avatar"
                  ></img>
                </div>
              </Link>
            </div>
          )}
          {!userDetail && (
            <div className="diva">
              <Link to="/signup">SIGNUP</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
