
// import React, { useState} from "react";

// class Application extends React.Component {
//     constructor(props) {
//        super(props);
//        this.state = { isMobile: false };
//        this.checkResolution = this.checkResolution.bind(this);
//     }
 
//     checkResolution(e) {
//        if (document.documentElement.offsetWidth < 900 && !this.state.isMobile) this.setState({ isMobile: true });
//        else if (document.documentElement.offsetWidth > 900 && this.state.isMobile) this.setState({ isMobile: false });
//     }
 
//     componentDidMount() {
//        if (document.documentElement.offsetWidth < 900) this.setState({ isMobile: true });
//        else this.setState({ isMobile: false });
//        window.addEventListener('resize', this.checkResolution);
//     }
//     componentWillUnmount() {
//        window.removeEventListener('resize', this.checkResolution);
//     }
 
//     render() {
//        return (
//           <div className="wrapper">
//              <Header isMobile={this.state.isMobile} />
//              <Feed isMobile={this.state.isMobile} />
//              <ScrollTopButton />
//           </div>
//        )
//     }
//  }
 
//  class ScrollTopButton extends React.Component {
//     constructor(props) {
//        super(props);
//        this.state = { 
//           visible: false,
//           styles: { display: 'none' } 
//        };
//        this.visible = false;
//        this.scrollHandler = this.scrollHandler.bind(this);
//        this.resizeHandler = this.resizeHandler.bind(this);
//     }
 
//     scrollHandler() {
//        if (window.pageYOffset > document.documentElement.clientHeight / 2) {
//           if (!this.state.visible) this.setState({ visible: true });
//        } else {
//           if (this.state.visible) this.setState({ visible: false });
//        }
//     }
 
//     resizeHandler() {
//        console.log(`resize`);
//        if (this.isThrottled === undefined) this.isThrottled = false;
//        if (this.isQueueEmpty === undefined) this.isQueueEmpty = true;
       
//        if (!this.isThrottled) {
//           this.isThrottled = true;
//           this.setState( {styles: { position: 'fixed', top: '4.4rem', left: `${document.querySelector('.feed-wrapper').getBoundingClientRect().left - 60}px`, display: `${this.state.visible ? 'block' : 'none'}` } });
//           setTimeout(() => {
//              this.isThrottled = false;
//              if (!this.isQueueEmpty) this.resizeHandler();
//           },100);
//        } else {
//           if (this.isQueueEmpty) this.isQueueEmpty = false;
//        }
       
//     }
 
//     scrollToTop(e) {
//        e.preventDefault();
//        window.scrollTo(0, 0);
//     }
 
//     componentDidMount() {
//        document.addEventListener('scroll', this.scrollHandler);
//        window.addEventListener('resize', this.resizeHandler);
//     }
//     componentWillUnmount() {
//        document.removeEventListener('scroll', this.scrollHandler);
//        window.removeEventListener('resize', this.resizeHandler);
//     }
 
//     render() {
//        if (!document.querySelector('.feed-wrapper')) this.styles = { display: 'none' };
//        else this.styles = { position: 'fixed', top: '4.4rem', left: `${document.querySelector('.feed-wrapper').getBoundingClientRect().left - 60}px`, display: `${this.state.visible ? 'block' : 'none'}` };
 
//        return (
//           <div id="scrollTopButton" style={this.styles}><a href="#" onClick={this.scrollToTop}><i className="far fa-caret-square-up"></i></a></div>
//        );
//     }
//  }
 
//  class Header extends React.Component {
//     constructor(props) {
//        super(props);
//        this.state = {
//           scrollIndicator: false,
//           sideMenuVisible: false
//        };
//        this.showIndicator = this.showIndicator.bind(this);
//        this.showSideMenu = this.showSideMenu.bind(this);
//        this.hideSideMenu = this.hideSideMenu.bind(this);
//     }
 
//     showIndicator() {
//        if (window.pageYOffset > document.documentElement.clientHeight / 2) {
//           if (!this.state.scrollIndicator) this.setState({ scrollIndicator: true });
//        } else {
//           if (this.state.scrollIndicator) this.setState({ scrollIndicator: false });
//        }
//     }
 
//     showSideMenu(e) {
//        e.preventDefault();
//        this.setState({ sideMenuVisible: true });
//        document.querySelector('.right-side').classList.add('side-open');
//        document.body.style.overflow = 'hidden';
//     }
 
