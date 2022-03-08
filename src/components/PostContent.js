import React, { useEffect, useState, useContext } from "react";
import { LOCAL_CHECK } from "../urls";
import "./carousel.css";
import "./vidcomp.css";
import { store } from "../stateManagement/store";

const PostContent = (props) => {
  const {
    state: { slideTrigger },
    dispatch,
  } = useContext(store);

  var slideIndex = 1;
  let alreadyPlaying = false;

  useEffect(() => {
    let index = 1;
    try {
      if (slideTrigger) {
        for (var i in slideTrigger) {
          let ti = slideTrigger[i];
          if (ti.id === props.id) {
            index = ti.num;
          }
        }
      }
    } catch (error) {}

    showSlides(index, false);

    try {
      window.addEventListener("scroll", postInView);
    } catch (error) {
      console.log("couldnt add event listener to window in post");
    }
    return () => {
      window.removeEventListener("scroll", postInView);
      console.log("removed event listener");
    };
  }, []);

  const plusSlides = async (n, rv = false, visible = true) => {
    return await showSlides((slideIndex += n), rv, visible);
  };

  const currentSlide = async (n, rv = false, visible = true) => {
    return await showSlides((slideIndex = n), rv, visible);
  };

  const showSlides = async (n, rv = false, visible = true) => {
    try {
      var i;

      var slides = document.getElementsByClassName("mySlidesget" + props.id);
      var dots = document.getElementsByClassName("dotget" + props.id);
      if (n > slides.length) {
        slideIndex = 1;
      }
      if (n < 1) {
        slideIndex = slides.length;
      }

      // console.log("slide.length:", slides.length);
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
      try {
        for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" active", "");
        }
      } catch (error) {}

      slides[slideIndex - 1].style.display = "block";

      if (rv) {
        try {
          let sl = slides[slideIndex - 1].children[1].lastChild;
          // console.log("second slide video::", sl);
          sl.currentTime = 0;
          sl.play();
          alreadyPlaying = true;
        } catch (error) {}
      }
      if (!visible) {
        try {
          let sl = slides[slideIndex - 1].children[1].lastChild;
          // console.log("second slide video::", sl);
          if (!sl.paused) sl.pause();
          alreadyPlaying = false;
        } catch (error) {
          console.log(error);
        }
      }

      try {
        dots[slideIndex - 1].className += " active";
      } catch (error) {}
      return slideIndex;
    } catch (error) {
      console.log(error);
    }
  };

  const postInView = async () => {
    try {
      // console.log("scrolling");
      const numt = document.querySelector("#feed" + props.id);

      let numb = numt.getBoundingClientRect();
      //   document.documentElement.clientHeight,

      if (numb.top >= -210 && numb.top <= 250) {
        // console.log("feed" + props.id + ": element is visible");

        if (alreadyPlaying) {
          // console.log("already playing");
          return;
        }

        let index = 1;
        try {
          if (slideTrigger) {
            for (var i in slideTrigger) {
              let ti = slideTrigger[i];
              if (ti.id === props.id) {
                index = ti.num;
              }
            }
          }
        } catch (error) {}
        if (index) {
          slideIndex = index;
        }
        let qs = slideTrigger.filter((e) => e.id === props.id);
        // console.log("qs::", qs);
        try {
          let yu = qs[qs.length - 1];
          // console.log("yu:::", yu);
          if (yu.num) slideIndex = yu.num;
        } catch (error) {}

        var b = await currentSlide(slideIndex, true);
        slideIndex = b;
      } else {
        if (!alreadyPlaying) return;
        let index = 1;
        try {
          if (slideTrigger) {
            for (var i in slideTrigger) {
              let ti = slideTrigger[i];
              if (ti.id === props.id) {
                index = ti.num;
              }
            }
          }
        } catch (error) {}
        if (index) {
          slideIndex = index;
        }
        let qs = slideTrigger.filter((e) => e.id === props.id);
        // console.log("qs::", qs);
        try {
          let yu = qs[qs.length - 1];
          // console.log("yu:::", yu);
          if (yu.num) slideIndex = yu.num;
        } catch (error) {}
        // console.log("element is not visible");
        slideIndex = await currentSlide(slideIndex, true, false);
      }
    } catch (error) {}
  };

  let whole_post_content = [];

  if (props) {
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
    let showcount = false;
    let count = whole_post_content.length;
    if (count > 1) {
      showcount = true;
    }

    return (
      <div className="post-content">
        <div
          className="slideshow-container"
          style={{ height: !showcount && "100%" }}
        >
          {whole_post_content.map((item, key) => (
            <div className={`fade mySlides mySlidesget${props.id}`} key={key}>
              <div className="numbertext">
                <div id={`numbertext${item.id}`}>
                  {" "}
                  {showcount && (
                    <>
                      {key + 1} / {showcount && count}
                    </>
                  )}
                </div>
              </div>

              {LOCAL_CHECK ? (
                <>
                  {item.image ? (
                    <img
                      src={LOCAL_CHECK ? item.image : item.image_url}
                      alt=""
                      loading="lazy"
                      className="iimm"
                      style={{ width: "100%" }}
                    />
                  ) : null}
                  {item.video ? (
                    <VideoComp
                      video={LOCAL_CHECK ? item.video : item.video_url}
                      id={`vid${item.id}`}
                      nid={item.id}
                      setOverallAudio={props.setOverallAudio}
                      overallAudio={props.overallAudio}
                      thumbnail={item.thumbnail}
                    />
                  ) : null}
                </>
              ) : (
                <>
                  {item.image_url ? (
                    <img
                      src={LOCAL_CHECK ? item.image : item.image_url}
                      alt=""
                      loading="lazy"
                      className="iimm"
                      style={{ width: "100%" }}
                    />
                  ) : null}
                  {item.video_url ? (
                    <VideoComp
                      video={LOCAL_CHECK ? item.video : item.video_url}
                      id={`vid${item.id}`}
                      nid={item.id}
                      setOverallAudio={props.setOverallAudio}
                      overallAudio={props.overallAudio}
                      thumbnail={item.thumbnail}
                    />
                  ) : null}
                </>
              )}

              <div className="text">{showcount && <>şlide şhöw</>}</div>
            </div>
          ))}

          {showcount && (
            <>
              <a
                className="prev"
                onClick={async (e) => {
                  var prev = await plusSlides(-1, true);

                  var g = slideTrigger;
                  g.push({ id: props.id, num: prev });
                }}
              >
                ❮
              </a>
              <a
                className="next"
                onClick={async (e) => {
                  var next = await plusSlides(1, true);

                  var g = slideTrigger;
                  g.push({ id: props.id, num: next });
                }}
              >
                ❯
              </a>
            </>
          )}
        </div>
        <div className="dots-div" style={{}}>
          {showcount && (
            <>
              {whole_post_content.map((item, key) => (
                <span
                  className={`dot dotget${props.id}`}
                  key={key}
                  onClick={(e) => currentSlide(key + 1, true)}
                ></span>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
};

export default PostContent;

const VideoComp = (props) => {
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
    // console.log("props.video", props.video);
    vidpop = document.querySelector("#vidpop" + props.id);
    popPlayBtn = document.querySelector(".pop-play" + props.id);
    spin = document.querySelector(".spin" + props.id);
    numbertext = document.querySelector("#numbertext" + props.nid);

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
      // console.log("waiting/buffering");
      togglePopupShow();
      toggleSpin();
    };
    video.onplaying = function () {
      // console.log("playing");
      togglePopupHide();
      toggleSpinHide();
    };
    video.onseeking = function () {
      // console.log("seeking");
    };
    video.onended = function () {
      // console.log("ended");
      playPause();
    };
    video.onpause = function () {
      // console.log("paused");
      toggleSpinHide();
      togglePopupShow();
    };
    video.onerror = (e) => {
      console.log("video error:::", e);
      console.log(video.error);
      // alert("video error");
      video.pause();
      // video.load();
      // video.play();
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
    console.log("second video:::", video);
    console.log("volumetrigger::", volumeTrigger);
    try {
      if (!volumeTrigger) {
        video.volume = 1;
        setVolume(true);
        props.setOverallAudio(true);
      } else {
        video.volume = 0;
        setVolume(false);
        props.setOverallAudio(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="vidcont">
      <div
        className="volume"
        style={{
          position: "absolute",
          right: "0px",
          top: 0,
          zIndex: 1,
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
        // poster={props.thumbnail ? props.thumbnail : ""}

        preload="none"
        // preload="metadata"
      ></video>
    </div>
  );
};
