import React from "react";

  
 class PostInfo extends React.Component {
    render() {
       let likeIconStyle = this.props.isLiked ? "fas" : "far";
       return (
          <div className="post-info">
             <div className="likes" onClick={this.props.likeHandler}>
                <a href="#">
                   <div className="icon"><i className={`${likeIconStyle} fa-heart`}></i></div>
                   <div className="count">{this.props.likes}</div>
                </a>
             </div>
             <div className="comments" onClick={this.props.showComments}>
                <a href="#">
                   <div className="icon"><i className="far fa-comment-alt"></i></div>
                   <div className="count">{this.props.commentsCount}</div>
                </a>
             </div>
             <div className="views">
                <div className="icon"><i className="fas fa-eye"></i></div>
                <div className="count">{this.props.views}</div>
             </div>
          </div>
       );
    }
 }

 export default PostInfo;