//     hideSideMenu(e) {
//        e.preventDefault();
//        this.setState({ sideMenuVisible: false });
//        document.querySelector('.right-side').classList.remove('side-open');
//        document.body.style.overflow = 'visible';
//     }
 
//     componentDidMount() {
//        document.addEventListener('scroll', this.showIndicator);
//     }
 
//     componentWillUnmount() {
//        document.removeEventListener('scroll', this.showIndicator);
//     }
 
//     render() {
//        return (
//           <div id="header">
//              {this.state.sideMenuVisible ? <div className="overlay" onClick={this.hideSideMenu}></div> : ""}
//              <div className={`fixed-header ${this.state.scrollIndicator ? 'scroll-indicator' : ''}`}>
//                 <div className="content-wrapper header-content">
//                    <div className="app-title">
//                       {this.props.isMobile ? <div className="side-menu-button"><a href="#" onClick={this.showSideMenu}><i className="fas fa-bars"></i></a></div> : ""}
//                       <div className="title">LazyFeed</div>
//                    </div>
//                    <div className="header-right-side">
//                       <div className="header-info">
//                          <svg width="75" height="7">
//                             <rect width="100%" height="100%" style={{ fill: "#8075a4" }} />
//                          </svg>
//                          <svg width="40" height="7" style={{ float: "right" }}>
//                             <rect width="100%" height="100%" style={{ fill: "#a4a4a4" }} />
//                          </svg>
//                       </div>
//                       <div className="user-avatar">
//                          <img src="https://justmonk.github.io/react-news-feed-spa-demo/img/user-avatar.jpg" alt="user-avatar"></img>
//                       </div>
//                    </div>
//                 </div>
//              </div>
//           </div>
//        );
//     }
//  }
 
//  class Feed extends React.Component {
//     constructor(props) {
//        super(props);
//        this.state = {
//           autoUpdate: true,
//           fixedScroll: true,
//           fixedScrollTrigger: false,
//           showOnlyLiked: false,
//           clearOld: true,
//           stopUpload: false,
 
//           postsOnScreen: 0,
//           totalPosts: 0
//        }
//        this.changeSettings = this.changeSettings.bind(this);
//        this.changePostsCount = this.changePostsCount.bind(this);
//        this.manualUpdateWall = this.manualUpdateWall.bind(this);
//        this.fixedScrollHandler = this.fixedScrollHandler.bind(this);
//     }
 
//     componentDidMount() {
//        //setting fixed scroll by default
//        if (this.state.fixedScroll) {
//           document.addEventListener('scroll', this.fixedScrollHandler);
//        }
//     }
 
//     changeSettings(e) {
//        let id = e.target.id;
//        if (id === "autoUpdate") this.setState({ autoUpdate: e.target.checked });
 
//        if (id === "fixedScroll") {
//           if (e.target.checked) {
//              document.addEventListener('scroll', this.fixedScrollHandler);
//           } else {
//              document.removeEventListener('scroll', this.fixedScrollHandler);
//           }
//           this.setState({ fixedScroll: e.target.checked });
//           this.setState({ fixedScrollTrigger: e.target.checked });
//        }
 
//        if (id === "showOnlyLiked") this.setState({ showOnlyLiked: e.target.checked });
 
//        if (id === "clearOld") this.setState({ clearOld: e.target.checked });
 
//        if (id === "stopUpload") this.setState({ stopUpload: e.target.checked });
//     }
 
//     fixedScrollHandler(e) {
//        if (window.pageYOffset > document.documentElement.clientHeight / 2) {
//           this.setState({ fixedScrollTrigger: true });
//        } else {
//           this.setState({ fixedScrollTrigger: false });
//        }
//     }
 
//     manualUpdateWall() {
//        this.setState({ autoUpdate: true });
//        setTimeout(() => {
//           this.setState({ autoUpdate: false });
//        }, 10);
//     }
 
//     changePostsCount(current, total) {
//        this.setState({ postsOnScreen: current, totalPosts: total });
//     }
 
