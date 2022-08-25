import React, { useState } from "react";
import "./signup.css";
import { SIGNUP_URL } from "../urls";
import { loginRequest } from "./Login";
import { axiosHandler, errorHandler } from "../helper.js";
import { Link } from "react-router-dom";
import visibility from "../assets/visibility.svg";
import visibility_off from "../assets/visibility_off.svg";

const Signup = (props) => {
  const [signupData, setSignupData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState();

  const onSubmitSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSignupError(null);

    setLoading(true);
    //Send signup data to server
    const result = await axiosHandler({
      method: "post",
      url: SIGNUP_URL,
      data: signupData,
    }).catch((e) => {
      console.log(e);
      setSignupError(errorHandler(e));
      console.log(signupError);
    });

    if (result) {
      //if signup successful try to login with signup data
      await loginRequest(signupData, setSignupError, props);
    }
    setLoading(false);
  };

  const onChangeSignup = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="signupmain">
      <div className="main-container">
        <h1 className="titlels">Sign up</h1>
        <div className="errorHolder">
          {signupError && (
            <div>
              <div
                className="errordiv"
                dangerouslySetInnerHTML={{ __html: signupError }}
              />
              <img
                src="/images/close_white.svg"
                alt="X"
                onClick={() => setSignupError(null)}
              />
            </div>
          )}
        </div>
        <div className="main-container__content">
          <div className="content__inputs">
            <form className="content__input--form" onSubmit={onSubmitSignup}>
              <label htmlFor="First-name">
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={signupData.username}
                  onChange={onChangeSignup}
                  required
                />
              </label>

              <label htmlFor="email">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={signupData.email}
                  onChange={onChangeSignup}
                  required
                />
              </label>

              <label htmlFor="password">
                <input
                  placeholder="Password"
                  name="password"
                  type={!showSignupPassword ? "password" : "text"}
                  value={signupData.password}
                  onChange={onChangeSignup}
                  required
                />
                <p id="showhide">
                  {" "}
                  &nbsp; &nbsp;{" "}
                  <img
                    src={!showSignupPassword ? visibility : visibility_off}
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    alt="show/hide password"
                  />
                </p>
              </label>
              <button type="submit" className="button">
                {loading ? <span id="loadersignup"></span> : "Sign up"}
              </button>
            </form>
          </div>

          <div className="content__submit">
            <button type="button" className="button">
              Or
            </button>

            <div className="button google-button">
              <div className="google-button__google-icon"></div>
              <p className="no-select">Sign up with Google</p>
            </div>
            <div className="content__submit--line"></div>
            <p>
              Already have an account?
              <a href="/">
                <strong>
                  {" "}
                  <Link to="/login"> Login</Link>
                </strong>
              </a>
            </p>
            <div className="content__footer">
              <p>
                By clicking "Sign up" button above you agree to our
                <a href="/">
                  <strong> Terms of service</strong>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
