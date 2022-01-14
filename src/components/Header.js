import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { store } from "../stateManagement/store";
import { BASE_URL, BASE_URL1, LOCAL_CHECK } from "../urls";
import { UrlParser } from "../customs/others";
import "./header.css";
const Header = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const {
    state: { bogus },
  } = useContext(store);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {};
  }, [userDetail]);

  if (loading) {
    return <>...</>;
  }
  return (
    <div id="header">
      <div className="fixed-header">
        <div className="content-wrapper header-content">
          <div className="app-title">
            {/* <div className="side-menu-button"><a href="#"><i className="fas fa-bars"></i></a></div> */}
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
                <Link to="/notification">
                  <img src="/images/notifications.svg" alt="notifications" />
                </Link>
              </div>
            </div>
          )}
          {userDetail && (
            <div className="header-right-side">
              <div className="header-info">
                <svg width="25" height="7">
                  <rect
                    width="100%"
                    height="100%"
                    style={{ fill: "#8075a4" }}
                  />
                </svg>
                <svg width="20" height="7" style={{ float: "right" }}>
                  <rect
                    width="100%"
                    height="100%"
                    style={{ fill: "#a4a4a4" }}
                  />
                </svg>
              </div>
              <Link to="/my-profile">
                {" "}
                <div className="user-avatar">
                  <img src={userDetail.profile_picture} alt="user-avatar"></img>
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