//     render() {
//        return <div id="feed">
//           <div className="content-wrapper feed-wrapper">
//              <PostWall autoUpdate={this.state.autoUpdate} changeCount={this.changePostsCount} manualUpdate={this.manualUpdateWall} fixedScroll={this.state.fixedScrollTrigger} showOnlyLiked={this.state.showOnlyLiked} clearOld={this.state.clearOld} stopUpload={this.state.stopUpload} />
//              <Controls change={this.changeSettings} postsOnScreen={this.state.postsOnScreen} totalPosts={this.state.totalPosts} />
//           </div>
//        </div>
//     }
//  }
 
//  class PostObj {
//     constructor(options) {
//        this.postList = options.list;
//        this.updateParentState = options.update;
//        this.id = options.id;
//        this.avatar = options.avatar;
//        this.nameLength = options.nameLength || 67;
//        let dateNow = new Date();
//        this.date = `${dateNow.toLocaleString('en', { day: "2-digit" })} ${dateNow.toLocaleString('en', { month: "short" })} at ${dateNow.toLocaleString('ru', { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
//        this.img = options.img;
//        this.likes = 0;
//        this.maxLikes = Math.round(7 - 0.5 + Math.random() * (153 - 7 + 0.5));
//        this.isLiked = false;
//        this.comments = [];
//        this.isExpanded = false;
//        this.views = 1;
//        this.maxViews = Math.round(277 - 0.5 + Math.random() * (1770 - 277 + 0.5));
 
//        //timers
//        this.likeTimer = setInterval(() => {
//           if (this.likes >= this.maxLikes) clearInterval(this.likeTimer);
//           this.likes++;
//           this.updateParentState();
//        }, Math.round(730 - 0.5 + Math.random() * (1650 - 730 + 0.5)));
//        this.viewTimer = setInterval(() => {
//           if (this.views >= this.maxViews) clearInterval(this.viewTimer);
//           this.views++;
//           this.updateParentState();
//        }, Math.round(430 - 0.5 + Math.random() * (1000 - 430 + 0.5)));
 
//        //imported methods
//        this.deleteHandler = this.deleteHandler.bind(this);
//        this.likeHandler = this.likeHandler.bind(this);
//        this.addCommentHandler = this.addCommentHandler.bind(this);
//     }
 
//     get commentsCount() {
//        return this.comments.length;
//     }
 
//     likeHandler(e) {
//        e.preventDefault();
//        let button = e.target.closest('.likes');
//        if (!this.isLiked) {
//           button.classList.toggle('liked');
//           this.likes++;
//        } else {
//           button.classList.toggle('liked');
//           this.likes--;
//        }
//        this.isLiked = !this.isLiked;
//        this.updateParentState();
//     }
 
//     deleteHandler(e) {
//        e.preventDefault();
 
//        e.target.closest('.post').className = 'deleted';
//        //clear interval for better performance
//        clearInterval(this.timerId);
//        delete this.postList[this.id];
//        this.updateParentState();
//     }
 
//     addCommentHandler(e) {
//        e.preventDefault();
//        let form = e.target;
//        let commentText = form.text.value.trim();
//        if (!commentText.length) {
//           form.text.value = "";
//           return;
//        }
//        this.comments.push({
//           userLength: 75,
//           avatar: "https://justmonk.github.io/react-news-feed-spa-demo/img/user-avatar.jpg",
//           text: commentText,
//           type: "user"
//        });
//        form.text.value = "";
//        this.updateParentState();
//     }
 
//  }
 
//  class PostWall extends React.Component {
//     constructor(props) {
//        super(props);
 
//        this.state = {
//           postList: {},
//        };
//        this.localList = {};
//        this.idCounter = 0;
//        this.maxPostCount = 50;
 
//        this.manualUpdate = this.manualUpdate.bind(this);
//        this.updateState = this.updateState.bind(this);
//        //throttling
//        this.isThrottled = false;
//        this.queueIsEmpty = true;
//     }
 
//     updateState() {
//        this.wallUpdate();
//     }
 
//     addRandomPost() {
//        if (this.props.stopUpload) return;
//        new Promise(resolve => {
//           let req = new XMLHttpRequest();
//           req.onload = function () {
//              resolve(this.responseURL);
//           };
//           req.open("get", "https://picsum.photos/1024/768/?random", true);
//           req.send();
//        }).then(url => {
//           let randomImages = { postImage: url };
//           return new Promise(resolve => {
//              let req = new XMLHttpRequest();
//              req.onload = function () {
//                 randomImages.avatarImage = JSON.parse(this.responseText).results[0].picture.medium;
//                 resolve(randomImages);
//              };
//              req.open("get", "https://randomuser.me/api/?inc=picture", true);
//              req.send();
//           });
//        }).then(randomImages => {
//           let postObject = new PostObj({
//              list: this.localList,
//              update: this.updateState,
//              id: this.idCounter,
//              avatar: randomImages.avatarImage,
//              nameLength: Math.round(60 - 0.5 + Math.random() * (100 - 60 + 0.5)),
//              img: randomImages.postImage
//           });
 
