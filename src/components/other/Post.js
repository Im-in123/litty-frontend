import React from "react";
import UserInfo from "./UserInfo";
import  PostContent from "./PostContent";
import PostInfo from "./PostInfo";
import Comments from "./Comments";
import CommentInput from "./CommentInput";

 class Post extends React.Component {
    constructor(props) {
       super(props);
       this.state = { commentsExpanded: true };
       this.showComments = this.showComments.bind(this);
       this.hideComment = this.hideComment.bind(this);
       this.addCommentDecorator = this.addCommentDecorator.bind(this);
    }
 
    showComments(e) {
       e.preventDefault();
       this.setState({ commentsExpanded: true });
    }
    hideComment(e) {
       e.preventDefault();
       this.setState({ commentsExpanded: false });
    }
 
    addCommentDecorator(e) {
       e.preventDefault();
       this.showComments(e);
       this.props.args.addCommentHandler(e);
    }

 
    render() {
       return (
          <div className="post" id={this.props.id}>
             <div className="post-wrapper">
                <div className="delete-button"><a href="#" title="Delete this from history" onClick={this.props.args.deleteHandler}><i className="far fa-window-close"></i></a></div>
                <UserInfo userAvatar={this.props.args.avatar} date={this.props.args.date} username={this.props.args.nameLength} />
                <PostContent content={this.props.args.img} />
                <PostInfo likes={this.props.args.likes} views={this.props.args.views} commentsCount={this.props.args.commentsCount} likeHandler={this.props.args.likeHandler} isLiked={this.props.args.isLiked} showComments={this.showComments} />
                <Comments comments={this.props.args.comments} isExpanded={this.state.commentsExpanded} hideComment={this.hideComment} />
                <CommentInput addCommentHandler={this.addCommentDecorator} />
             </div>
          </div>
       );
    }
 }

 export default Post;