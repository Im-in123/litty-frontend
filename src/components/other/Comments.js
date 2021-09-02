
 import React from "react";

 class Comments extends React.Component {
    render() {
       if (!this.props.comments.length || !this.props.isExpanded) return <div className="empty-comments"></div>;
 
       let commentsArr = this.props.comments.map((val, i) => {
          return (
             <div className="comment" key={i}>
                <div className="user-avatar">
                   <img src={val.avatar} alt="author avatar"></img>
                </div>
                <div className="user-data">
                   <div className="username">
                      <svg width={val.userLength} height="10">
                         <rect width="100%" height="100%" style={{ fill: "#dbdbdb" }} />
                      </svg>
                   </div>
 
                   <div className="comment-text">
                      {val.text}
                   </div>
                </div>
             </div>
          );
       });
 
       let hideButton = <div className="hide-comments-button">
          <a href="#" onClick={this.props.hideComment}>Hide comments</a>
       </div>
 
       return (
          <div className="comments-container">
             {this.props.isExpanded ? hideButton : ""}
             <div className="comments-wrapper">
                {commentsArr}
             </div>
          </div>
 
       );
    }
 }

 export default Comments;