//           if (this.props.clearOld) {
//              if (Object.keys(this.localList).length >= this.maxPostCount) {
//                 delete this.localList[Math.min(...Object.keys(this.localList))];
//              }
//           }
 
//           if (Object.keys(this.localList).length < this.maxPostCount) {
//              this.localList[this.idCounter] = postObject;
//              this.idCounter++;
//           }
 
//           this.wallUpdate();
 
//        });
//     }
 
//     getSnapshotBeforeUpdate(prevProps, prevState) {
//        this.prevDocHeight = document.documentElement.scrollHeight;
//        this.scrollPosition = document.documentElement.scrollHeight - window.pageYOffset;
//        return { prevDocHeight: this.prevDocHeight, scrollPosition: this.scrollPosition };
//     }
 
//     componentDidUpdate(prevProps, prevState, snapshot) {
//        if (this.props.fixedScroll) {
//           if (document.documentElement.scrollHeight > snapshot.prevDocHeight) {
//              let newScroll = document.documentElement.scrollHeight - snapshot.scrollPosition;
//              window.scrollTo(0, newScroll);
//           }
//        }
//     }
 
//     wallUpdate() {
//        if (!this.isThrottled) {
//           this.isThrottled = true;
//           this.setState({ postList: this.localList });
//           this.props.changeCount(document.querySelectorAll('.post').length, Object.keys(this.localList).length);
//           setTimeout(() => {
//              this.isThrottled = false;
//              if (!this.queueIsEmpty) this.wallUpdate();
//           }, 200);
//        } else {
//           this.queueIsEmpty = false;
//        }
//     }
 
//     wallUpdateBackup() {
//        this.setState({ postList: this.localList });
//        this.props.changeCount(document.querySelectorAll('.post').length, Object.keys(this.localList).length);
//     }
 
//     getPostById(id) {
//        if (!this.localList[id]) return;
//        return (
//           <Post id={id} key={id} args={this.state.postList[id]} />
//        );
//     }
 
//     manualUpdate() {
//        this.props.manualUpdate();
//        setTimeout(() => {
//           this.wallUpdate();
//        }, 10);
//     }
 
//     renderAll() {
//        if (this.props.showOnlyLiked) {
//           let likedPosts = [];
//           for (let key in this.state.postList) {
//              if (this.state.postList[key].isLiked) {
//                 likedPosts.unshift(this.getPostById(key));
//              }
//           }
//           if (!likedPosts.length) likedPosts.push(<div className="message"><div className="text-message">No one posts you liked. Press <i className={`far fa-heart`} style={{ color: "#604d92" }}></i> and try again</div></div>)
//           return likedPosts;
//        }
 
//        if (!this.props.autoUpdate) {
//           let currentElements = [];
//           let currentNodes = document.querySelectorAll('.post');
 
//           currentNodes.forEach((val) => {
//              if (this.getPostById(val.id)) currentElements.push(this.getPostById(val.id));
//           });
 
//           let newPostsCount = Object.keys(this.state.postList).length - currentElements.length;
//           if (newPostsCount > 0) {
//              currentElements.unshift(<ShowNewPosts key={-1} count={newPostsCount.toString()} eventHandler={this.manualUpdate} />);
//           }
//           return currentElements;
//        }
 
//        //default render
//        let elem = [];
//        for (let key in this.state.postList) {
//           elem.unshift(this.getPostById(key));
//        }
//        if (!elem.length) elem.push(<div className="message" key={-2}><div className="text-message">No posts available. Please wait a few seconds</div></div>);
//        return elem;
//     }
 
//     componentDidMount() {
//        //instant add first post
//        if (!Object.keys(this.state.postList).length) {
//           let postObject = new PostObj({
//              list: this.localList,
//              update: this.updateState,
//              id: this.idCounter,
//              avatar: "https://justmonk.github.io/react-news-feed-spa-demo/img/user-avatar.jpg",
//              nameLength: Math.round(60 - 0.5 + Math.random() * (100 - 60 + 0.5)),
//              img: "https://justmonk.github.io/react-news-feed-spa-demo/img/blur-min.jpg"
//           });
 
