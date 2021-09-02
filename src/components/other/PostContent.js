import React from "react";


class PostContent extends React.Component {
    render() {
       return (
          <div className="post-content">
             <img src={this.props.content} alt=""></img>
          </div>
       );
    }
 }
 
 export default PostContent;