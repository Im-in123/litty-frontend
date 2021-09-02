import Axios from "axios";
import { logout, tokenName } from "./customs/authController";
import { ME_URL, REFRESH_URL } from "./urls";
 
export const axiosHandler = ({
  method = "",
  url = "",
  token = null,
  data = {},
  extra = null,
}) => {
  let methodType = method.toUpperCase();
  if (
    ["GET", "POST", "PATCH", "PUT", "DELETE"].includes(methodType) ||
    {}.toString(data) !== "[object Object]"
  ) {
    let axiosProps = { method: methodType, url, data };

    if (token) {
      console.log(token, "token")
      axiosProps.headers = { Authorization: `Bearer ${token}` };
    }
    if (extra) {
      console.log(extra,"extra")
      axiosProps.headers = { ...axiosProps.headers, ...extra };
    }
    return Axios(axiosProps);
  } else {
    alert(`method ${methodType} is not accepted or data is not an object`);
    console.log(`method ${methodType} is not accepted or data is not an object`);
  }
};

export const errorHandler = (err, defaulted = false) => {
  if (defaulted) {
    console.log("Ops!, an error occurred.");
    return "Ops!, an error occurred.";
  }

  let messageString = "";
  if (!err.response) {
    messageString += "Network error! check your network and try again";
  } else {
    let data = err.response.data.results;
    if (!err.response.data.results) {
      data = err.response.data;
    }
    messageString = loopObj(data);
  }
  return messageString.replace(/{|}|'|\[|\]/g, "");
};

const loopObj = (obj) => {
  let agg = "";
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      agg += `<div>${key}: ${
        typeof obj[key] === "object" ? loopObj(obj[key]) : obj[key]
      }</div>`;
    }
  }
  return agg;
};

export const getToken = async (props) => {
  let token = localStorage.getItem(tokenName);
  if (!token) logout(props);
  token = JSON.parse(token);
  const userProfile = await axiosHandler({
    method: "get",
    url: ME_URL,
    token: token.access,
  }).catch((e) =>{
    const userProfile = false;
    console.log(e)
  });
  if (userProfile) {
    return token.access;
  } else {
    const getNewAccess = await axiosHandler({
      method: "post",
      url: REFRESH_URL,
      data: {
        refresh: token.refresh,
      },
    }).catch((e) => null);
    if (getNewAccess) {
      localStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
      return getNewAccess.data.access;
    } else {
      logout(props);
    }
  }
};