//           this.localList[this.idCounter] = postObject;
//           this.wallUpdate();
//           this.idCounter++;
//        }
 
//        this.timerId = setInterval(() => {
//           this.addRandomPost();
//        }, 4000);
//     }
//     componentWillUnmount() {
//        clearInterval(this.timerId);
//     }
 
 
//     render() {
//        let content;
//        content = this.renderAll();
 
//        return (
//           <div className="post-wall">
//              {content}
//           </div>
//        );
 
//     }
 
//  }
 
//  class ShowNewPosts extends React.Component {
//     render() {
//        return (
//           <div className="message">
//              <div className="show-new-button">
//                 <a href="#" onClick={this.props.eventHandler}>Show <span style={{ fontWeight: "bold" }}>{this.props.count}</span> new posts</a>
//              </div>
//           </div>
//        );
//     }
//  }
 
//  class Controls extends React.Component {
//     constructor(props) {
//        super(props);
//        this.state = {
//           count: 0
//        }
//     }
 
//     render() {
//        return (
//           <div className="right-side">
//              <div className="controls" onChange={this.props.change}>
//                 <div className="controls-title">Feed controls</div>
 
//                 <div className="toggle-wrap" title="Automatically append new posts in your feed">
//                    <input id="autoUpdate" type="checkbox" defaultChecked></input>
//                    <label htmlFor="autoUpdate">
//                       Autoupdate
//                    <div className="toggle"><div className="round"></div></div>
//                    </label>
//                 </div>
 
//                 <div className="toggle-wrap" title="Page doesn't jump when you scroll down (more than half screen)">
//                    <input id="fixedScroll" type="checkbox" defaultChecked></input>
//                    <label htmlFor="fixedScroll">
//                       Fixed scroll
//                    <div className="toggle"><div className="round"></div></div>
//                    </label>
//                 </div>
 
//                 <div className="toggle-wrap" title="Show only posts that you liked">
//                    <input id="showOnlyLiked" type="checkbox"></input>
//                    <label htmlFor="showOnlyLiked">
//                       Show only liked
//                    <div className="toggle"><div className="round"></div></div>
//                    </label>
//                 </div>
 
//                 <div className="toggle-wrap" title="If max posts count exceeded, oldest automatically replaced">
//                    <input id="clearOld" type="checkbox" defaultChecked></input>
//                    <label htmlFor="clearOld">
//                       Clear old
//                    <div className="toggle"><div className="round"></div></div>
//                    </label>
//                 </div>
 
//                 <div className="toggle-wrap" title="Dont upload new posts">
//                    <input id="stopUpload" type="checkbox"></input>
//                    <label htmlFor="stopUpload">
//                       Stop upload
//                    <div className="toggle"><div className="round"></div></div>
//                    </label>
//                 </div>
 
//                 <div className="controls-title">App info</div>
//                 <div className="row">
//                    <span>Total posts:</span>
//                    <span>{this.props.totalPosts}</span>
//                 </div>
//                 <div className="row">
//                    <span>On screen:</span>
//                    <span>{this.props.postsOnScreen}</span>
//                 </div>
//                 <div className="row">
//                    <span>Max posts:</span>
//                    <span>50</span>
//                 </div>
 
//              </div>
 
//           </div>
//        );
//     }
//  }
 
//  class Post extends React.Component {
//     constructor(props) {
//        super(props);
//        this.state = { commentsExpanded: true };
//        this.showComments = this.showComments.bind(this);
//        this.hideComment = this.hideComment.bind(this);
//        this.addCommentDecorator = this.addCommentDecorator.bind(this);
//     }
 
//     showComments(e) {
//        e.preventDefault();
//        this.setState({ commentsExpanded: true });
//     }
//     hideComment(e) {
//        e.preventDefault();
//        this.setState({ commentsExpanded: false });
//     }
 
//     addCommentDecorator(e) {
//        e.preventDefault();
//        this.showComments(e);
//        this.props.args.addCommentHandler(e);
//     }
 
