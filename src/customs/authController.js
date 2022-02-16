import React, { useEffect, useState, useContext } from "react";
import { axiosHandler, getToken } from "../helper.js";
import { REFRESH_URL, ME_URL, LOGOUT_URL } from "../urls";
import { store } from "../stateManagement/store";
import {
  checkAllFollowAction,
  userDetailAction,
} from "../stateManagement/actions";
require("regenerator-runtime/runtime");

export const tokenName = "iHypetokenName";

export const logout = (props) => {
  if (localStorage.getItem(tokenName)) {
    axiosHandler({
      method: "get",
      url: LOGOUT_URL,
      token: getToken(),
    });
  }
  localStorage.removeItem(tokenName);
  //localStorage.removeItem(LastUserChat);
  window.location.href = "/login";
};

export const checkAuthState = async (setChecking, dispatch, props) => {
  console.log("props:::::", props);
  let token = localStorage.getItem(tokenName);
  if (!token) {
    // alert("no token");
    console.log("logging out");
    logout(props);
    return;
  }
  token = JSON.parse(token);
  console.log("getting user profile");
  const userProfile = await axiosHandler({
    method: "get",
    url: ME_URL,
    token: token.access,
  }).catch((e) => {
    console.log(e, "error on getting userprofile");
    if (e.response) {
      console.log("Request made and server responded");
      console.log("e response.data:::", e.response.data);
      console.log("e response,status:::", e.response.status);
      console.log(" response.headers:::", e.response.headers);
    } else if (e.request) {
      // The request was made but no response was received
      console.log("e request:::", e.request);
    }
  });
  if (userProfile) {
    console.log("got userprofile");
    console.log(userProfile.data, "userprofiledata..");
    dispatch({ type: userDetailAction, payload: userProfile.data });
    let pf = userProfile.data.following;
    let check = [];
    for (var i in pf) {
      let ii = pf[i];
      check.push({ user: ii.user.username, status: "yes" });
    }
    console.log("following check:::::", check);
    dispatch({
      type: checkAllFollowAction,
      payload: check,
    });
    setChecking(false);
    return;
  }
  console.log("token.refresh::", token.refresh);
  // alert("getting bew access with refresh token");
  const getNewAccess = await axiosHandler({
    method: "post",
    url: REFRESH_URL,
    data: {
      refresh: token.refresh,
    },
  }).catch((e) => {
    console.log(e, "error on getting new access");
    if (e.response) {
      console.log("Request made and server responded");
      console.log("e response.data2:::", e.response.data);
      console.log("e response,status2:::", e.response.status);
      console.log(" response.headers2:::", e.response.headers);

      if (
        e.response.data.error === "Token is invalid or has expired" ||
        e.response.data.error === "refresh token not found"
      ) {
        // alert("logout1");
        logout(props);
      }
    } else if (e.request) {
      // The request was made but no response was received
      console.log("e request2:::", e.request);
      console.log("sleeping...");
      setTimeout(() => {
        checkAuthState(setChecking, dispatch, props);
      }, 7000);
    }
  });

  if (getNewAccess) {
    console.log("got new access:::", getNewAccess.data);
    localStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
    checkAuthState(setChecking, dispatch, props);
  }
};

const AuthController = (props) => {
  const [checking, setChecking] = useState(true);

  const { dispatch } = useContext(store);

  useEffect(() => {
    checkAuthState(setChecking, dispatch, props);
  }, []);

  return (
    <div>
      {checking ? (
        <div className="AuthDiv">
          <p id="loader"></p>
        </div>
      ) : (
        props.children
      )}
    </div>
  );
};

export default AuthController;

export const fetchMyProfile = async (dispatch) => {
  let token = localStorage.getItem(tokenName);
  if (!token) {
    console.log("logging out");
    logout();
    return;
  }
  token = JSON.parse(token);
  console.log("getting user profile");
  const userProfile = await axiosHandler({
    method: "get",
    url: ME_URL,
    token: token.access,
  }).catch((e) => {
    console.log(e, "error on getting userprofile");
    if (e.response) {
      console.log("Request made and server responded");
      console.log("e response.data:::", e.response.data);
      console.log("e response,status:::", e.response.status);
      console.log(" response.headers:::", e.response.headers);
    } else if (e.request) {
      // The request was made but no response was received
      console.log("e request:::", e.request);
    }
  });
  if (userProfile) {
    console.log("got userprofile22");
    console.log(userProfile.data, "userprofiledata22..");
    dispatch({ type: userDetailAction, payload: userProfile.data });
    let pf = userProfile.data.following;
    let check = [];
    for (var i in pf) {
      let ii = pf[i];
      check.push({ user: ii.user.username, status: "yes" });
    }
    console.log("following check:::::", check);
    dispatch({
      type: checkAllFollowAction,
      payload: check,
    });
    return;
  }
  console.log("token.refresh::", token.refresh);
  const getNewAccess = await axiosHandler({
    method: "post",
    url: REFRESH_URL,
    data: {
      refresh: token.refresh,
    },
  }).catch((e) => {
    console.log(e, "error on getting new access");
    if (e.response) {
      console.log("Request made and server responded");
      console.log("e response.data2:::", e.response.data);
      console.log("e response,status2:::", e.response.status);
      console.log(" response.headers2:::", e.response.headers);

      if (
        e.response.data.error === "Token is invalid or has expired" ||
        e.response.data.error === "refresh token not found"
      ) {
        logout();
      }
    } else if (e.request) {
      // The request was made but no response was received
      console.log("e request2:::", e.request);
    }
  });

  if (getNewAccess) {
    console.log("got new access:::", getNewAccess.data);
    localStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
  }
};
