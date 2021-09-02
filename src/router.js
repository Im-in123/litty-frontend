import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AuthController from "./customs/authController";
import Signup from "./components/Signup";
import Login from "./components/Login";
// import Application from "./components/other/Application";
import Main from "./components/Main";

import Header from "./components/Header";
import PostDetail from "./components/PostDetail";
import OtherProfile from "./components/OtherProfile";
import MyProfile from "./components/MyProfile";
import UserProfileUpdate from "./components/UserprofileUpdate";
import Verify from "./components/Verify";
import PostCreate from "./components/Create/PostCreate";
import Search from "./components/Search/Search";
import ChatPage from "./components/chat/ChatPage";
const Router = (props) => {
  return (
    
    <BrowserRouter>
    <Header/>
      <Switch>
      
        <Route path="/signup" component={Signup} exact />
        <Route path="/login" component={Login} exact />
        {/* <Route path="/other" component={Application} exact /> */}




        <Route
          path="/"
          component={(props) => (
            <AuthController {...props}>
                      <Route path="/" component={Main} exact />
                      <Route path="/my-profile" component={MyProfile} exact />
                      <Route path="/other-profile/:username" component={OtherProfile} exact />
                      <Route path="/post-detail/:id" component={PostDetail} exact />
                      <Route path="/profile-update" component={UserProfileUpdate} exact />
                      <Route path="/verify" component={Verify} exact />
                      <Route path="/create" component={PostCreate} exact />
                      <Route path="/search" component={Search} exact />
                      <Route path="/chatpage/:username" component={ChatPage} exact />



          </AuthController>
          )}
        />


      </Switch>
    </BrowserRouter>
  );
};

export default Router;
