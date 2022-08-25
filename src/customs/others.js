import { BASE_URL1 } from "../urls";

export const VerifyFunc = async (userDetail) => {
  if (!userDetail.is_verified) {
    window.location.href = "/profile-update";
  }
  if (!userDetail.user.is_verified) {
    window.location.href = "/verify";
  }
};

export const UrlParser = (url) => {
  if (!url) return "";

  let url_str = url.substring(0, 4);
  if (url_str === "http") {
    return url;
  }

  let url_str2 = url.substring(0, 1);
  if (url_str2 === "/") {
    let new_url = BASE_URL1 + url;
    return new_url;
  }
};

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
