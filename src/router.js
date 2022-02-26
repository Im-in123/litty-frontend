import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AuthController from "./customs/authController";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Main from "./components/Main";

import Header from "./components/Header";

import OtherProfile from "./components/ProfileComp/OtherProfile";
import MyProfile from "./components/ProfileComp/MyProfile";
import UserProfileUpdate from "./components/settings/UserprofileUpdate";
import Verify from "./components/Verify";
import PostCreate from "./components/Create/PostCreate";
import Search from "./components/Search/Search";
import ChatPage from "./components/chat/ChatPage";
import Notification from "./components/Notification/Notification";
import NewDetail from "./components/NewDetail/NewDetail";
import Settings from "./components/settings/settings";
import MyFollow from "./components/ProfileComp/MyFollow";
import OtherFollow from "./components/ProfileComp/OtherFollow";

const Router = (props) => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/signup" component={Signup} exact />
        <Route path="/login" component={Login} exact />

        <Route
          path="/"
          component={(props) => (
            <AuthController {...props}>
              <Route path="/" component={Main} exact />
              <Route path="/my-profile" component={MyProfile} exact />
              <Route
                path="/other-profile/:username"
                component={OtherProfile}
                exact
              />

              <Route
                path="/profile-update"
                component={UserProfileUpdate}
                exact
              />
              <Route path="/settings" component={Settings} exact />
              <Route path="/verify" component={Verify} exact />
              <Route path="/create" component={PostCreate} exact />
              <Route path="/search" component={Search} exact />
              <Route path="/notification" component={Notification} exact />
              <Route
                path="/chatpage/username=:username-timeout=:timeout"
                component={ChatPage}
                exact
              />
              <Route path="/myfollow/:option" component={MyFollow} exact />
              <Route
                path="/otherfollow/username=:username-option=:option"
                component={OtherFollow}
                exact
              />

              <Route path="/new/:id" component={NewDetail} exact />
            </AuthController>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
