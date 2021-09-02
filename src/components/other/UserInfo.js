import React from "react";


class UserInfo extends React.Component {
    render() {
       return (
          <div className="user-info">
 
             <div className="user-avatar">
                <img src={this.props.userAvatar} alt="author"></img>
             </div>
 
             <div className="user-data">
                <div className="username">
                   <svg width={this.props.username.toString()} height="10">
                      <rect width="100%" height="100%" style={{ fill: "#dbdbdb" }} />
                   </svg>
                </div>
 
                <div className="post-date">
                   {this.props.date}
                </div>
             </div>
 
          </div>
       );
    }
 }
 
 export default UserInfo;