//     render() {
//        return (
//           <div className="post" id={this.props.id}>
//              <div className="post-wrapper">
//                 <div className="delete-button"><a href="#" title="Delete this from history" onClick={this.props.args.deleteHandler}><i className="far fa-window-close"></i></a></div>
//                 <UserInfo userAvatar={this.props.args.avatar} date={this.props.args.date} username={this.props.args.nameLength} />
//                 <PostContent content={this.props.args.img} />
//                 <PostInfo likes={this.props.args.likes} views={this.props.args.views} commentsCount={this.props.args.commentsCount} likeHandler={this.props.args.likeHandler} isLiked={this.props.args.isLiked} showComments={this.showComments} />
//                 <Comments comments={this.props.args.comments} isExpanded={this.state.commentsExpanded} hideComment={this.hideComment} />
//                 <CommentInput addCommentHandler={this.addCommentDecorator} />
//              </div>
//           </div>
//        );
//     }
//  }
 
//  class Comments extends React.Component {
//     render() {
//        if (!this.props.comments.length || !this.props.isExpanded) return <div className="empty-comments"></div>;
 
//        let commentsArr = this.props.comments.map((val, i) => {
//           return (
//              <div className="comment" key={i}>
//                 <div className="user-avatar">
//                    <img src={val.avatar} alt="author avatar"></img>
//                 </div>
//                 <div className="user-data">
//                    <div className="username">
//                       <svg width={val.userLength} height="10">
//                          <rect width="100%" height="100%" style={{ fill: "#dbdbdb" }} />
//                       </svg>
//                    </div>
 
//                    <div className="comment-text">
//                       {val.text}
//                    </div>
//                 </div>
//              </div>
//           );
//        });
 
//        let hideButton = <div className="hide-comments-button">
//           <a href="#" onClick={this.props.hideComment}>Hide comments</a>
//        </div>
 
//        return (
//           <div className="comments-container">
//              {this.props.isExpanded ? hideButton : ""}
//              <div className="comments-wrapper">
//                 {commentsArr}
//              </div>
//           </div>
 
//        );
//     }
//  }
 
//  class UserInfo extends React.Component {
//     render() {
//        return (
//           <div className="user-info">
 
//              <div className="user-avatar">
//                 <img src={this.props.userAvatar} alt="author"></img>
//              </div>
 
//              <div className="user-data">
//                 <div className="username">
//                    <svg width={this.props.username.toString()} height="10">
//                       <rect width="100%" height="100%" style={{ fill: "#dbdbdb" }} />
//                    </svg>
//                 </div>
 
//                 <div className="post-date">
//                    {this.props.date}
//                 </div>
//              </div>
 
//           </div>
//        );
//     }
//  }
 
//  class PostInfo extends React.Component {
//     render() {
//        let likeIconStyle = this.props.isLiked ? "fas" : "far";
//        return (
//           <div className="post-info">
//              <div className="likes" onClick={this.props.likeHandler}>
//                 <a href="#">
//                    <div className="icon"><i className={`${likeIconStyle} fa-heart`}></i></div>
//                    <div className="count">{this.props.likes}</div>
//                 </a>
//              </div>
//              <div className="comments" onClick={this.props.showComments}>
//                 <a href="#">
//                    <div className="icon"><i className="far fa-comment-alt"></i></div>
//                    <div className="count">{this.props.commentsCount}</div>
//                 </a>
//              </div>
//              <div className="views">
//                 <div className="icon"><i className="fas fa-eye"></i></div>
//                 <div className="count">{this.props.views}</div>
//              </div>
//           </div>
//        );
//     }
//  }
 
//  class CommentInput extends React.Component {
//     render() {
//        return (
//           <div className="comment-input">
//              <div className="user-avatar">
//                 <img src="https://justmonk.github.io/react-news-feed-spa-demo/img/user-avatar.jpg" alt="user avatar"></img>
//              </div>
//              <form onSubmit={this.props.addCommentHandler}>
//                 <input name="text" type="text" maxLength="200" placeholder="Write you comment here"></input>
//                 <button className="submit-button" type="submit"></button>
//              </form>
//           </div>
//        );
//     }
//  }
 
//  class PostContent extends React.Component {
//     render() {
//        return (
//           <div className="post-content">
//              <img src={this.props.content} alt=""></img>
//           </div>
//        );
//     }
//  }
 
 
//   ReactDOM.render(<Application />, document.getElementById('root'));