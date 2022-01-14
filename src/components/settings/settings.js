import React, { useEffect } from "react";
import "./settings.css";
const Settings = () => {
  useEffect(() => {
    const hamburgerMenu = document.getElementById("hamburger-icon");
    const link = document.querySelectorAll(".link");
    const closeBtn = document.getElementById("close");

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
  return (
    <>
      {/* <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      /> */}
      <link
        href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"
        rel="stylesheet"
      />

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
            <li class="link active">
              <a href="#">
                <span class="material-icons-outlined icon">home</span> Home
              </a>
            </li>
            <li class="link">
              <a href="#">
                <span class="material-icons-outlined icon">email</span>
                Messages
              </a>
            </li>
            <li class="link">
              <a href="#">
                <span class="material-icons-outlined icon">notifications</span>
                Notification
              </a>
            </li>
            <li class="link">
              <a href="#">
                <span class="material-icons-outlined icon">save</span>Saved
              </a>
            </li>
            <li class="link">
              <a href="#">
                <span class="material-icons-outlined icon">
                  favorite_border
                </span>{" "}
                Liked{" "}
              </a>
            </li>
            <li class="link">
              <a href="#">
                <span class="material-icons-outlined icon">settings</span>{" "}
                Account Settings
              </a>
            </li>
          </ul>
        </div>
        <div>
          <span>Holla yall</span>
        </div>
      </div>
    </>
  );
};

export default Settings;
