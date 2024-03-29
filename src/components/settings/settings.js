import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Liked from "./Liked";
import Saved from "./Saved";
import "./settings.css";
const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [profile, setProfile] = useState(true);

  useEffect(() => {
    const hamburgerMenu = document.getElementById("hamburger-icon");
    const link = document.querySelectorAll(".link");
    // const closeBtn = document.getElementById("close");

    for (let i = 0; i < link.length; i++) {
      link[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
      });
    }

    // Menu
    hamburgerMenu.addEventListener("click", function () {
      const sidebar = document.getElementById("sidebars");
      sidebar.classList.toggle("toggle");
    });

    return () => {};
  }, []);
  //   close icon
  function closeNav() {
    const sidebar = document.getElementById("sidebars");
    sidebar.classList.toggle("toggle");
  }

  const switchView = (view) => {
    if (view === "liked") {
      setSaved(false);
      setProfile(false);

      setLiked(true);
    }
    if (view === "saved") {
      setProfile(false);
      setLiked(false);

      setSaved(true);
    }
    if (view === "profile") {
      setLiked(false);
      setSaved(false);

      setProfile(true);
    }
  };

  return (
    <>
      <div className="settings-main">
        <div class="hamburger-menu">
          <span class="material-icons-outlined" id="hamburger-icon">
            menu
          </span>
        </div>
        <div class="sidebar" id="sidebars">
          <div class="close-icon" id="close" onClick={() => closeNav()}>
            <span class="material-icons">close</span>{" "}
          </div>

          <ul class="links">
            {/* <li class="link active">
              <a href="#">
                <span class="material-icons-outlined icon">home</span> Home
              </a>
            </li> */}
            <li
              class="link active"
              onClick={() => {
                switchView("profile");
              }}
            >
              <a href="#">
                <span class="material-icons-outlined icon">settings</span>{" "}
                Profile Settings
              </a>
            </li>
            {/* <li class="link">
              <a href="#">
                <span class="material-icons-outlined icon">email</span>
                Messages
              </a>
            </li> */}
            {/* <li class="link">
              <a href="#">
                <span class="material-icons-outlined icon">notifications</span>
                Notification
              </a>
            </li> */}
            <li
              class="link"
              onClick={() => {
                switchView("saved");
              }}
            >
              <a href="#">
                <span class="material-icons-outlined icon">save</span>Saved
              </a>
            </li>
            <li
              class="link"
              onClick={() => {
                switchView("liked");
              }}
            >
              <a href="#">
                <span class="material-icons-outlined icon">
                  favorite_border
                </span>{" "}
                Liked{" "}
              </a>
            </li>
            {/* <li
              class="link"
              onClick={() => {
                switchView("profile_update");
              }}
            >
              <a href="#">
                <span class="material-icons-outlined icon">settings</span>{" "}
                Account Settings
              </a>
            </li> */}
          </ul>
        </div>
        <div className="settings-content">
          {liked && <Liked />}
          {saved && <Saved />}

          {profile && (
            <div className="profile-links">
              <Link to="/profile-update">Profile Update</Link>
              <Link to="/change-password">Change Password</Link>
              <Link to="/forgot-password">Forgot Password</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
