import React from "react";

class CommentInput extends React.Component {
    render() {
       return (
          <div className="comment-input">
             <div className="user-avatar">
                <img src="https://justmonk.github.io/react-news-feed-spa-demo/img/user-avatar.jpg" alt="user avatar"></img>
             </div>
             <form onSubmit={this.props.addCommentHandler}>
                <input name="text" type="text" maxLength="200" placeholder="Write you comment here"></input>
                <button className="submit-button" type="submit"></button>
             </form>
          </div>
       );
    }
 }

 export default CommentInput;