import React, { useState, useContext, useEffect } from "react";
import { store } from "../stateManagement/store";
import { SECONDARY_EMAIL_VERIFICATION } from "../urls";
import { axiosHandler, getToken } from "../helper";

const Verify = (props) => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);
  const [verified, setIsVerified] = useState(false);

  useEffect(() => {
    if (userDetail.user.is_verified) {
      setIsVerified(true);
      window.location.href = "/";
    } else {
      setIsVerified(false);
    }
  }, []);

  const requestEmailVerification = async () => {
    const token = await getToken();
    const res = await axiosHandler({
      method: "post",
      url: SECONDARY_EMAIL_VERIFICATION,
      token,
    }).catch((e) => {
      console.log("Error in Verify::::", e);
    });

    if (res) {
      let p = document.getElementById("p");
      let b = document.getElementById("b");

      alert("Request has been resent. Check your email!!");
      p.innerHTML =
        "Request has been resent, check your email.You can only request another one in 30 minutes!!";
      b.disabled = true;
    }
  };

  if (!verified) {
    return (
      <>
        <div className="" style={{ marginTop: "7vh" }}>
          <h4 className="">
            A verification link has been sent to your email address.
          </h4>
          <p id="p">Verify your account from your email address to continue!</p>
          <button id="b" onClick={(e) => requestEmailVerification()}>
            Request resend
          </button>
        </div>
      </>
    );
  }
  if (verified) {
    return (
      <div className="" style={{ marginTop: "7vh" }}>
        <h4 className="">Your account has successfully been verified!</h4>
      </div>
    );
  }
};

export default Verify;
