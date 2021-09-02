import React from "react";
import PostWall from "./PostWall";
import Controls from "./Controls";

class Feed extends React.Component {
    constructor(props) {
       super(props);
       this.state = {
          autoUpdate: true,
          fixedScroll: true,
          fixedScrollTrigger: false,
          showOnlyLiked: false,
          clearOld: true,
          stopUpload: false,
 
          postsOnScreen: 0,
          totalPosts: 0
       }
       this.changeSettings = this.changeSettings.bind(this);
       this.changePostsCount = this.changePostsCount.bind(this);
       this.manualUpdateWall = this.manualUpdateWall.bind(this);
       this.fixedScrollHandler = this.fixedScrollHandler.bind(this);
    }
 
    componentDidMount() {
       //setting fixed scroll by default
       if (this.state.fixedScroll) {
          document.addEventListener('scroll', this.fixedScrollHandler);
       }
    }
 
    changeSettings(e) {
       let id = e.target.id;
       if (id === "autoUpdate") this.setState({ autoUpdate: e.target.checked });
 
       if (id === "fixedScroll") {
          if (e.target.checked) {
             document.addEventListener('scroll', this.fixedScrollHandler);
          } else {
             document.removeEventListener('scroll', this.fixedScrollHandler);
          }
          this.setState({ fixedScroll: e.target.checked });
          this.setState({ fixedScrollTrigger: e.target.checked });
       }
 
       if (id === "showOnlyLiked") this.setState({ showOnlyLiked: e.target.checked });
 
       if (id === "clearOld") this.setState({ clearOld: e.target.checked });
 
       if (id === "stopUpload") this.setState({ stopUpload: e.target.checked });
    }
 
    fixedScrollHandler(e) {
       if (window.pageYOffset > document.documentElement.clientHeight / 2) {
          this.setState({ fixedScrollTrigger: true });
       } else {
          this.setState({ fixedScrollTrigger: false });
       }
    }
 
    manualUpdateWall() {
       this.setState({ autoUpdate: true });
       setTimeout(() => {
          this.setState({ autoUpdate: false });
       }, 10);
    }
 
    changePostsCount(current, total) {
       this.setState({ postsOnScreen: current, totalPosts: total });
    }
 
    render() {
       return <div id="feed">
          <div className="content-wrapper feed-wrapper">
             <PostWall autoUpdate={this.state.autoUpdate} changeCount={this.changePostsCount} manualUpdate={this.manualUpdateWall} fixedScroll={this.state.fixedScrollTrigger} showOnlyLiked={this.state.showOnlyLiked} clearOld={this.state.clearOld} stopUpload={this.state.stopUpload} />
             <Controls change={this.changeSettings} postsOnScreen={this.state.postsOnScreen} totalPosts={this.state.totalPosts} />
          </div>
       </div>
    }
 }

 export default Feed;