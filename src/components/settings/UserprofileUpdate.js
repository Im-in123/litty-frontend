import React, { useState, useContext, useEffect } from "react";
import { PROFILE_URL, PROFILE_PIC_URL } from "../../urls";
import { store } from "../../stateManagement/store";
import { axiosHandler, getToken } from "../../helper";
import "./userProfileUpdate.css";
import { userDetailAction } from "../../stateManagement/actions";

// let profileRef;

const UserProfileUpdate = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const [profileData, setProfileData] = useState({
    ...userDetail,
    user_id: userDetail.user.id,
    is_verified: true,
  });

  useEffect(() => {
    if (!userDetail.user.is_verified) {
      window.location.href = "/verify";
    }
  }, []);

  const propicSubmit = async (e) => {
    e.preventDefault();
    let data = new FormData();
    let pp = document.getElementById("propic");
    data.append("file_upload", pp.files[0]);
    data.append("user_id", userDetail.user.id);

    const token = await getToken();
    const method1 = "post";
    const result = await axiosHandler({
      method: method1,
      url: PROFILE_PIC_URL,
      token,
      data,
    }).catch((e) => console.log(e));

    if (result) {
      console.log();

      alert("Profile pic added. scroll down to save changes!!");
      setProfileData({ ...profileData, id: result.data.id });

      console.log(result.data);
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    const token = await getToken();

    if (userDetail.user.username === "guest") {
      alert("sorry, profile update is disabled for this account!");
      return;
    }
    let url =
      PROFILE_URL + `${userDetail.first_name ? `/${userDetail.id}` : ""}`;

    console.log("url::::", url);

    let method = userDetail.first_name ? "patch" : "post";
    if (method === "patch") {
      url = PROFILE_URL;
    }

    const profile = await axiosHandler({
      method,
      url,
      data: profileData,
      token,
    }).catch((e) => {
      console.log("res:::", e);
      alert(e);
    });
    if (profile) {
      dispatch({ type: userDetailAction, payload: profile.data });
      alert("Updated successfully!");
    }
  };

  const onChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="ProfileMain">
      <div className="container1">
        <form onSubmit={propicSubmit}>
          <h1 className="title">Modify your profile</h1>
          <label style={{ color: "white", margin: "4px" }} htmlFor="propic">
            upload pic
          </label>
          <input
            style={{ color: "blue", margin: "4px" }}
            type="file"
            required={true}
            id="propic"
          />
          <div className="button-container">
            <button className="buttonp" type="submit">
              Add profile picture
            </button>
          </div>
        </form>

        <form method="POST" onSubmit={submit}>
          <div className="form-group a">
            <label htmlFor="name">Username</label>
            <input
              id="name"
              type="text"
              value={
                userDetail.user.username +
                "    [NB:username cannot be modified!]"
              }
              disabled
            />
          </div>
          <div className="grid">
            <div className="form-group a">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={profileData.name}
                name="name"
                onChange={onChange}
                required={true}
              />
            </div>

            <div className="form-group b">
              <label htmlFor="first-name">First name</label>
              <input
                id="first-name"
                type="text"
                value={profileData.first_name}
                name="first_name"
                onChange={onChange}
                required={true}
              />
            </div>

            {/* <div className="form-group email-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="text"/>
    </div> */}

            <div className="form-group phone-group">
              <label htmlFor="phone">Telephone (mobile)</label>
              <input
                id="phone"
                type="text"
                value={profileData.phone_number}
                name="phone_number"
                onChange={onChange}
                required={true}
              />
            </div>

            <div className="textarea-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={profileData.bio}
                name="bio"
                onChange={onChange}
                required={true}
              ></textarea>
            </div>

            {/* <div className="form-group">
        <label htmlFor="address">Adress</label>
        <input id="address" type="text"/>
    </div> */}

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={profileData.city}
                name="city"
                onChange={onChange}
                required={true}
              />
            </div>

            {/* <div className="form-group">
        <label htmlFor="zip">Code postal</label>
        <input id="zip" type="text"/>
    </div> */}
          </div>

          <div className="button-container">
            <button className="button" type="submit">
              Save modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserProfileUpdate;
