import React, { useEffect, useState } from "react";
import "./signup.css";
import { checkAuthState, tokenName } from "../customs/authController";
import { SIGNUP_URL, LOGIN_URL } from "../urls";
import { axiosHandler, errorHandler } from "../helper.js";
import { Link } from "react-router-dom";
import visibility from "../assets/visibility.svg";
import visibility_off from "../assets/visibility_off.svg";

export const loginRequest = async (data, setError, props) => {
  console.log("LoginRequestData:::::", data);
  const result = await axiosHandler({
    method: "post",
    url: LOGIN_URL,
    data: data,
  }).catch((e) => setError(errorHandler(e)));
  if (result) {
    console.log("Result::::::", result);
    localStorage.setItem(tokenName, JSON.stringify(result.data));

    props.history.push("/");
  }
};

const Login = (props) => {
  const [loginData, setLoginData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState();

  useEffect(() => {
    alert("Login with free account-> username:guest and password:guest");
  }, []);

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    console.log("SignUpData:::::", loginData);

    setLoading(true);
    const result = await axiosHandler({
      method: "post",
      url: LOGIN_URL,
      data: loginData,
    }).catch((e) => {
      console.log(e);
      setLoginError(errorHandler(e));
      console.log(loginError);
    });

    if (result) {
      console.log("result:::::", result);
      console.log("signupdata being passed to loginpage:::::::", loginData);
      await loginRequest(loginData, setLoginError, props);
    }
    setLoading(false);
  };

  const onChangeLogin = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="loginmain">
      <div className="main-container">
        <h1 className="titlels">Login</h1>
        <div className="errorHolder">
          {loginError && (
            <div>
              <div
                className="errordiv"
                dangerouslySetInnerHTML={{ __html: loginError }}
              />
              <img
                src="/images/close_white.svg"
                alt="X"
                onClick={() => setLoginError(null)}
              />
            </div>
          )}
        </div>
        <div className="main-container__content">
          <div className="content__inputs">
            <form className="content__input--form" onSubmit={onSubmitLogin}>
              <label htmlFor="First-name">
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={loginData.username}
                  onChange={onChangeLogin}
                  required
                />
              </label>

              <label htmlFor="password">
                <input
                  placeholder="Password"
                  name="password"
                  type={!showLoginPassword ? "password" : "text"}
                  value={loginData.password}
                  onChange={onChangeLogin}
                  required
                />
                <p id="showhide">
                  {" "}
                  &nbsp; &nbsp;{" "}
                  <img
                    src={!showLoginPassword ? visibility : visibility_off}
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    alt="show/hide password"
                  />
                </p>
              </label>
              <button type="submit" className="button">
                {loading ? <span id="loadersignup"></span> : "Login"}
              </button>
            </form>
          </div>

          <div className="content__submit">
            <button type="button" className="button">
              Or
            </button>

            <div className="button google-button">
              <div className="google-button__google-icon"></div>
              <p className="no-select">Login with Google</p>
            </div>
            <div className="content__submit--line"></div>
            <p>
              Dont have an account?
              <a href="/">
                <strong>
                  {" "}
                  <Link to="/signup"> Sign up</Link>
                </strong>
              </a>
            </p>
            <div className="content__footer">
              <p>
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

export default Login;
