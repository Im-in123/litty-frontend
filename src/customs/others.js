
import React from "react";
import { store } from "../stateManagement/store";

export const VerifyFunc = async (userDetail) => {
  if(!userDetail.is_verified){
    window.location.href = "/profile-update";
  }
  if(!userDetail.user.is_verified){
    window.location.href = "/verify";
  }
 else{
    console.log("passing in VerifyFUnc")
  }
  };