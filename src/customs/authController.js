import React, { useEffect, useState, useContext } from "react";
import { axiosHandler, getToken } from "../helper.js";
import { REFRESH_URL, ME_URL, LOGOUT_URL } from "../urls";
import { store } from "../stateManagement/store";
import { userDetailAction } from "../stateManagement/actions";
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
   console.log("setchecking::::", setChecking)
   console.log("dispatch:::::", dispatch)
   console.log("props:::::", props)
  let token = localStorage.getItem(tokenName);
  if (!token) {
    console.log("logging out")
    logout(props);
    return;
  }
  token = JSON.parse(token);
  console.log("getting user profile")
  const userProfile = await axiosHandler({
    method: "get",
    url: ME_URL,
    token: token.access,
  }).catch((e) => {
    const userProfile = null;
    console.log(e, "error on getting userprofile")});
  if (userProfile) {
    console.log("got userprofile")
    console.log(userProfile.data,"userprofiledata..")
    dispatch({ type: userDetailAction, payload: userProfile.data });
    setChecking(false);
  
    
  } else {
    console.log("getting new access");
    const getNewAccess = await axiosHandler({
      method: "post",
      url: REFRESH_URL,
      data: {
        refresh: token.refresh,
      },  
    } 
    ).catch((e) => {
      const getNewAccess = null;
      console.log(e, "error on getting new access")
    });
    if (getNewAccess) {
      console.log("got new access:::", getNewAccess.data);
      localStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
      checkAuthState(setChecking, dispatch, props);
    } else {
      logout(props);
    }
  
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
