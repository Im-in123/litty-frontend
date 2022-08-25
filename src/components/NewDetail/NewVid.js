import React, { useEffect, useState, useContext } from "react";

import { store } from "../../stateManagement/store";
import "./newVid.css";
const NewVid = (props) => {
  const {
    state: { volumeTrigger },
    dispatch,
  } = useContext(store);
  const [volume, setVolume] = useState(volumeTrigger);

  let video;
  let vidpop;
  let popPlayBtn;
  let spin;
  let numbertext;
  useEffect(() => {
    vidpop = document.querySelector("#vidpop" + props.id);
    popPlayBtn = document.querySelector(".pop-play" + props.id);
    spin = document.querySelector(".spin" + props.id);
    numbertext = document.querySelector("#numbertext-new" + props.nid);

    video = document.querySelector("#video" + props.id);

    spin.style.display = "none";
    video.addEventListener("timeupdate", timeUpdate);
    if (props.overallAudio) {
      video.volume = 1;
    } else {
      video.volume = 0;
    }
    video.onclick = () => {
      playPause();
    };
    video.onwaiting = function () {
      togglePopupShow();
      toggleSpin();
    };
    video.onplaying = function () {
      togglePopupHide();
      toggleSpinHide();
    };
    video.onseeking = function () {};
    video.onended = function () {
      playPause();
    };
    video.onpause = function () {
      toggleSpinHide();
      togglePopupShow();
    };
    video.onerror = (e) => {
      console.log(video.error);
    };

    popPlayBtn.onclick = () => {
      togglePopupHide();
      playPause();
    };
    spin.onclick = () => {
      playPause();
    };

    return () => {
      video.pause();
      window.removeEventListener("timeupdate", timeUpdate);
    };
  }, []);
  useEffect(() => {
    try {
      let video = document.querySelector("#video" + props.id);

      if (volumeTrigger) {
        video.volume = 1;
        setVolume(true);
      } else {
        video.volume = 0;
        setVolume(false);
      }
    } catch (error) {}
  }, [volumeTrigger]);

  const timeUpdate = () => {
    const totalSecondsRemaining = video.duration - video.currentTime;

    let timeCalc = secondsToTime(totalSecondsRemaining);

    let total = `${timeCalc.h ? pad2(timeCalc.h) + ":" : ""}${pad2(
      timeCalc.m
    )}:${pad2(timeCalc.s)}`;
    numbertext.textContent = total;
  };

  const playPause = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };
  const togglePopupShow = () => {
    vidpop.style.visibility = "visible";
    vidpop.style.opacity = 1;
  };
  const togglePopupHide = () => {
    vidpop.style.visibility = "hidden";
    vidpop.style.opacity = 0;
  };

  const toggleSpin = () => {
    popPlayBtn.style.display = "none";
    spin.style.display = "flex";
  };
  const toggleSpinHide = () => {
    spin.style.display = "none";
    popPlayBtn.style.display = "flex";
  };
  function secondsToTime(secs) {
    secs = Math.round(secs);
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }
  function pad2(s) {
    return s < 10 ? "0" + s : s;
  }
  const vol = () => {
    let video = document.querySelector("#video" + props.id);

    try {
      if (!volume) {
        video.volume = 1;
        setVolume(true);
      } else {
        video.volume = 0;
        setVolume(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="vidcont-new">
      <div
        className="volume"
        style={{
          position: "absolute",
          right: "0px",
          top: "11px",
          zIndex: 2,
        }}
        onMouseOver={(e) => (e.target.style.cursor = "pointer")}
      >
        {volume ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="full-volume"
            height="17px"
            viewBox="0 0 24 24"
            width="17px"
            fill="gray"
            onClick={() => {
              vol();
            }}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="muted"
            height="17px"
            viewBox="0 0 24 24"
            width="17px"
            fill="gray"
            onClick={() => {
              vol();
            }}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M4.34 2.93L2.93 4.34 7.29 8.7 7 9H3v6h4l5 5v-6.59l4.18 4.18c-.65.49-1.38.88-2.18 1.11v2.06c1.34-.3 2.57-.92 3.61-1.75l2.05 2.05 1.41-1.41L4.34 2.93zM10 15.17L7.83 13H5v-2h2.83l.88-.88L10 11.41v3.76zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8l-1.88 1.88L12 7.76zm4.5 8c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
          </svg>
        )}
      </div>
      <div className="vid-overlay" id={`vidpop${props.id}`}>
        <div className={`vidpopup vidpopup${props.id}`}>
          <div className="pop-btn-cont">
            <button className={`pop-play pop-play${props.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </button>
            <div className={`spin spin${props.id}`}>
              <span id="vloader"></span>
            </div>
          </div>
        </div>
      </div>
      <video
        id={`video${props.id}`}
        src={props.video}
        poster={props.cover}
        // autoPlay
        // controls
        preload="none"
        // preload="metadata"
        // style={{ width: "600px", height: "338px" }}
        // object-fit:fill, flex-shrink:0,
      ></video>
    </div>
  );
};
export default NewVid;
