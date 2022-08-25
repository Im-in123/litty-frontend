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
  window.location.href = "/login";
};

export const checkAuthState = async (setChecking, dispatch, props) => {
  let token = localStorage.getItem(tokenName);
  if (!token) {
    logout(props);
    return;
  }
  token = JSON.parse(token);
  const userProfile = await axiosHandler({
    method: "get",
    url: ME_URL,
    token: token.access,
  }).catch((e) => {
    console.log(e, "error on getting userprofile");
    if (e.response) {
      // console.log("Request made and server responded");
    } else if (e.request) {
      // The request was made but no response was received
      // console.log("e request:::", e.request);
    }
  });
  if (userProfile) {
    dispatch({ type: userDetailAction, payload: userProfile.data });
    let pf = userProfile.data.following;
    let check = [];
    for (var i in pf) {
      let ii = pf[i];
      check.push({ user: ii.user.username, status: "yes" });
    }
    dispatch({
      type: checkAllFollowAction,
      payload: check,
    });
    setChecking(false);
    return;
  }
  const getNewAccess = await axiosHandler({
    method: "post",
    url: REFRESH_URL,
    data: {
      refresh: token.refresh,
    },
  }).catch((e) => {
    console.log(e, "error on getting new access");
    if (e.response) {
      // console.log("Request made and server responded");

      if (
        e.response.data.error === "Token is invalid or has expired" ||
        e.response.data.error === "refresh token not found"
      ) {
        logout(props);
      }
    } else if (e.request) {
      setTimeout(() => {
        checkAuthState(setChecking, dispatch, props);
      }, 7000);
    }
  });

  if (getNewAccess) {
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
    logout();
    return;
  }
  token = JSON.parse(token);
  const userProfile = await axiosHandler({
    method: "get",
    url: ME_URL,
    token: token.access,
  }).catch((e) => {
    console.log(e, "error on getting userprofile");
    if (e.response) {
    } else if (e.request) {
    }
  });
  if (userProfile) {
    dispatch({ type: userDetailAction, payload: userProfile.data });
    let pf = userProfile.data.following;
    let check = [];
    for (var i in pf) {
      let ii = pf[i];
      check.push({ user: ii.user.username, status: "yes" });
    }

    dispatch({
      type: checkAllFollowAction,
      payload: check,
    });
    return;
  }

  const getNewAccess = await axiosHandler({
    method: "post",
    url: REFRESH_URL,
    data: {
      refresh: token.refresh,
    },
  }).catch((e) => {
    console.log(e, "error on getting new access");
    if (e.response) {
      if (
        e.response.data.error === "Token is invalid or has expired" ||
        e.response.data.error === "refresh token not found"
      ) {
        logout();
      }
    } else if (e.request) {
    }
  });

  if (getNewAccess) {
    localStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
  }
};
