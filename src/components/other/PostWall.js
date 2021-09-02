import React from "react";
import PostObj from "./PostObj";
import Post from "./Post";
import  ShowNewPosts from "./ShowNewPosts"

class PostWall extends React.Component {
    constructor(props) {
       super(props);
 
       this.state = {
          postList: {},
       };
       this.localList = {};
       this.idCounter = 0;
       this.maxPostCount = 50;
 
       this.manualUpdate = this.manualUpdate.bind(this);
       this.updateState = this.updateState.bind(this);
       //throttling
       this.isThrottled = false;
       this.queueIsEmpty = true;
    }
 
    updateState() {
       this.wallUpdate();
    }
 
    addRandomPost() {
       if (this.props.stopUpload) return;
       new Promise(resolve => {
          let req = new XMLHttpRequest();
          req.onload = function () {
             resolve(this.responseURL);
          };
          req.open("get", "https://picsum.photos/1024/768/?random", true);
          req.send();
       }).then(url => {
          let randomImages = { postImage: url };
          return new Promise(resolve => {
             let req = new XMLHttpRequest();
             req.onload = function () {
                randomImages.avatarImage = JSON.parse(this.responseText).results[0].picture.medium;
                resolve(randomImages);
             };
             req.open("get", "https://randomuser.me/api/?inc=picture", true);
             req.send();
          });
       }).then(randomImages => {
          let postObject = new PostObj({
             list: this.localList,
             update: this.updateState,
             id: this.idCounter,
             avatar: randomImages.avatarImage,
             nameLength: Math.round(60 - 0.5 + Math.random() * (100 - 60 + 0.5)),
             img: randomImages.postImage
          });
 
          if (this.props.clearOld) {
             if (Object.keys(this.localList).length >= this.maxPostCount) {
                delete this.localList[Math.min(...Object.keys(this.localList))];
             }
          }
 
          if (Object.keys(this.localList).length < this.maxPostCount) {
             this.localList[this.idCounter] = postObject;
             this.idCounter++;
          }
 
          this.wallUpdate();
 
       });
    }
 
    getSnapshotBeforeUpdate(prevProps, prevState) {
       this.prevDocHeight = document.documentElement.scrollHeight;
       this.scrollPosition = document.documentElement.scrollHeight - window.pageYOffset;
       return { prevDocHeight: this.prevDocHeight, scrollPosition: this.scrollPosition };
    }
 
    componentDidUpdate(prevProps, prevState, snapshot) {
       if (this.props.fixedScroll) {
          if (document.documentElement.scrollHeight > snapshot.prevDocHeight) {
             let newScroll = document.documentElement.scrollHeight - snapshot.scrollPosition;
             window.scrollTo(0, newScroll);
          }
       }
    }
 
    wallUpdate() {
       if (!this.isThrottled) {
          this.isThrottled = true;
          this.setState({ postList: this.localList });
          this.props.changeCount(document.querySelectorAll('.post').length, Object.keys(this.localList).length);
          setTimeout(() => {
             this.isThrottled = false;
             if (!this.queueIsEmpty) this.wallUpdate();
          }, 200);
       } else {
          this.queueIsEmpty = false;
       }
    }
 
    wallUpdateBackup() {
       this.setState({ postList: this.localList });
       this.props.changeCount(document.querySelectorAll('.post').length, Object.keys(this.localList).length);
    }
 
    getPostById(id) {
       if (!this.localList[id]) return;
       return (
          <Post id={id} key={id} args={this.state.postList[id]} />
       );
    }
 
    manualUpdate() {
       this.props.manualUpdate();
       setTimeout(() => {
          this.wallUpdate();
       }, 10);
    }
 
    renderAll() {
       if (this.props.showOnlyLiked) {
          let likedPosts = [];
          for (let key in this.state.postList) {
             if (this.state.postList[key].isLiked) {
                likedPosts.unshift(this.getPostById(key));
             }
          }
          if (!likedPosts.length) likedPosts.push(<div className="message"><div className="text-message">No one posts you liked. Press <i className={`far fa-heart`} style={{ color: "#604d92" }}></i> and try again</div></div>)
          return likedPosts;
       }
 
       if (!this.props.autoUpdate) {
          let currentElements = [];
          let currentNodes = document.querySelectorAll('.post');
 
          currentNodes.forEach((val) => {
             if (this.getPostById(val.id)) currentElements.push(this.getPostById(val.id));
          });
 
          let newPostsCount = Object.keys(this.state.postList).length - currentElements.length;
          if (newPostsCount > 0) {
             currentElements.unshift(<ShowNewPosts key={-1} count={newPostsCount.toString()} eventHandler={this.manualUpdate} />);
          }
          return currentElements;
       }
 
       //default render
       let elem = [];
       for (let key in this.state.postList) {
          elem.unshift(this.getPostById(key));
       }
       if (!elem.length) elem.push(<div className="message" key={-2}><div className="text-message">No posts available. Please wait a few seconds</div></div>);
       return elem;
    }
 
    componentDidMount() {
       //instant add first post
       if (!Object.keys(this.state.postList).length) {
          let postObject = new PostObj({
             list: this.localList,
             update: this.updateState,
             id: this.idCounter,
             avatar: "https://justmonk.github.io/react-news-feed-spa-demo/img/user-avatar.jpg",
             nameLength: Math.round(60 - 0.5 + Math.random() * (100 - 60 + 0.5)),
             img: "https://justmonk.github.io/react-news-feed-spa-demo/img/blur-min.jpg"
          });
 
          this.localList[this.idCounter] = postObject;
          this.wallUpdate();
          this.idCounter++;
       }
 
       this.timerId = setInterval(() => {
          this.addRandomPost();
       }, 4000);
    }
    componentWillUnmount() {
       clearInterval(this.timerId);
    }
 
 
    render() {
       let content;
       content = this.renderAll();
 
       return (
          <div className="post-wall">
             {content}
          </div>
       );
 
    }
 
 }
 
 export default PostWall;